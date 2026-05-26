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
  // Appearance
  hero_bg_color: string;
  header_bg_color: string;
  header_text_color: string;
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
  // Testimonials
  testimonials_enabled: string;
  testimonials_items: string;
  // Partners
  partners_enabled: string;
  partners_items: string;
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
  // Appearance
  hero_bg_color: '#0a0a0a',
  header_bg_color: '#ffffff',
  header_text_color: '#111111',
  // Currency
  currency_symbol: '$',
  currency_code: 'USD',
  currency_position: 'before',
  // Store
  store_address: '',
  store_phone: '',
  store_email: '',
  social_facebook: '',
  social_twitter: '',
  social_instagram: '',
  // Announcement
  announcement_enabled: 'false',
  announcement_text: 'Sale on selected items — limited time!',
  announcement_bg: '#1F2937',
  announcement_color: '#FFFFFF',
  // Nav
  nav_links: '[{"label":"Home","href":"/"},{"label":"Shop","href":"/shop"}]',
  // Hero
  hero_title: 'Shop Local,\nThink Big.',
  hero_subtitle: 'Modern online shopping built for local businesses. Fast, secure, and designed to support your community.',
  hero_cta_text: 'Shop Now',
  // Features
  features_enabled: 'true',
  features_title: 'Built For Performance.',
  features_subtitle: 'Everything you need for a smooth shopping experience.',
  features_items: '[{"icon":"⚡","title":"Lightning Fast","desc":"Optimized checkout and delivery. Get what you need without the wait."},{"icon":"🔒","title":"Secure & Safe","desc":"End-to-end encrypted transactions. Your data stays yours."},{"icon":"📱","title":"Mobile First","desc":"Shop anywhere, anytime. Built for every screen size."},{"icon":"💳","title":"Easy Payments","desc":"M-Pesa and more. Pay your way, instantly."}]',
  // Stats
  stats_enabled: 'true',
  stats_items: '[{"value":"5K+","label":"Products Listed"},{"value":"10K+","label":"Happy Customers"},{"value":"50K+","label":"Orders Delivered"},{"value":"99%","label":"Satisfaction Rate"}]',
  // Testimonials
  testimonials_enabled: 'true',
  testimonials_items: '[{"name":"Amina Wanjiru","role":"Regular Shopper","location":"Nairobi, Kenya","text":"I love how easy it is to find local products and support nearby businesses. Delivery is always on time and the quality never disappoints.","rating":5,"initials":"AW","accentColor":"#F97316"},{"name":"Brian Ochieng","role":"Business Owner","location":"Mombasa, Kenya","text":"As a seller, managing my products and orders is seamless. My revenue has grown 3x since listing on this platform.","rating":5,"initials":"BO","accentColor":"#3B82F6"},{"name":"Grace Muthoni","role":"Loyal Customer","location":"Kisumu, Kenya","text":"The support team is incredible. They responded within minutes on WhatsApp and resolved my issue immediately. 10/10.","rating":5,"initials":"GM","accentColor":"#10B981"},{"name":"David Kamau","role":"Entrepreneur","location":"Nakuru, Kenya","text":"Shopping locally has never felt this modern. Clean interface, secure payments, and a wide product range. Highly recommended.","rating":5,"initials":"DK","accentColor":"#8B5CF6"}]',
  // Partners
  partners_enabled: 'true',
  partners_items: '[{"name":"Safaricom","abbr":"SF"},{"name":"Equity Bank","abbr":"EQ"},{"name":"Kenya Airways","abbr":"KQ"},{"name":"NCBA Group","abbr":"NC"},{"name":"Jumia","abbr":"JM"},{"name":"Twiga Foods","abbr":"TW"}]',
  // CTA
  cta_enabled: 'true',
  cta_title: 'Ready To Shop?',
  cta_subtitle: 'Sign up in seconds. Discover thousands of local products.',
  cta_button_text: 'Browse Products',
  // Footer
  footer_about: 'A lightweight e-commerce platform built for local businesses and their communities.',
  footer_copyright: `© ${new Date().getFullYear()} LocalCart Commerce. All rights reserved.`,
  footer_shop_links: '[{"label":"Products","href":"/shop"},{"label":"Categories","href":"/shop"},{"label":"New Arrivals","href":"/shop"}]',
  footer_support_links: '[{"label":"Contact","href":"#"},{"label":"FAQ","href":"#"},{"label":"Shipping","href":"#"}]',
  footer_legal_links: '[{"label":"Privacy","href":"#"},{"label":"Terms","href":"#"},{"label":"Cookies","href":"#"}]',
};
