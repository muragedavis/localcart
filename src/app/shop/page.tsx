'use client';

import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/api-client';
import ProductCard from '@/components/ProductCard';
import { useCartStore, useAuthStore } from '@/lib/store';
import { ToastContainer, useToast } from '@/components/Toast';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category_name: string;
  stock_quantity?: number;
}

function SkeletonCard() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="skeleton h-48 w-full rounded-none rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-6 w-16" />
          <div className="skeleton h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const addItem = useCartStore((state) => state.addItem);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    apiClient.get('/products')
      .then((r) => setProducts(r.data.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category_name).filter(Boolean)));
    return ['All', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category_name === activeCategory;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn) { window.location.href = '/login'; return; }
    try {
      const response = await apiClient.post('/cart', {
        product_id: product.id,
        quantity: 1,
      });
      if (response.data.success) {
        addItem({ id: product.id, product_id: product.id, product_name: product.name, quantity: 1, price: product.price });
        addToast(`${product.name} added to cart`, 'success');
      }
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to add item to cart');
    }
  };

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {/* Header banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-1">Shop</h1>
          <p className="text-gray-400 text-sm">
            {loading ? 'Loading products...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              className="form-input pl-10 bg-white"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {search && (
            <button onClick={() => setSearch('')} className="btn-secondary px-4">
              Clear
            </button>
          )}
        </div>

        {/* Category pills */}
        {!loading && categories.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
                style={activeCategory === cat ? { backgroundColor: 'var(--color-primary)' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">{error}</p>
          </div>
        )}

        {/* Skeleton grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-1">No products found</p>
            <p className="text-gray-400 text-sm">Try a different search or category</p>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
