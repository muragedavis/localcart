import Link from 'next/link';
import type { SiteSettings } from '@/lib/settings';

interface FooterLink { label: string; href: string; }
interface FooterProps { settings: SiteSettings; }

function parseLinks(raw: string): FooterLink[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export default function Footer({ settings }: FooterProps) {
  const shopLinks = parseLinks(settings.footer_shop_links);
  const supportLinks = parseLinks(settings.footer_support_links);
  const legalLinks = parseLinks(settings.footer_legal_links);

  const hasSocial = settings.social_facebook || settings.social_twitter || settings.social_instagram;
  const hasContact = settings.store_phone || settings.store_email || settings.store_address;

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">
          {/* Brand + Contact */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: 'var(--color-primary)' }}>
                {settings.site_name.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-bold text-base">{settings.site_name}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{settings.footer_about}</p>

            {hasContact && (
              <div className="space-y-2 text-sm text-gray-400">
                {settings.store_address && (
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{settings.store_address}</span>
                  </div>
                )}
                {settings.store_phone && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${settings.store_phone}`} className="hover:text-white transition-colors">{settings.store_phone}</a>
                  </div>
                )}
                {settings.store_email && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${settings.store_email}`} className="hover:text-white transition-colors">{settings.store_email}</a>
                  </div>
                )}
              </div>
            )}

            {hasSocial && (
              <div className="flex items-center gap-3 mt-5">
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                  </a>
                )}
                {settings.social_twitter && (
                  <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                  </a>
                )}
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-300 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-300 mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-300 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">{settings.footer_copyright}</p>
          <p className="text-gray-600 text-xs">
            {settings.currency_code && <span className="mr-2 badge badge-gray">{settings.currency_code}</span>}
            Built with ♥ for local businesses
          </p>
        </div>
      </div>
    </footer>
  );
}
