'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormatPrice } from '@/lib/settings-context';

interface DashboardData {
  sales: { total_orders: number; total_revenue: number | string; total_customers: number; orders_last_30_days: number; };
  topProducts: Array<{ id: number; name: string; total_sold: number; revenue: number | string; }>;
  lowStockProducts: Array<{ id: number; name: string; stock_quantity: number; }>;
  expenses?: { total_expenses: number | string; expenses_this_month: number | string; net_profit: number | string; };
}

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const formatPrice = useFormatPrice();

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    apiClient.get('/admin/dashboard')
      .then((r) => setDashboard(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
          <p className="text-sm text-gray-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { sales, topProducts, lowStockProducts, expenses } = dashboard;
  const netProfit = parseFloat(String(expenses?.net_profit ?? 0));
  const profitPositive = netProfit >= 0;

  const statCards = [
    {
      label: 'Total Orders', value: sales.total_orders, change: '+12%', up: true,
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      label: 'Total Revenue', value: formatPrice(sales.total_revenue ?? 0), change: '+8%', up: true,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Customers', value: sales.total_customers, change: '+5%', up: true,
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      label: 'Orders (30 days)', value: sales.orders_last_30_days, change: '+18%', up: true,
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      gradient: 'from-orange-500 to-amber-600',
    },
  ];

  const quickLinks = [
    { href: '/admin/products', label: 'Manage Products', desc: 'Add, edit, or remove products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', gradient: 'from-blue-500 to-indigo-600' },
    { href: '/admin/orders',   label: 'View Orders',    desc: 'Track and manage all orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', gradient: 'from-violet-500 to-purple-600' },
    { href: '/admin/expenses', label: 'Expenses',       desc: 'Track costs and net profit',  icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', gradient: 'from-red-500 to-rose-600' },
    { href: '/admin/settings', label: 'Site Settings',  desc: 'Customize branding and store', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', gradient: 'from-orange-500 to-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Top bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="container py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Admin Panel</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back, {user?.full_name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((q) => (
              <Link key={q.href} href={q.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition-all duration-150">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={q.icon} />
                </svg>
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((c) => (
            <div key={c.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between mb-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-sm`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon} />
                  </svg>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {c.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">{c.value}</p>
              <p className="text-xs text-gray-400 font-medium">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Profit Summary */}
        {expenses && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Expenses */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{formatPrice(expenses.total_expenses ?? 0)}</p>
                <p className="text-xs text-gray-400 font-medium">Total Expenses</p>
              </div>
            </div>
            {/* This month's expenses */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-sm shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{formatPrice(expenses.expenses_this_month ?? 0)}</p>
                <p className="text-xs text-gray-400 font-medium">Expenses This Month</p>
              </div>
            </div>
            {/* Net Profit */}
            <div className={`rounded-2xl border p-5 flex items-center gap-4 ${profitPositive ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${profitPositive ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={profitPositive ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className={`text-xl font-bold tracking-tight ${profitPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  {formatPrice(Math.abs(netProfit))}
                </p>
                <p className={`text-xs font-medium ${profitPositive ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
                  {profitPositive ? 'Net Profit' : 'Net Loss'} · Revenue − Expenses
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Data Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Top Selling Products</h2>
                <p className="text-xs text-gray-400 mt-0.5">Based on total units sold</p>
              </div>
              <Link href="/admin/products" className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                Manage →
              </Link>
            </div>
            {topProducts.length === 0 ? (
              <div className="text-center py-10 text-gray-300">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-xs text-gray-400">No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-0">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.total_sold} units sold</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0">{formatPrice(p.revenue ?? 0)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Stock Alerts</h2>
                <p className="text-xs text-gray-400 mt-0.5">Items running low on inventory</p>
              </div>
              <Link href="/admin/products" className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                Restock →
              </Link>
            </div>
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-emerald-600">All products well-stocked</p>
              </div>
            ) : (
              <div className="space-y-0">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <div className={`w-1.5 h-8 rounded-full shrink-0 ${p.stock_quantity < 5 ? 'bg-red-400' : 'bg-amber-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.stock_quantity} units left</p>
                    </div>
                    <span className={`badge ${p.stock_quantity < 5 ? 'badge-red' : 'badge-yellow'}`}>
                      {p.stock_quantity < 5 ? 'Critical' : 'Low'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((q) => (
            <Link key={q.href} href={q.href}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${q.gradient} flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={q.icon} />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{q.label}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{q.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs font-semibold transition-all duration-150 group-hover:gap-2"
                style={{ color: 'var(--color-primary)' }}>
                Open <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
