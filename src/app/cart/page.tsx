'use client';

import { useState, useEffect } from 'react';
import { useCartStore, useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormatPrice } from '@/lib/settings-context';
import { ToastContainer, useToast } from '@/components/Toast';

type PaymentMethod = 'cash' | 'mpesa';
type MpesaStep = 'idle' | 'prompt' | 'waiting' | 'confirmed';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaStep, setMpesaStep] = useState<MpesaStep>('idle');

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hydrate = useAuthStore((state) => state.hydrate);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const formatPrice = useFormatPrice();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => { hydrate(); setIsHydrated(true); }, [hydrate]);

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

  const placeOrder = async (method: PaymentMethod) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/orders', {
        items: items.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
        shipping_address: `${user?.full_name}, Default Address`,
        payment_method: method,
      });
      if (response.data.success) {
        clearCart();
        addToast('Order placed successfully!', 'success');
        setTimeout(() => router.push('/profile'), 1500);
      }
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) { addToast('Your cart is empty', 'info'); return; }
    if (paymentMethod === 'cash') { setShowConfirm(true); return; }
    if (paymentMethod === 'mpesa') { setMpesaStep('prompt'); return; }
  };

  const handleMpesaPayment = async () => {
    const normalised = mpesaPhone.trim().replace(/\s+/g, '');
    if (!normalised || !/^(254|0)[17]\d{8}$/.test(normalised)) {
      addToast('Enter a valid Safaricom number (07xx or 01xx)');
      return;
    }
    setMpesaStep('waiting');
    setIsLoading(true);
    try {
      const stkRes = await apiClient.post('/mpesa/stkpush', {
        phone: normalised.startsWith('0') ? `254${normalised.slice(1)}` : normalised,
        amount: getTotalPrice(),
      });
      if (stkRes.data.success) {
        // Simulate M-Pesa callback confirmation after 4s
        setTimeout(async () => {
          setMpesaStep('confirmed');
          await placeOrder('mpesa');
        }, 4000);
      } else {
        addToast(stkRes.data.error || 'M-Pesa request failed');
        setMpesaStep('prompt');
        setIsLoading(false);
      }
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to initiate M-Pesa payment');
      setMpesaStep('prompt');
      setIsLoading(false);
    }
  };

  const paymentOptions: { value: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      value: 'cash',
      label: 'Cash on Delivery',
      desc: 'Pay when your order arrives',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      value: 'mpesa',
      label: 'M-Pesa',
      desc: 'Pay via M-Pesa STK push',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm-5 17a1 1 0 110-2 1 1 0 010 2zm3-4H9V5h6v10z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
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
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.product_name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) removeItem(item.id);
                        else updateQuantity(item.id, item.quantity - 1);
                      }}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-lg leading-none"
                    >−</button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-lg leading-none"
                    >+</button>
                  </div>
                  <p className="font-bold text-gray-900 w-20 text-right">{formatPrice(item.price * item.quantity)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Remove item">
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
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(getTotalPrice())}</span>
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
                        paymentMethod === option.value ? '' : 'border-gray-100 hover:border-gray-200'
                      }`}
                      style={paymentMethod === option.value ? { borderColor: 'var(--color-primary)', background: 'color-mix(in srgb, var(--color-primary) 8%, white)' } : {}}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={() => { setPaymentMethod(option.value); setShowConfirm(false); setMpesaStep('idle'); }}
                        className="sr-only"
                      />
                      <span style={paymentMethod === option.value ? { color: 'var(--color-primary)' } : { color: '#9CA3AF' }}>
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

              {/* Cash on Delivery confirm */}
              {showConfirm && paymentMethod === 'cash' && (
                <div className="card border-2 border-emerald-200 bg-emerald-50">
                  <h3 className="font-semibold text-emerald-800 mb-2 text-sm">Confirm cash order</h3>
                  <ul className="text-xs text-emerald-700 space-y-1 mb-4">
                    <li>Amount due: <strong>{formatPrice(getTotalPrice())}</strong></li>
                    <li>Payment collected on delivery</li>
                    <li>Rider will call before arrival</li>
                  </ul>
                  <div className="flex gap-2">
                    <button onClick={() => placeOrder('cash')} disabled={isLoading} className="btn-success flex-1 text-xs py-2.5">
                      {isLoading ? 'Placing order...' : 'Confirm order'}
                    </button>
                    <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1 text-xs py-2.5">Cancel</button>
                  </div>
                </div>
              )}

              {/* M-Pesa phone input */}
              {mpesaStep === 'prompt' && paymentMethod === 'mpesa' && (
                <div className="card border-2 bg-green-50" style={{ borderColor: '#4CAF50' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 text-sm">M-Pesa Payment</h3>
                      <p className="text-xs text-green-700">Amount: <strong>{formatPrice(getTotalPrice())}</strong></p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-green-800 mb-1">Safaricom Phone Number</label>
                    <input
                      type="tel"
                      placeholder="07xx xxx xxx"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="form-input text-sm py-2"
                      maxLength={13}
                    />
                    <p className="text-xs text-green-600 mt-1">You will receive an STK push prompt on this number.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleMpesaPayment} disabled={isLoading} className="flex-1 text-xs py-2.5 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors">
                      Send STK Push
                    </button>
                    <button onClick={() => setMpesaStep('idle')} className="btn-secondary flex-1 text-xs py-2.5">Cancel</button>
                  </div>
                </div>
              )}

              {/* M-Pesa waiting state */}
              {mpesaStep === 'waiting' && paymentMethod === 'mpesa' && (
                <div className="card border-2 bg-green-50 text-center" style={{ borderColor: '#4CAF50' }}>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-green-900 text-sm">Check your phone</p>
                  <p className="text-xs text-green-700 mt-1">Enter your M-Pesa PIN to complete payment of <strong>{formatPrice(getTotalPrice())}</strong></p>
                  <p className="text-xs text-green-500 mt-2">Waiting for confirmation...</p>
                </div>
              )}

              {/* Checkout button */}
              {!showConfirm && mpesaStep === 'idle' && (
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || items.length === 0}
                  className="btn-primary w-full py-3.5 text-base"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : `Checkout — ${formatPrice(getTotalPrice())}`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
