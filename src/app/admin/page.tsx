'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormatPrice } from '@/lib/settings-context';

interface DashboardData {
  sales: {
    total_orders: number;
    total_revenue: number | string;
    total_customers: number;
    orders_last_30_days: number;
  };
  topProducts: Array<{
    id: number;
    name: string;
    total_sold: number;
    revenue: number | string;
  }>;
  lowStockProducts: Array<{
    id: number;
    name: string;
    stock_quantity: number;
  }>;
}

const statCards = (sales: DashboardData['sales'], formatPrice: (v: number | string) => string) => [
  {
    label: 'Total Orders',
    value: sales.total_orders,
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    accent: '#3B82F6',
    change: '+12%',
  },
  {
    label: 'Total Revenue',
    value: formatPrice(sales.total_revenue ?? 0),
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    accent: '#10B981',
    change: '+8%',
  },
  {
    label: 'Total Customers',
    value: sales.total_customers,
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    accent: '#8B5CF6',
    change: '+5%',
  },
  {
    label: 'Orders (30 Days)',
    value: sales.orders_last_30_days,
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    accent: '#F59E0B',
    change: '+18%',
  },
];

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const formatPrice = useFormatPrice();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchDashboard();
  }, [user, router]);

  const fetchDashboard = async () => {
    try {
      const response = await apiClient.get('/admin/dashboard');
      setDashboard(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-900 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Loading Dashboard</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <p className="text-sm text-gray-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { sales, topProducts, lowStockProducts } = dashboard;
  const cards = statCards(sales, formatPrice);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">

      {/* Top bar */}
      <div className="bg-[#0a0a0a] text-white">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-[2px] bg-blue-500" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500">Admin Panel</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-white">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.full_name}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black tracking-widest uppercase text-black bg-white hover:bg-gray-100 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Products
              </Link>
              <Link href="/admin/orders"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black tracking-widest uppercase text-white border border-gray-700 hover:border-gray-400 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Orders
              </Link>
              <Link href="/admin/settings"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black tracking-widest uppercase text-white border border-gray-700 hover:border-gray-400 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 mb-10">
          {cards.map((card) => (
            <div key={card.label} className="bg-white p-8 group hover:bg-gray-900 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 flex items-center justify-center text-white group-hover:opacity-90 transition-colors"
                  style={{ backgroundColor: card.accent }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                  </svg>
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 group-hover:text-emerald-400">{card.change}</span>
              </div>
              <p className="text-3xl font-black text-gray-900 tracking-tighter mb-1 group-hover:text-white transition-colors">{card.value}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 group-hover:text-gray-500 transition-colors">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-200">

          {/* Top Selling Products */}
          <div className="bg-white p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-[2px] bg-blue-500" />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">Performance</span>
                </div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">Top Selling</h2>
              </div>
              <Link href="/admin/products" className="text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-gray-900 transition-colors">
                Manage →
              </Link>
            </div>

            {topProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-300">
                <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400">No data yet</p>
              </div>
            ) : (
              <div className="space-y-0">
                {topProducts.map((product, idx) => (
                  <div key={product.id}
                    className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 transition-colors">
                    <span className="text-xs font-black text-gray-200 w-5 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-gray-900 truncate uppercase tracking-tight">{product.name}</h3>
                      <p className="text-[10px] tracking-widest uppercase text-gray-400 mt-0.5">{product.total_sold} units sold</p>
                    </div>
                    <p className="font-black text-sm text-gray-900 shrink-0 tracking-tight">{formatPrice(product.revenue ?? 0)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-[2px] bg-red-500" />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">Inventory</span>
                </div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">Stock Alerts</h2>
              </div>
              <Link href="/admin/products" className="text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-gray-900 transition-colors">
                Restock →
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-bold tracking-widest uppercase text-emerald-600">All stocked up</p>
                <p className="text-xs text-gray-400 mt-1">No low stock alerts</p>
              </div>
            ) : (
              <div className="space-y-0">
                {lowStockProducts.map((product) => (
                  <div key={product.id}
                    className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 transition-colors">
                    <div className={`w-2 h-10 shrink-0 ${product.stock_quantity < 5 ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-gray-900 truncate uppercase tracking-tight">{product.name}</h3>
                      <p className="text-[10px] tracking-widest uppercase text-gray-400 mt-0.5">{product.stock_quantity} units left</p>
                    </div>
                    <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1.5 ${
                      product.stock_quantity < 5
                        ? 'bg-red-50 text-red-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {product.stock_quantity < 5 ? 'Critical' : 'Low'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 mt-px">
          {[
            { href: '/admin/products', label: 'Manage Products', desc: 'Add, edit, or remove products from your store', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', accent: '#3B82F6' },
            { href: '/admin/orders', label: 'View Orders', desc: 'Track and manage all customer orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', accent: '#8B5CF6' },
            { href: '/admin/settings', label: 'Site Settings', desc: 'Customize branding, colors, and store info', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', accent: '#F59E0B' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="bg-white p-8 group hover:bg-gray-900 transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center text-white mb-5 group-hover:opacity-90"
                style={{ backgroundColor: item.accent }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
              </div>
              <h3 className="font-black text-sm uppercase tracking-wider text-gray-900 mb-2 group-hover:text-white transition-colors">{item.label}</h3>
              <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-500 transition-colors">{item.desc}</p>
              <div className="flex items-center gap-1 mt-4 text-[10px] font-black tracking-widest uppercase text-gray-300 group-hover:text-gray-600 transition-colors">
                Go <span>→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
