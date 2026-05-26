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
    <div className="bg-white border border-gray-100 overflow-hidden">
      <div className="skeleton h-60 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-8 w-24" />
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
      <div className="bg-[#0a0a0a] text-white">
        <div className="container py-16 md:py-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-[2px]" style={{ backgroundColor: 'var(--color-primary)' }} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500">
              {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} available`}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white leading-none">
            Shop<br />
            <span style={{ color: 'var(--color-primary)' }}>Everything.</span>
          </h1>
        </div>
      </div>

      <div className="container py-10">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              className="form-input pl-12"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {search && (
            <button onClick={() => setSearch('')} className="btn-secondary px-6">
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
                className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all duration-200 ${
                  activeCategory === cat
                    ? 'text-white'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-900 hover:text-gray-900'
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
            <div className="w-14 h-14 bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400">{error}</p>
          </div>
        )}

        {/* Skeleton grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-100">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-gray-700 mb-1">No products found</p>
            <p className="text-xs text-gray-400 tracking-wide">Try a different search or category</p>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-100">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
