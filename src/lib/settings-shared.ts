// Shared types and defaults — no server-only imports, safe for client bundles

export interface SiteSettings {
  // Branding
  site_name: string;
  site_tagline: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string;
  favicon_url: string;
  banner_url: string;
  // Currency
  currency_symbol: string;
  currency_code: string;
  currency_position: string;
  // Store Info
  store_address: string;
  store_phone: string;
  store_email: string;
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  // Announcement
  announcement_enabled: string;
  announcement_text: string;
  announcement_bg: string;
  announcement_color: string;
  // Navigation
  nav_links: string;
  // Hero
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  // Features
  features_enabled: string;
  features_title: string;
  features_subtitle: string;
  features_items: string;
  // Stats
  stats_enabled: string;
  stats_items: string;
  // CTA
  cta_enabled: string;
  cta_title: string;
  cta_subtitle: string;
  cta_button_text: string;
  // Footer
  footer_about: string;
  footer_copyright: string;
  footer_shop_links: string;
  footer_support_links: string;
  footer_legal_links: string;
  [key: string]: string;
}

export const SETTING_DEFAULTS: SiteSettings = {
  site_name: 'LocalCart',
  site_tagline: 'Lightweight, fast, and easy online shopping',
  primary_color: '#3B82F6',
  secondary_color: '#10B981',
  accent_color: '#F59E0B',
  logo_url: '',
  favicon_url: '',
  banner_url: '',
  currency_symbol: '$',
  currency_code: 'USD',
  currency_position: 'before',
  store_address: '',
  store_phone: '',
  store_email: '',
  social_facebook: '',
  social_twitter: '',
  social_instagram: '',
  announcement_enabled: 'false',
  announcement_text: 'Free shipping on orders over $50!',
  announcement_bg: '#1F2937',
  announcement_color: '#FFFFFF',
  nav_links: '[{"label":"Home","href":"/"},{"label":"Shop","href":"/shop"}]',
  hero_title: 'Welcome to LocalCart',
  hero_subtitle: 'Lightweight, fast, and easy online shopping',
  hero_cta_text: 'Start Shopping',
  features_enabled: 'true',
  features_title: 'Why Choose Us?',
  features_subtitle: 'Everything you need for a seamless shopping experience.',
  features_items: '[{"icon":"⚡","title":"Lightning Fast","desc":"Optimized for speed and performance on any device"},{"icon":"🔒","title":"Secure & Trusted","desc":"Your data is protected with modern security practices"},{"icon":"📱","title":"Mobile Friendly","desc":"Shop anywhere, anytime on any device"}]',
  stats_enabled: 'true',
  stats_items: '[{"value":"10K+","label":"Products"},{"value":"5K+","label":"Happy Customers"},{"value":"99%","label":"Satisfaction Rate"},{"value":"24/7","label":"Support"}]',
  cta_enabled: 'true',
  cta_title: 'Ready to Start Shopping?',
  cta_subtitle: 'Browse our collection of quality products and find what you need.',
  cta_button_text: 'View All Products',
  footer_about: 'A lightweight e-commerce platform for local businesses.',
  footer_copyright: `© ${new Date().getFullYear()} LocalCart Commerce. All rights reserved.`,
  footer_shop_links: '[{"label":"Products","href":"/shop"},{"label":"Categories","href":"/shop"},{"label":"New Arrivals","href":"/shop"}]',
  footer_support_links: '[{"label":"Contact","href":"#"},{"label":"FAQ","href":"#"},{"label":"Shipping","href":"#"}]',
  footer_legal_links: '[{"label":"Privacy","href":"#"},{"label":"Terms","href":"#"},{"label":"Cookies","href":"#"}]',
};
