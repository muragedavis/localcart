'use client';

import { useState, useEffect } from 'react';
import { useCartStore, useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const removeItem = useCartStore((state) => state.removeItem);
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);

  if (!isLoggedIn) {
    return (
      <div className="container py-20 text-center">
        <p className="mb-4">Please log in to view your cart</p>
        <Link href="/login" className="btn-primary">
          Login
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/orders', {
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_address: `${user?.full_name}, Default Address`,
      });

      if (response.data.success) {
        alert('Order placed successfully!');
        window.location.href = '/profile';
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-12">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="mb-4 text-gray-600">Your cart is empty</p>
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{item.product_name}</h3>
                    <p className="text-gray-600">
                      ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn-danger"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card h-fit">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
