'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import ProductCard from '@/components/ProductCard';
import { useCartStore, useAuthStore } from '@/lib/store';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category_name: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const addItem = useCartStore((state) => state.addItem);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/products');
      setProducts(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    addItem({
      id: product.id,
      product_id: product.id,
      product_name: product.name,
      quantity: 1,
      price: product.price,
    });
    alert('Added to cart!');
  };

  if (loading) return <div className="container py-20 text-center">Loading...</div>;
  if (error) return <div className="container py-20 text-center text-red-600">{error}</div>;

  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-12">Shop</h1>
      <div className="grid grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
