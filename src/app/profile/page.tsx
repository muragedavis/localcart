'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  total_amount: number | string;
  order_status: string;
  payment_status: string;
  created_at: string;
  item_count: number;
}

const statusColors: Record<string, string> = {
  delivered:  'badge-green',
  processing: 'badge-blue',
  shipped:    'badge-blue',
  cancelled:  'badge-red',
  pending:    'badge-yellow',
};

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hydrate = useAuthStore((state) => state.hydrate);
  const logout = useAuthStore((state) => state.logout);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    hydrate();
    setIsHydrated(true);
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isLoggedIn) { router.push('/login'); return; }
    apiClient.get('/orders')
      .then((r) => setOrders(r.data.data))
      .catch((e) => console.error('Failed to fetch orders:', e))
      .finally(() => setLoading(false));
  }, [isHydrated, isLoggedIn, router]);

  if (!isHydrated) return null;
  if (!isLoggedIn) return null;

  const formatAmount = (v: number | string) => Number(v).toFixed(2);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your profile and view your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-primary)' }}>
                  {user?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user?.full_name}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-500">Role</span>
                  <span className="badge badge-blue capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-500">Total orders</span>
                  <span className="font-semibold text-gray-900">{orders.length}</span>
                </div>
              </div>
            </div>

            {user?.role === 'admin' && (
              <Link href="/admin" className="card flex items-center gap-3 hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, white)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    style={{ color: 'var(--color-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Admin Panel</p>
                  <p className="text-xs text-gray-400">Manage store settings</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            <button
              onClick={() => { logout(); router.push('/'); }}
              className="w-full btn-secondary text-sm py-3 text-red-500 hover:bg-red-50 hover:border-red-200"
            >
              Sign out
            </button>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-900">Order History</h2>
              <Link href="/shop" className="btn-primary text-sm">+ New Order</Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="skeleton h-4 w-24" />
                        <div className="skeleton h-3 w-32" />
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="skeleton h-4 w-16" />
                        <div className="skeleton h-3 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="card text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-700 mb-1">No orders yet</p>
                <p className="text-gray-400 text-sm mb-5">Your order history will appear here</p>
                <Link href="/shop" className="btn-primary">Browse products</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="card p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                          {order.item_count > 0 && ` · ${order.item_count} item${order.item_count !== 1 ? 's' : ''}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${formatAmount(order.total_amount)}</p>
                        <span className={`badge mt-1 inline-block ${statusColors[order.order_status] ?? 'badge-gray'}`}>
                          {order.order_status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
