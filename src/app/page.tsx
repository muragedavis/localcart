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
        <svg key={i} className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  const settings = useSettings();

  const stats      = parse<StatItem>(settings.stats_items, []);
  const testimonials = parse<TestimonialItem>(settings.testimonials_items, []);
  const partners   = parse<PartnerItem>(settings.partners_items, []);
  const features   = parse<FeatureItem>(settings.features_items, []);

  const showTestimonials = settings.testimonials_enabled === 'true' && testimonials.length > 0;
  const showPartners     = settings.partners_enabled === 'true' && partners.length > 0;
  const showStats        = settings.stats_enabled === 'true' && stats.length > 0;
  const showFeatures     = settings.features_enabled === 'true' && features.length > 0;

  return (
    <div className="overflow-x-hidden bg-white">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{ background: `linear-gradient(160deg, var(--color-hero-bg) 0%, color-mix(in srgb, var(--color-hero-bg) 85%, var(--color-primary)) 100%)` }}>

        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-30"
            style={{ background: `radial-gradient(circle, color-mix(in srgb, var(--color-primary) 60%, transparent) 0%, transparent 70%)`, filter: 'blur(80px)' }} />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: `radial-gradient(circle, color-mix(in srgb, var(--color-secondary) 50%, transparent) 0%, transparent 70%)`, filter: 'blur(80px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: `radial-gradient(circle, var(--color-accent) 0%, transparent 70%)`, filter: 'blur(60px)' }} />
          {/* Subtle dot grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        </div>

        <div className="container relative z-10 py-28 md:py-36">
          <div className="max-w-3xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 backdrop-blur-sm border border-white/15"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {settings.site_tagline}
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight text-white mb-6 whitespace-pre-line">
              {(settings.hero_title || 'Shop Local,\nThink Big.').split('\n').map((line, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1
                    ? <span style={{ background: `linear-gradient(90deg, var(--color-primary), var(--color-secondary))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{line}</span>
                    : line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>

            <p className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed">
              {settings.hero_subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-16">
              <Link href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))` }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {settings.hero_cta_text || 'Start Shopping'}
              </Link>
              <Link href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white/80 border border-white/15 backdrop-blur-sm hover:bg-white/10 hover:text-white transition-all duration-200">
                Create free account
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Inline stats row */}
            {showStats && (
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">{s.value}</span>
                    <span className="text-xs text-white/40 font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      {showFeatures && (
        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                style={{ background: `color-mix(in srgb, var(--color-primary) 10%, white)`, color: 'var(--color-primary)' }}>
                Why choose us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                {settings.features_title || 'Built for performance.'}
              </h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                {settings.features_subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <div key={f.title}
                  className="group p-7 rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top left, color-mix(in srgb, var(--color-primary) 5%, transparent), transparent 70%)` }} />
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-sm"
                    style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 15%, white), color-mix(in srgb, var(--color-secondary) 10%, white))` }}>
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-[15px]">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    style={{ background: `linear-gradient(90deg, var(--color-primary), var(--color-secondary))` }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section bg-gray-50/60">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                style={{ background: `color-mix(in srgb, var(--color-primary) 10%, white)`, color: 'var(--color-primary)' }}>
                Handpicked for you
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Featured Products</h2>
            </div>
            <Link href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-150 hover:gap-2.5"
              style={{ color: 'var(--color-primary)' }}>
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 transition-all duration-300">
                <div className="h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative">
                  <svg className="w-14 h-14 text-gray-200 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="p-5">
                  <span className="badge badge-gray mb-2">Category</span>
                  <h3 className="font-semibold text-gray-900 mb-1">Product {i}</h3>
                  <p className="text-gray-400 text-xs mb-4 leading-relaxed">Quality product for everyday use</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <span className="text-lg font-bold text-gray-900">
                      {settings.currency_position === 'after' ? `29.99${settings.currency_symbol}` : `${settings.currency_symbol}29.99`}
                    </span>
                    <Link href="/shop" className="btn-primary text-xs py-2 px-4">Shop</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/shop" className="btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {showTestimonials && (
        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                style={{ background: `color-mix(in srgb, var(--color-primary) 10%, white)`, color: 'var(--color-primary)' }}>
                Customer stories
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                What people are saying.
              </h2>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                Thousands of happy customers across Kenya trust us every day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {testimonials.map((t) => (
                <div key={t.name}
                  className="group p-7 rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200 transition-all duration-300 relative overflow-hidden">
                  {/* Quote mark */}
                  <div className="absolute top-4 right-6 text-7xl font-serif leading-none pointer-events-none select-none opacity-[0.04] text-gray-900">"</div>
                  <div className="flex items-center justify-between mb-5">
                    <StarRating count={t.rating} />
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{t.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${t.accentColor || 'var(--color-primary)'}, color-mix(in srgb, ${t.accentColor || 'var(--color-primary)'} 70%, black))` }}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PARTNERS ── */}
      {showPartners && (
        <section className="section-sm border-t border-b border-gray-100 bg-gray-50/60">
          <div className="container">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-10">
              Trusted by leading companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {partners.map((p) => (
                <div key={p.name}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 transition-all duration-200 cursor-default">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                    style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))` }}>
                    {p.abbr.slice(0, 2)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SUPPORT ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            {/* Info */}
            <div className="p-10 md:p-12">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                24/7 support
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-snug mb-4">
                We&apos;re always here<br />when you need us.
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                Our team responds in minutes via WhatsApp. No waiting, no bots — just real help, whenever you need it.
              </p>
              <a href={`https://wa.me/${settings.store_phone?.replace(/\D/g, '') || '923001234567'}?text=Hello`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 mb-7 bg-[#25D366] hover:bg-[#1fb855]">
                <svg className="w-4 h-4" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M27.9 24.4c-.36-.18-2.12-1.05-2.45-1.17-.32-.12-.56-.18-.79.18-.24.36-.92 1.17-1.12 1.4-.2.24-.41.27-.77.09-.36-.18-1.53-.56-2.91-1.79-1.08-.96-1.8-2.14-2.01-2.5-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.2.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.79-1.9-1.08-2.6-.28-.68-.57-.59-.79-.6-.2-.01-.45-.01-.69-.01-.24 0-.62.09-.95.45-.32.36-1.22 1.19-1.22 2.91s1.25 3.37 1.43 3.61c.18.24 2.46 3.76 5.96 5.27.83.36 1.48.57 1.99.73.84.26 1.6.22 2.2.13.67-.1 2.07-.85 2.36-1.66.29-.82.29-1.52.2-1.66-.09-.15-.32-.24-.68-.42z" />
                </svg>
                Chat on WhatsApp
              </a>
              <div className="flex flex-col gap-2.5 text-sm text-gray-400">
                {settings.store_phone && (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {settings.store_phone}
                  </span>
                )}
                {settings.store_email && (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {settings.store_email}
                  </span>
                )}
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden md:flex flex-col items-center justify-center p-12 overflow-hidden"
              style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, white), color-mix(in srgb, var(--color-secondary) 6%, white))` }}>
              <div className="absolute inset-0 opacity-30"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-xl mb-6 mx-auto">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 40 40" fill="currentColor">
                    <path d="M20 2C10.059 2 2 10.059 2 20c0 3.294.904 6.384 2.479 9.027L2 38l9.139-2.395A17.93 17.93 0 0020 38c9.941 0 18-8.059 18-18S29.941 2 20 2z" fillOpacity=".2"/>
                    <path d="M27.9 24.4c-.36-.18-2.12-1.05-2.45-1.17-.32-.12-.56-.18-.79.18-.24.36-.92 1.17-1.12 1.4-.2.24-.41.27-.77.09-.36-.18-1.53-.56-2.91-1.79-1.08-.96-1.8-2.14-2.01-2.5-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.2.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.79-1.9-1.08-2.6-.28-.68-.57-.59-.79-.6-.2-.01-.45-.01-.69-.01-.24 0-.62.09-.95.45-.32.36-1.22 1.19-1.22 2.91s1.25 3.37 1.43 3.61c.18.24 2.46 3.76 5.96 5.27.83.36 1.48.57 1.99.73.84.26 1.6.22 2.2.13.67-.1 2.07-.85 2.36-1.66.29-.82.29-1.52.2-1.66-.09-.15-.32-.24-.68-.42z"/>
                  </svg>
                </div>
                <div className="space-y-2 text-center">
                  {['Typically replies in 2 minutes', 'Available 24 hours a day', 'Real people, real help'].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {settings.cta_enabled === 'true' && (
        <section className="section relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, var(--color-hero-bg) 0%, color-mix(in srgb, var(--color-hero-bg) 75%, var(--color-primary)) 100%)` }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
              style={{ background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)`, filter: 'blur(80px)' }} />
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
          </div>
          <div className="container relative z-10 text-center">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6 text-white/60 border border-white/10 bg-white/5">
              Join thousands of shoppers
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
              {settings.cta_title || 'Ready to get started?'}
            </h2>
            <p className="text-white/50 text-base mb-10 max-w-sm mx-auto">
              {settings.cta_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-white text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                {settings.cta_button_text || 'Browse Products'}
              </Link>
              <Link href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white/80 border border-white/15 hover:bg-white/10 hover:text-white transition-all duration-200">
                Create free account
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
