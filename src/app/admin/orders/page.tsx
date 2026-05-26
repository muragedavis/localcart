'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormatPrice } from '@/lib/settings-context';
import { ToastContainer, useToast } from '@/components/Toast';

interface Order {
  id: number;
  total_amount: number | string;
  order_status: string;
  payment_status: string;
  created_at: string;
  email: string;
  full_name: string;
}

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number | string;
}

interface OrderDetail extends Order {
  shipping_address: string;
  items: OrderItem[];
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  failed:    'bg-red-100 text-red-700',
  refunded:  'bg-gray-100 text-gray-600',
};

export default function AdminOrders() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState<OrderDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const router = useRouter();
  const formatPrice = useFormatPrice();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get('/admin/orders');
      setOrders(res.data.data);
    } catch {
      addToast('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, order_status: string) => {
    try {
      await apiClient.put(`/admin/orders/${orderId}`, { order_status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status } : o))
      );
      if (viewOrder?.id === orderId) setViewOrder((v) => v ? { ...v, order_status } : v);
    } catch {
      addToast('Failed to update order status');
    }
  };

  const updatePaymentStatus = async (orderId: number, payment_status: string) => {
    try {
      await apiClient.put(`/admin/orders/${orderId}`, { payment_status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, payment_status } : o))
      );
      if (viewOrder?.id === orderId) setViewOrder((v) => v ? { ...v, payment_status } : v);
    } catch {
      addToast('Failed to update payment status');
    }
  };

  const openOrderDetail = async (order: Order) => {
    setLoadingDetail(true);
    setViewOrder({ ...order, shipping_address: '', items: [] });
    try {
      const res = await apiClient.get(`/admin/orders/${order.id}`);
      setViewOrder(res.data.data);
    } catch {
      addToast('Failed to load order details');
      setViewOrder(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading) {
    return <div className="container py-20 text-center text-gray-400">Loading orders...</div>;
  }

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
              <span className="text-gray-900 font-medium">Orders</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          </div>
          <span className="text-sm text-gray-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="container py-8">
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No orders yet</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.full_name}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-primary)' }}>
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.order_status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none ${ORDER_STATUS_COLORS[order.order_status] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.payment_status}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none ${PAYMENT_STATUS_COLORS[order.payment_status] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="text-sm font-medium hover:underline"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewOrder(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Order #{viewOrder.id}</h2>
                <p className="text-sm text-gray-400">{new Date(viewOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewOrder(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingDetail ? (
              <div className="p-8 text-center text-gray-400">Loading order details...</div>
            ) : (
              <div className="p-5 space-y-5">
                {/* Customer */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Customer</p>
                  <p className="font-semibold text-gray-900">{viewOrder.full_name}</p>
                  <p className="text-sm text-gray-500">{viewOrder.email}</p>
                  {viewOrder.shipping_address && (
                    <p className="text-sm text-gray-500 mt-1">{viewOrder.shipping_address}</p>
                  )}
                </div>

                {/* Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Order Status</p>
                    <select
                      value={viewOrder.order_status}
                      onChange={(e) => updateOrderStatus(viewOrder.id, e.target.value)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border-0 cursor-pointer w-full ${ORDER_STATUS_COLORS[viewOrder.order_status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Payment</p>
                    <select
                      value={viewOrder.payment_status}
                      onChange={(e) => updatePaymentStatus(viewOrder.id, e.target.value)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border-0 cursor-pointer w-full ${PAYMENT_STATUS_COLORS[viewOrder.payment_status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Items</p>
                  <div className="space-y-2">
                    {viewOrder.items.length === 0 ? (
                      <p className="text-sm text-gray-400">No items found</p>
                    ) : viewOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {formatPrice(Number(item.unit_price) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                    {formatPrice(viewOrder.total_amount)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
