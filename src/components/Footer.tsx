import Link from 'next/link';
import type { SiteSettings } from '@/lib/settings';

interface FooterLink { label: string; href: string; }
interface FooterProps { settings: SiteSettings; }

function parseLinks(raw: string): FooterLink[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export default function Footer({ settings }: FooterProps) {
  const shopLinks    = parseLinks(settings.footer_shop_links);
  const supportLinks = parseLinks(settings.footer_support_links);
  const legalLinks   = parseLinks(settings.footer_legal_links);

  const hasSocial  = settings.social_facebook || settings.social_twitter || settings.social_instagram;
  const hasContact = settings.store_phone || settings.store_email || settings.store_address;

  const perks = [
    { label: 'Secure checkout', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { label: '24/7 support',    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { label: 'Easy returns',    icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' },
  ];

  return (
    <footer className="bg-gray-950 text-white">

      {/* Perk strip */}
      <div className="border-b border-white/5">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-medium">
            Supporting local businesses across Kenya
          </p>
          <div className="flex items-center gap-8">
            {perks.map((p) => (
              <div key={p.label} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={p.icon} />
                </svg>
                <span className="text-xs text-gray-500 font-medium">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))` }}>
                {settings.site_name.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-bold text-sm text-white">{settings.site_name}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">{settings.footer_about}</p>

            {hasContact && (
              <div className="space-y-2.5 mb-6">
                {settings.store_address && (
                  <div className="flex items-start gap-2.5 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{settings.store_address}</span>
                  </div>
                )}
                {settings.store_phone && (
                  <a href={`tel:${settings.store_phone}`} className="flex items-center gap-2.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    <svg className="w-3.5 h-3.5 shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {settings.store_phone}
                  </a>
                )}
                {settings.store_email && (
                  <a href={`mailto:${settings.store_email}`} className="flex items-center gap-2.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    <svg className="w-3.5 h-3.5 shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {settings.store_email}
                  </a>
                )}
              </div>
            )}

            {hasSocial && (
              <div className="flex items-center gap-2">
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15 flex items-center justify-center transition-all duration-150">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                  </a>
                )}
                {settings.social_twitter && (
                  <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15 flex items-center justify-center transition-all duration-150">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                  </a>
                )}
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15 flex items-center justify-center transition-all duration-150">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Links */}
          {[{ title: 'Shop', links: shopLinks }, { title: 'Support', links: supportLinks }, { title: 'Legal', links: legalLinks }].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-200 transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">{settings.footer_copyright}</p>
          <div className="flex items-center gap-3">
            {settings.currency_code && (
              <span className="text-[10px] font-semibold text-gray-600 bg-white/5 border border-white/8 px-2.5 py-1 rounded-full">
                {settings.currency_code}
              </span>
            )}
            <p className="text-xs text-gray-600">Built with care for local businesses</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
