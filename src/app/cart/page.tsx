'use client';

import { useState, useEffect } from 'react';
import { useCartStore, useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank'>('cash');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hydrate = useAuthStore((state) => state.hydrate);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    hydrate();
    setIsHydrated(true);
  }, [hydrate]);

  if (!isHydrated) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Sign in to view your cart</p>
        <Link href="/login" className="btn-primary">Sign in</Link>
      </div>
    );
  }

  const proceedWithOrder = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/orders', {
        items: items.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
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

  const handleCheckout = async () => {
    if (items.length === 0) { alert('Your cart is empty'); return; }
    if (paymentMethod === 'cash') { setShowConfirm(true); return; }
    proceedWithOrder();
  };

  const paymentOptions = [
    { value: 'cash', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    )},
    { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, and more', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    )},
    { value: 'bank', label: 'Bank Transfer', desc: 'Direct bank-to-bank payment', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
    )},
  ] as const;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-10">
        <div className="mb-6">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continue shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">
            Your cart
            {items.length > 0 && <span className="ml-2 text-lg font-normal text-gray-400">({items.length} {items.length === 1 ? 'item' : 'items'})</span>}
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="card text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold mb-1">Your cart is empty</p>
            <p className="text-gray-400 text-sm mb-6">Add some products to get started</p>
            <Link href="/shop" className="btn-primary">Browse products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="card flex items-center gap-4 p-4">
                  {/* Placeholder image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.product_name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">${item.price.toFixed(2)} each</p>
                  </div>

                  {/* Quantity control */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) removeItem(item.id);
                        else if (updateQuantity) updateQuantity(item.id, item.quantity - 1);
                        else removeItem(item.id);
                      }}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => { if (updateQuantity) updateQuantity(item.id, item.quantity + 1); }}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-lg leading-none"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-bold text-gray-900 w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="space-y-4">
              <div className="card">
                <h2 className="font-bold text-lg text-gray-900 mb-4">Order summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-gray-900">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Payment method</h3>
                <div className="space-y-2">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === option.value
                          ? 'border-transparent bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                      style={paymentMethod === option.value ? { borderColor: 'var(--color-primary)', background: 'color-mix(in srgb, var(--color-primary) 8%, white)' } : {}}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={() => { setPaymentMethod(option.value); setShowConfirm(false); }}
                        className="sr-only"
                      />
                      <span className={paymentMethod === option.value ? 'text-primary' : 'text-gray-400'} style={paymentMethod === option.value ? { color: 'var(--color-primary)' } : {}}>
                        {option.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{option.label}</p>
                        <p className="text-xs text-gray-400">{option.desc}</p>
                      </div>
                      {paymentMethod === option.value && (
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* COD confirmation */}
              {showConfirm && paymentMethod === 'cash' && (
                <div className="card border-2 border-emerald-200 bg-emerald-50">
                  <h3 className="font-semibold text-emerald-800 mb-2 text-sm">Confirm cash order</h3>
                  <ul className="text-xs text-emerald-700 space-y-1 mb-4">
                    <li>Amount due: <strong>${getTotalPrice().toFixed(2)}</strong></li>
                    <li>Payment collected on delivery</li>
                    <li>Rider will call before arrival</li>
                  </ul>
                  <div className="flex gap-2">
                    <button onClick={proceedWithOrder} disabled={isLoading} className="btn-success flex-1 text-xs py-2.5">
                      {isLoading ? 'Placing order...' : 'Confirm order'}
                    </button>
                    <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1 text-xs py-2.5">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!showConfirm && (
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || items.length === 0}
                  className="btn-primary w-full py-3.5 text-base"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : `Checkout — $${getTotalPrice().toFixed(2)}`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
