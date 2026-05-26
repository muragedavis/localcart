'use client';

import Link from 'next/link';
import { useSettings } from '@/lib/settings-context';

interface StatItem { value: string; label: string; }
interface FeatureItem { icon: string; title: string; desc: string; }
interface TestimonialItem {
  name: string; role: string; location: string;
  text: string; rating: number; initials: string; accentColor: string;
}
interface PartnerItem { name: string; abbr: string; }

function parse<T>(raw: string, fallback: T[]): T[] {
  try { return JSON.parse(raw) as T[]; } catch { return fallback; }
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  const settings = useSettings();

  const stats = parse<StatItem>(settings.stats_items, []);
  const testimonials = parse<TestimonialItem>(settings.testimonials_items, []);
  const partners = parse<PartnerItem>(settings.partners_items, []);

  const showTestimonials = settings.testimonials_enabled === 'true' && testimonials.length > 0;
  const showPartners = settings.partners_enabled === 'true' && partners.length > 0;
  const showStats = settings.stats_enabled === 'true' && stats.length > 0;

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ backgroundColor: 'var(--color-hero-bg)' }}>
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        </div>

        <div className="container relative z-10 py-32 md:py-40">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-8 h-[2px]" style={{ backgroundColor: 'var(--color-primary)' }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400">
                {settings.site_tagline}
              </span>
            </div>

            <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tighter text-white mb-8 uppercase whitespace-pre-line">
              {settings.hero_title || 'Shop Local,\nThink Big.'}
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-lg leading-relaxed font-light">
              {settings.hero_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 text-sm font-black tracking-widest uppercase text-black bg-white rounded-lg hover:bg-gray-100 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {settings.hero_cta_text || 'Shop Now'}
              </Link>
              <Link href="/register"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 text-sm font-black tracking-widest uppercase text-white rounded-lg border-2 border-white/20 hover:border-white/60 transition-all duration-200">
                Create Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase text-gray-600">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-gray-600 to-transparent" />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      {showStats && (
        <section className="bg-white border-b border-gray-100">
          <div className="container">
            <div className={`grid grid-cols-2 md:grid-cols-${stats.length <= 4 ? stats.length : 4}`}>
              {stats.map((s, i) => (
                <div key={s.label}
                  className={`py-10 px-6 text-center ${i < stats.length - 1 ? 'border-r border-gray-100' : ''}`}>
                  <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-1">{s.value}</p>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES ── */}
      {settings.features_enabled === 'true' && (
        <section className="section bg-[#f5f5f5]">
          <div className="container">
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-[2px]" style={{ backgroundColor: 'var(--color-primary)' }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                {settings.features_title || 'Built For Performance.'}
              </h2>
            </div>

            {(() => {
              const features = parse<FeatureItem>(settings.features_items, []);
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
                  {features.map((f) => (
                    <div key={f.title} className="bg-white p-8 group hover:bg-gray-900 transition-all duration-300">
                      <div className="w-14 h-14 flex items-center justify-center mb-6 text-2xl rounded-lg
                        group-hover:opacity-90 transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}>
                        {f.icon}
                      </div>
                      <h3 className="font-black text-base uppercase tracking-wider text-gray-900 mb-3 group-hover:text-white transition-colors">{f.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors">{f.desc}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-[2px]" style={{ backgroundColor: 'var(--color-primary)' }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400">Handpicked For You</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                Featured<br />Products.
              </h2>
            </div>
            <Link href="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase hover:gap-4 transition-all duration-200"
              style={{ color: 'var(--color-primary)' }}>
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white group overflow-hidden rounded-lg">
                <div className="h-56 bg-[#f5f5f5] flex items-center justify-center overflow-hidden relative">
                  <svg className="w-16 h-16 text-gray-200 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/5 transition-colors duration-300" />
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Category</p>
                  <h3 className="font-black text-gray-900 text-base uppercase tracking-tight mb-1">Product {i}</h3>
                  <p className="text-gray-400 text-xs mb-4 leading-relaxed">High quality product for everyday use</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-gray-900">
                      {settings.currency_position === 'after' ? `29.99${settings.currency_symbol}` : `${settings.currency_symbol}29.99`}
                    </span>
                    <Link href="/shop"
                      className="text-xs font-black tracking-widest uppercase px-4 py-2 text-white rounded-lg transition-all duration-200 hover:opacity-80"
                      style={{ backgroundColor: 'var(--color-primary)' }}>
                      Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/shop" className="btn-secondary inline-flex">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {showTestimonials && (
        <section className="section" style={{ backgroundColor: 'var(--color-hero-bg)' }}>
          <div className="container">
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-[2px]" style={{ backgroundColor: 'var(--color-primary)' }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">Customer Stories</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                What People<br />Are Saying.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-800">
              {testimonials.map((t) => (
                <div key={t.name} className="p-10 group hover:bg-white/5 transition-colors duration-300"
                  style={{ backgroundColor: 'var(--color-hero-bg)' }}>
                  <StarRating count={t.rating} />
                  <blockquote className="text-gray-300 text-base leading-relaxed mt-6 mb-8 font-light">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center shrink-0 rounded-lg"
                      style={{ backgroundColor: t.accentColor || 'var(--color-primary)' }}>
                      <span className="text-white font-black text-sm tracking-wider">{t.initials}</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm tracking-wide">{t.name}</p>
                      <p className="text-gray-500 text-xs tracking-widest uppercase mt-0.5">{t.role} · {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TRUSTED PARTNERS ── */}
      {showPartners && (
        <section className="section-sm bg-white border-t border-b border-gray-100">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 justify-center mb-3">
                <span className="w-6 h-[2px]" style={{ backgroundColor: 'var(--color-primary)' }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400">Trusted Partners</span>
                <span className="w-6 h-[2px]" style={{ backgroundColor: 'var(--color-primary)' }} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">
                Brands We Work With.
              </h2>
            </div>

            <div className={`grid grid-cols-3 md:grid-cols-${Math.min(partners.length, 6)} gap-px bg-gray-100`}>
              {partners.map((p) => (
                <div key={p.name}
                  className="bg-white py-10 flex flex-col items-center justify-center gap-3 group hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-14 h-14 bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center rounded-lg transition-colors duration-200">
                    <span className="text-xs font-black tracking-widest text-gray-500">{p.abbr}</span>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SUPPORT / WHATSAPP ── */}
      <section className="section bg-[#f5f5f5]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
            {/* Info side */}
            <div className="bg-white p-12 md:p-16">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-6 h-[2px] bg-emerald-500" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-500">24/7 Support</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-6">
                We&apos;re Here<br />For You.
              </h2>
              <p className="text-gray-500 mb-10 leading-relaxed">
                Our team is always on standby. Reach us on WhatsApp and get a response within minutes — any time, any day.
              </p>
              <a href={`https://wa.me/${settings.store_phone?.replace(/\D/g, '') || '923001234567'}?text=Hello%20Support`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20b857] text-white text-sm font-black tracking-widest uppercase rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mb-8">
                <svg className="w-5 h-5" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M27.9 24.4c-.36-.18-2.12-1.05-2.45-1.17-.32-.12-.56-.18-.79.18-.24.36-.92 1.17-1.12 1.4-.2.24-.41.27-.77.09-.36-.18-1.53-.56-2.91-1.79-1.08-.96-1.8-2.14-2.01-2.5-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.2.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.79-1.9-1.08-2.6-.28-.68-.57-.59-.79-.6-.2-.01-.45-.01-.69-.01-.24 0-.62.09-.95.45-.32.36-1.22 1.19-1.22 2.91s1.25 3.37 1.43 3.61c.18.24 2.46 3.76 5.96 5.27.83.36 1.48.57 1.99.73.84.26 1.6.22 2.2.13.67-.1 2.07-.85 2.36-1.66.29-.82.29-1.52.2-1.66-.09-.15-.32-.24-.68-.42z" />
                </svg>
                Chat on WhatsApp
              </a>
              <div className="flex flex-col gap-3 text-sm text-gray-400">
                {settings.store_phone && (
                  <span className="flex items-center gap-3">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {settings.store_phone}
                  </span>
                )}
                {settings.store_email && (
                  <span className="flex items-center gap-3">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {settings.store_email}
                  </span>
                )}
              </div>
            </div>

            {/* Visual side */}
            <div className="p-12 md:p-16 flex flex-col justify-between"
              style={{ backgroundColor: 'var(--color-hero-bg)' }}>
              <div>
                <div className="text-7xl font-black text-gray-800 uppercase tracking-tighter leading-none mb-8">
                  Always<br />Online.
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  No bots. No wait times. Real people, real solutions — because your experience matters.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-12">
                {['Instant Reply', 'Friendly Team', '24/7 Active'].map((item) => (
                  <div key={item} className="border border-gray-800 p-4 text-center rounded-lg">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600 leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      {settings.cta_enabled === 'true' && (
        <section className="relative py-32 md:py-40 overflow-hidden"
          style={{ backgroundColor: 'var(--color-hero-bg)' }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 rounded-full"
              style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 60%)' }} />
          </div>
          <div className="container relative z-10 text-center">
            <div className="inline-flex items-center gap-2 justify-center mb-8">
              <span className="w-6 h-[2px]" style={{ backgroundColor: 'var(--color-primary)' }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">Join Thousands of Shoppers</span>
              <span className="w-6 h-[2px]" style={{ backgroundColor: 'var(--color-primary)' }} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none mb-6">
              {settings.cta_title || 'Ready\nTo Shop?'}
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto font-light">
              {settings.cta_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 text-sm font-black tracking-widest uppercase text-black bg-white rounded-lg hover:bg-gray-100 transition-all duration-200">
                {settings.cta_button_text || 'Browse Products'}
              </Link>
              <Link href="/register"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 text-sm font-black tracking-widest uppercase text-white rounded-lg border-2 border-white/20 hover:border-white/60 transition-all duration-200">
                Create Account
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
