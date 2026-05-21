'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) return <div className="container py-20">Loading...</div>;
  if (!dashboard) return <div className="container py-20">Failed to load dashboard</div>;

  const { sales, topProducts, lowStockProducts } = dashboard;

  return (
    <div className="container py-20">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products" className="btn-primary">
            Manage Products
          </Link>
          <Link href="/admin/orders" className="btn-secondary">
            View Orders
          </Link>
          <Link href="/admin/settings" className="btn-secondary">
            ⚙️ Site Settings
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="card text-center">
          <p className="text-gray-600 mb-2">Total Orders</p>
          <p className="text-4xl font-bold">{sales.total_orders}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 mb-2">Total Revenue</p>
          <p className="text-4xl font-bold">${Number(sales.total_revenue ?? 0).toFixed(0)}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 mb-2">Total Customers</p>
          <p className="text-4xl font-bold">{sales.total_customers}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 mb-2">Orders (30 days)</p>
          <p className="text-4xl font-bold">{sales.orders_last_30_days}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="card">
          <h2 className="font-bold text-lg mb-6">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.total_sold} sold</p>
                </div>
                <p className="font-bold text-blue-600">${Number(product.revenue ?? 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <h2 className="font-bold text-lg mb-6">Low Stock Products</h2>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-600">All products have sufficient stock</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-600 text-sm">Stock: {product.stock_quantity}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${product.stock_quantity < 5 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {product.stock_quantity < 5 ? 'Critical' : 'Low'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
