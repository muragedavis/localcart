'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useFormatPrice } from '@/lib/settings-context';
import { ToastContainer, useToast } from '@/components/Toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  status: string;
  category_name: string;
  category_id: number | null;
  image_url: string;
}

interface Category {
  id: number;
  name: string;
}

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock_quantity: '',
  category_id: '',
  image_url: '',
  status: 'active',
};

function ImageUploadField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'product');
      const res = await apiClient.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.url);
    } catch {
      setError('Upload failed. Max 5MB.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Product Image</label>
      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0">
          {value ? (
            <Image src={value} alt="Product" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="space-y-2 flex-1">
          <button type="button" onClick={() => inputRef.current?.click()} className="btn-secondary text-sm" disabled={uploading}>
            {uploading ? 'Uploading...' : value ? 'Replace Image' : 'Upload Image'}
          </button>
          <div>
            <input
              type="text"
              placeholder="or paste image URL"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="form-input text-sm py-1.5"
            />
          </div>
          {value && (
            <button type="button" onClick={() => onChange('')} className="text-xs text-red-500 hover:underline">Remove</button>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default function AdminProducts() {
  const user = useAuthStore((state) => state.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const formatPrice = useFormatPrice();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    fetchProducts();
    fetchCategories();
  }, [user, router]);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/products?limit=200');
      setProducts(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/products?limit=1'); // we'll get categories from a different endpoint if available
      // For now we'll populate from products
    } catch {}
  };

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setFormData({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      stock_quantity: String(p.stock_quantity),
      category_id: p.category_id ? String(p.category_id) : '',
      image_url: p.image_url || '',
      status: p.status,
    });
    setEditingId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        image_url: formData.image_url || null,
        status: formData.status,
      };

      if (editingId) {
        await apiClient.put(`/admin/products/${editingId}`, payload);
      } else {
        await apiClient.post('/products/admin', payload);
      }
      await fetchProducts();
      setShowForm(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
    } catch (e) {
      console.error(e);
      addToast('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch {
      addToast('Failed to delete product.');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category_name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="container py-20 text-center text-gray-500">Loading products...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/admin" className="hover:text-gray-700">Dashboard</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Products</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      <div className="container py-8 space-y-6">
        {/* Add / Edit Form */}
        {showForm && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <ImageUploadField value={formData.image_url} onChange={(url) => setFormData({ ...formData, image_url: url })} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                  <input type="text" required className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select className="form-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea className="form-input resize-none" rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price *</label>
                  <input type="number" required step="0.01" min="0" className="form-input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Qty</label>
                  <input type="number" min="0" className="form-input" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category ID</label>
                  <input type="number" min="1" className="form-input" placeholder="Optional" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary px-6">
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary px-6">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search + Table */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-9 py-2 text-sm"
              />
            </div>
            <span className="text-sm text-gray-400">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No products found</td></tr>
                ) : filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {product.image_url ? (
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-400">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-primary)' }}>
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${product.stock_quantity === 0 ? 'badge-red' : product.stock_quantity < 10 ? 'badge-yellow' : 'badge-green'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{product.category_name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${product.status === 'active' ? 'badge-green' : product.status === 'inactive' ? 'badge-gray' : 'badge-red'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-600">Delete?</span>
                          <button onClick={() => handleDelete(product.id)} className="text-xs font-medium text-red-600 hover:underline">Yes</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-xs font-medium text-gray-500 hover:underline">No</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEdit(product)} className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                            Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(product.id)} className="text-sm font-medium text-red-500 hover:underline">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
