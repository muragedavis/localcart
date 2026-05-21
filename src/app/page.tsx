import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings } from '@/lib/settings';

interface FeatureItem { icon: string; title: string; desc: string; }
interface StatItem { value: string; label: string; }

function parseJSON<T>(raw: string, fallback: T): T {
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export default async function Home() {
  const s = await getSiteSettings();

  const featureItems = parseJSON<FeatureItem[]>(s.features_items, []);
  const statItems = parseJSON<StatItem[]>(s.stats_items, []);

  return (
    <div>
      {/* Announcement Bar */}
      {s.announcement_enabled === 'true' && s.announcement_text && (
        <div
          className="text-center py-2 px-4 text-sm font-medium"
          style={{ backgroundColor: s.announcement_bg, color: s.announcement_color }}
        >
          {s.announcement_text}
        </div>
      )}

      {/* Hero */}
      <section
        className="relative text-white overflow-hidden"
        style={{ background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)` }}
      >
        {s.banner_url && (
          <Image src={s.banner_url} alt="Hero banner" fill className="object-cover opacity-20" priority />
        )}
        <div className="container relative py-24 md:py-32 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-sm font-medium mb-6">
            {s.site_tagline}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">{s.hero_title}</h1>
          <p className="text-lg md:text-xl mb-10 opacity-85 max-w-xl mx-auto">{s.hero_subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="btn font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-shadow bg-white"
              style={{ color: 'var(--color-primary)' }}
            >
              {s.hero_cta_text}
            </Link>
            <Link href="/register" className="btn border-2 border-white/70 text-white font-semibold px-8 py-3 hover:bg-white/10 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-12">
          <svg viewBox="0 0 1200 60" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,60 L0,60 Z" fill="rgb(249,250,251)" />
          </svg>
        </div>
      </section>

      {/* Features */}
      {s.features_enabled === 'true' && featureItems.length > 0 && (
        <section className="container py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{s.features_title}</h2>
            {s.features_subtitle && <p className="text-gray-500 text-lg max-w-xl mx-auto">{s.features_subtitle}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureItems.map((f, i) => (
              <div key={i} className="card text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      {s.stats_enabled === 'true' && statItems.length > 0 && (
        <section className="bg-white border-y border-gray-100 py-12">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {statItems.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {s.cta_enabled === 'true' && (
        <section className="container py-20">
          <div
            className="rounded-2xl p-10 md:p-16 text-center text-white"
            style={{ background: `linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)` }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{s.cta_title}</h2>
            {s.cta_subtitle && <p className="text-lg opacity-85 mb-8 max-w-md mx-auto">{s.cta_subtitle}</p>}
            <Link
              href="/shop"
              className="btn font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-shadow bg-white"
              style={{ color: 'var(--color-primary)' }}
            >
              {s.cta_button_text || 'View All Products'}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
