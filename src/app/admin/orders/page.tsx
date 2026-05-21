'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  total_amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  email: string;
  full_name: string;
}

export default function AdminOrders() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/admin/orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await apiClient.put(`/admin/orders/${orderId}`, {
        order_status: newStatus,
        payment_status: 'completed',
      });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (loading) return <div className="container py-20">Loading...</div>;

  return (
    <div className="container py-20">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold">Order Management</h1>
        <button onClick={() => router.push('/admin')} className="btn-secondary">
          Back to Dashboard
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-bold">Order ID</th>
              <th className="px-6 py-3 text-left font-bold">Customer</th>
              <th className="px-6 py-3 text-left font-bold">Total</th>
              <th className="px-6 py-3 text-left font-bold">Order Status</th>
              <th className="px-6 py-3 text-left font-bold">Payment Status</th>
              <th className="px-6 py-3 text-left font-bold">Date</th>
              <th className="px-6 py-3 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">#{order.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{order.full_name}</p>
                    <p className="text-gray-600 text-sm">{order.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold">${order.total_amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.order_status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="form-input text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${order.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
