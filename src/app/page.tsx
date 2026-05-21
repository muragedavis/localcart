'use client';

import Link from 'next/link';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    desc: 'Optimized for speed on any device. Browse and checkout without delays.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Secure & Safe',
    desc: 'Your data is protected with modern security and encrypted transactions.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Mobile Friendly',
    desc: 'Shop anywhere, anytime. Seamless experience across all your devices.',
  },
];

const stats = [
  { value: '5K+', label: 'Products' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '50K+', label: 'Orders Delivered' },
  { value: '99%', label: 'Satisfaction Rate' },
];

const steps = [
  { step: '01', title: 'Sign Up', desc: 'Create your account in seconds — free forever.' },
  { step: '02', title: 'Browse', desc: 'Explore our wide selection of quality products.' },
  { step: '03', title: 'Add to Cart', desc: 'Pick what you love and head to checkout.' },
  { step: '04', title: 'Delivered', desc: 'Get your order right to your doorstep.' },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[580px] flex items-center overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
        {/* Background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/3 -right-1/4 w-[700px] h-[700px] rounded-full bg-white/5" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/[0.03]" />
        </div>

        <div className="container relative z-10 py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
            Free shipping on all orders
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-5 leading-[1.08]">
            Shop local,<br />
            <span className="text-white/80">shop smart.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
            Fast, modern online shopping built for local businesses and their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white font-semibold rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: 'var(--color-primary)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Start Shopping
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl text-base border border-white/25 hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map((s) => (
              <div key={s.label} className="py-8 text-center">
                <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why LocalCart?</h2>
            <p className="text-gray-500 max-w-md mx-auto">Everything you need for a smooth shopping experience, built in from day one.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-hover p-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-md mx-auto">From sign-up to doorstep in four simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gray-200" />
            {steps.map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-sm border border-gray-100 bg-white">
                  <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{s.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products preview ── */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">Featured Products</h2>
              <p className="text-gray-500 text-sm">Handpicked for you</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold hover:underline flex items-center gap-1 transition-colors"
              style={{ color: 'var(--color-primary)' }}>
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-hover p-0 overflow-hidden">
                <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="p-4">
                  <span className="badge badge-gray mb-2">Category</span>
                  <h3 className="font-semibold text-gray-900 mb-1">Product {i}</h3>
                  <p className="text-gray-400 text-xs mb-3">High quality product description</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">$29.99</span>
                    <Link href="/shop" className="btn-primary text-xs px-3 py-2">Shop</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Support / WhatsApp CTA ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="card overflow-hidden p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Info side */}
              <div className="p-10 md:p-12">
                <span className="badge badge-green mb-4">24/7 Support</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Need Help?</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Our friendly support team is always ready to assist you with any questions or concerns.
                </p>
                <div className="space-y-4">
                  <a
                    href="https://wa.me/923001234567?text=Hello%20LocalCart%20Support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.226l-.041.021-4.268-.559.569 4.152.036.057a9.64 9.64 0 001.479 4.727c3.113 5.395 9.911 7.035 15.31 3.922 1.674-.963 3.124-2.38 4.152-3.963l-.067-.108a9.645 9.645 0 00-3.849-3.12c-1.023-.537-2.127-.889-3.149-.902zm8.143-7.339C13.966 2.182 7.693 2.701 3.52 7.026 1.246 9.36.102 12.336.013 15.32a15.34 15.34 0 002.087 7.697l-2.185 7.977L8.08 22.938a15.17 15.17 0 007.239 1.843c7.932 0 14.385-6.453 14.385-14.385 0-3.84-1.545-7.456-4.332-10.133" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <div className="flex flex-col gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +92 300 123 4567
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      support@localcart.com
                    </span>
                  </div>
                </div>
              </div>
              {/* Visual side */}
              <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-emerald-50 to-emerald-100">
                <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-xl mb-5">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.226l-.041.021-4.268-.559.569 4.152.036.057a9.64 9.64 0 001.479 4.727c3.113 5.395 9.911 7.035 15.31 3.922 1.674-.963 3.124-2.38 4.152-3.963l-.067-.108a9.645 9.645 0 00-3.849-3.12c-1.023-.537-2.127-.889-3.149-.902zm8.143-7.339C13.966 2.182 7.693 2.701 3.52 7.026 1.246 9.36.102 12.336.013 15.32a15.34 15.34 0 002.087 7.697l-2.185 7.977L8.08 22.938a15.17 15.17 0 007.239 1.843c7.932 0 14.385-6.453 14.385-14.385 0-3.84-1.545-7.456-4.332-10.133" />
                  </svg>
                </div>
                <p className="text-emerald-800 font-semibold text-center">We respond within minutes</p>
                <p className="text-emerald-600 text-sm text-center mt-1">Available around the clock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500 max-w-md mx-auto">Everything you need to know before you start shopping.</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { q: 'How do I place an order?', a: 'Browse products, add to cart, and proceed to checkout. We accept cash on delivery, card, and bank transfer.' },
              { q: 'How long does delivery take?', a: 'Most orders are delivered within 3–5 business days. Express delivery is available in select areas.' },
              { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery, Credit/Debit Cards, and Bank Transfers.' },
              { q: "What's your refund policy?", a: 'We offer 30-day returns on all products. Contact our support team for a hassle-free refund.' },
            ].map(({ q, a }) => (
              <details key={q} className="card group cursor-pointer p-0 overflow-hidden">
                <summary className="flex items-center justify-between p-5 font-semibold text-gray-900 list-none select-none">
                  {q}
                  <svg className="w-5 h-5 text-gray-400 transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-gray-500 text-sm leading-relaxed px-5 pb-5">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="section text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-white/5" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-white/5" />
        </div>
        <div className="container text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Ready to shop?</h2>
          <p className="text-white/75 text-lg mb-8 max-w-md mx-auto">
            Join thousands of happy customers. Sign up in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white font-semibold rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: 'var(--color-primary)' }}
            >
              Browse products
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl text-base border border-white/25 hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
