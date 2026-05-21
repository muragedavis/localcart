'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  total_amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  item_count: number;
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [isLoggedIn, router]);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-12">My Profile</h1>

      <div className="grid grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="col-span-1 card">
          <h2 className="font-bold text-lg mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="font-medium">{user?.full_name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Role</p>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="col-span-2">
          <h2 className="font-bold text-lg mb-4">My Orders</h2>
          {loading ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">No orders yet</p>
              <Link href="/shop" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">Order #{order.id}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total_amount.toFixed(2)}</p>
                      <p className={`text-sm ${order.order_status === 'delivered' ? 'text-green-600' : 'text-blue-600'}`}>
                        {order.order_status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
