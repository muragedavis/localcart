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
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank'>('cash');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
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

    if (paymentMethod === 'cash') {
      setShowPaymentDetails(true);
      return;
    }

    proceedWithOrder();
  };

  const proceedWithOrder = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/orders', {
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_address: `${user?.full_name}, Default Address`,
        payment_method: paymentMethod,
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
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b">
              <h3 className="font-bold text-sm mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value as 'cash');
                      setShowPaymentDetails(false);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">💵 Cash on Delivery</span>
                </label>
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value as 'card');
                      setShowPaymentDetails(false);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">💳 Credit/Debit Card</span>
                </label>
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value as 'bank');
                      setShowPaymentDetails(false);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">🏦 Bank Transfer</span>
                </label>
              </div>
            </div>

            {showPaymentDetails && paymentMethod === 'cash' && (
              <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                <h3 className="font-bold text-sm text-green-800 mb-2">✓ Cash Payment Details</h3>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>📍 Amount: ${getTotalPrice().toFixed(2)}</li>
                  <li>🚚 Payment will be collected on delivery</li>
                  <li>📱 Our rider will contact you before arrival</li>
                  <li>🎯 Please keep exact change ready</li>
                </ul>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={proceedWithOrder}
                    disabled={isLoading}
                    className="btn-primary text-sm flex-1"
                  >
                    {isLoading ? 'Processing...' : 'Confirm Order'}
                  </button>
                  <button
                    onClick={() => setShowPaymentDetails(false)}
                    className="btn-secondary text-sm flex-1"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {!showPaymentDetails && (
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
