'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SETTING_DEFAULTS } from '@/lib/settings-shared';
import type { SiteSettings } from '@/lib/settings-shared';
import { ToastContainer, useToast } from '@/components/Toast';

type Tab = 'brand' | 'colors' | 'currency' | 'store' | 'nav' | 'hero' | 'landing' | 'footer';

/* ─── Helpers ─────────────────────────────────────────────── */

function UploadButton({ label, value, settingKey, onUpload }: {
  label: string; value: string; settingKey: string;
  onUpload: (key: string, url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('type', settingKey);
      const res = await apiClient.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onUpload(settingKey, res.data.url);
    } catch { setError('Upload failed. Max 5MB, images only.'); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  };
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {value && (
        <div className="relative w-32 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <Image src={value} alt={label} fill className="object-contain p-1" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} className="btn-secondary text-sm" disabled={uploading}>
          {uploading ? 'Uploading...' : value ? 'Replace' : 'Upload'}
        </button>
        {value && <button type="button" onClick={() => onUpload(settingKey, '')} className="text-sm text-red-500 hover:underline">Remove</button>}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}

function ColorInput({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      <div className="flex items-center gap-3">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
        <input type="text" value={value} onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value); }} className="form-input text-sm font-mono w-32" maxLength={7} />
        <div className="w-8 h-8 rounded-md border border-gray-200" style={{ backgroundColor: value }} />
      </div>
    </div>
  );
}

interface FooterLink { label: string; href: string; }
function LinksEditor({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [links, setLinks] = useState<FooterLink[]>([]);
  useEffect(() => { try { setLinks(JSON.parse(value)); } catch { setLinks([]); } }, [value]);
  const update = (updated: FooterLink[]) => { setLinks(updated); onChange(JSON.stringify(updated)); };
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
        {links.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" placeholder="Label" value={link.label} onChange={(e) => update(links.map((l, j) => j === i ? { ...l, label: e.target.value } : l))} className="form-input text-sm py-1.5 flex-1" />
            <input type="text" placeholder="URL" value={link.href} onChange={(e) => update(links.map((l, j) => j === i ? { ...l, href: e.target.value } : l))} className="form-input text-sm py-1.5 flex-1" />
            <button type="button" onClick={() => update(links.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        <button type="button" onClick={() => update([...links, { label: '', href: '#' }])} className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>+ Add link</button>
      </div>
    </div>
  );
}

interface FeatureItem { icon: string; title: string; desc: string; }
function FeaturesEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [items, setItems] = useState<FeatureItem[]>([]);
  useEffect(() => { try { setItems(JSON.parse(value)); } catch { setItems([]); } }, [value]);
  const update = (updated: FeatureItem[]) => { setItems(updated); onChange(JSON.stringify(updated)); };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Feature {i + 1}</span>
            <button type="button" onClick={() => update(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Icon (emoji)</label>
              <input type="text" value={item.icon} onChange={(e) => update(items.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))} className="form-input text-sm py-1.5" maxLength={4} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Title</label>
              <input type="text" value={item.title} onChange={(e) => update(items.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} className="form-input text-sm py-1.5" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <input type="text" value={item.desc} onChange={(e) => update(items.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} className="form-input text-sm py-1.5" />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => update([...items, { icon: '✨', title: '', desc: '' }])} className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>+ Add Feature</button>
    </div>
  );
}

interface StatItem { value: string; label: string; }
function StatsEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [items, setItems] = useState<StatItem[]>([]);
  useEffect(() => { try { setItems(JSON.parse(value)); } catch { setItems([]); } }, [value]);
  const update = (updated: StatItem[]) => { setItems(updated); onChange(JSON.stringify(updated)); };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="text" placeholder="Value (e.g. 10K+)" value={item.value} onChange={(e) => update(items.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} className="form-input text-sm py-1.5 w-36" />
          <input type="text" placeholder="Label (e.g. Products)" value={item.label} onChange={(e) => update(items.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className="form-input text-sm py-1.5 flex-1" />
          <button type="button" onClick={() => update(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
      <button type="button" onClick={() => update([...items, { value: '', label: '' }])} className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>+ Add Stat</button>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

export default function AdminSettings() {
  const user = useAuthStore((state) => state.user);
  const [settings, setSettings] = useState<SiteSettings>(SETTING_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('brand');
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    apiClient.get('/admin/settings').then((res) => setSettings({ ...SETTING_DEFAULTS, ...res.data.data })).finally(() => setLoading(false));
  }, [user, router]);

  const set = (key: keyof SiteSettings, value: string) => setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await apiClient.put('/admin/settings', settings);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch { addToast('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="container py-20 text-center text-gray-500">Loading settings...</div>;

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'brand', label: 'Brand & Logo', icon: '🏷️' },
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'currency', label: 'Currency', icon: '💱' },
    { id: 'store', label: 'Store Info', icon: '🏪' },
    { id: 'nav', label: 'Navigation', icon: '🔗' },
    { id: 'hero', label: 'Hero Section', icon: '🖼️' },
    { id: 'landing', label: 'Landing Page', icon: '📰' },
    { id: 'footer', label: 'Footer', icon: '📋' },
  ];

  const SaveButton = ({ className = '' }: { className?: string }) => (
    <button onClick={handleSave} disabled={saving} className={`btn-primary flex items-center gap-2 ${className}`}>
      {saving ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>)
        : saved ? (<><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Saved!</>)
        : 'Save Changes'}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/admin" className="hover:text-gray-700">Dashboard</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Site Settings</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          </div>
          <SaveButton className="px-6 py-2.5" />
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-52 shrink-0">
            <nav className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left border-l-2 ${activeTab === tab.id ? 'bg-blue-50' : 'border-l-transparent text-gray-600 hover:bg-gray-50'}`}
                  style={activeTab === tab.id ? { borderLeftColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, white)' } : {}}>
                  <span>{tab.icon}</span>{tab.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 leading-relaxed">
              <strong>Tip:</strong> Save changes and refresh to see them live across the site.
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-8">

            {/* ── Brand ── */}
            {activeTab === 'brand' && (
              <div className="space-y-8">
                <div><h2 className="text-lg font-semibold mb-1">Brand Identity</h2><p className="text-sm text-gray-500">Your site name, tagline, and logo.</p></div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Name</label>
                    <input type="text" value={settings.site_name} onChange={(e) => set('site_name', e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Tagline</label>
                    <input type="text" value={settings.site_tagline} onChange={(e) => set('site_tagline', e.target.value)} className="form-input" />
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div className="grid gap-8 md:grid-cols-2">
                  <UploadButton label="Logo (header)" value={settings.logo_url} settingKey="logo_url" onUpload={(k, u) => set(k as keyof SiteSettings, u)} />
                  <UploadButton label="Favicon (browser tab)" value={settings.favicon_url} settingKey="favicon_url" onUpload={(k, u) => set(k as keyof SiteSettings, u)} />
                </div>
                {/* Preview */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Header Preview</p>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-white border-b px-5 h-14 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settings.logo_url
                          ? <div className="relative w-24 h-8"><Image src={settings.logo_url} alt="Logo" fill className="object-contain" /></div>
                          : <><div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: settings.primary_color }}>{settings.site_name.slice(0, 2).toUpperCase()}</div><span className="font-bold text-gray-900 text-sm">{settings.site_name}</span></>}
                      </div>
                      <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: settings.primary_color }}>Register</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Colors ── */}
            {activeTab === 'colors' && (
              <div className="space-y-8">
                <div><h2 className="text-lg font-semibold mb-1">Color Palette</h2><p className="text-sm text-gray-500">Colors applied site-wide after saving.</p></div>
                <div className="space-y-6">
                  <ColorInput label="Primary Color" hint="Buttons, links, highlights" value={settings.primary_color} onChange={(v) => set('primary_color', v)} />
                  <ColorInput label="Secondary Color" hint="Gradients, accents" value={settings.secondary_color} onChange={(v) => set('secondary_color', v)} />
                  <ColorInput label="Accent Color" hint="Warnings, badges" value={settings.accent_color} onChange={(v) => set('accent_color', v)} />
                </div>
                <hr className="border-gray-100" />
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">Quick Presets</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'Ocean Blue', primary: '#3B82F6', secondary: '#06B6D4', accent: '#F59E0B' },
                      { name: 'Forest Green', primary: '#16A34A', secondary: '#059669', accent: '#F97316' },
                      { name: 'Royal Purple', primary: '#7C3AED', secondary: '#DB2777', accent: '#FBBF24' },
                      { name: 'Sunset Red', primary: '#DC2626', secondary: '#EA580C', accent: '#FBBF24' },
                      { name: 'Midnight', primary: '#1E293B', secondary: '#334155', accent: '#38BDF8' },
                      { name: 'Rose Gold', primary: '#E11D48', secondary: '#9F1239', accent: '#FBBF24' },
                      { name: 'Teal', primary: '#0D9488', secondary: '#0891B2', accent: '#F59E0B' },
                      { name: 'Indigo', primary: '#4F46E5', secondary: '#7C3AED', accent: '#EC4899' },
                    ].map((p) => (
                      <button key={p.name} onClick={() => { set('primary_color', p.primary); set('secondary_color', p.secondary); set('accent_color', p.accent); }}
                        className="border border-gray-200 rounded-xl p-3 text-left hover:border-gray-400 transition-colors group">
                        <div className="flex gap-1.5 mb-2">
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: p.primary }} />
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: p.secondary }} />
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: p.accent }} />
                        </div>
                        <p className="text-xs font-medium text-gray-700">{p.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Button preview */}
                <div className="p-5 border border-gray-200 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-4">Button Preview</p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.primary_color }}>Primary</button>
                    <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.secondary_color }}>Secondary</button>
                    <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.accent_color }}>Accent</button>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">Neutral</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Currency ── */}
            {activeTab === 'currency' && (
              <div className="space-y-8">
                <div><h2 className="text-lg font-semibold mb-1">Currency</h2><p className="text-sm text-gray-500">How prices are displayed across your store.</p></div>
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency Symbol</label>
                    <input type="text" value={settings.currency_symbol} onChange={(e) => set('currency_symbol', e.target.value)} className="form-input" maxLength={5} placeholder="$" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency Code</label>
                    <input type="text" value={settings.currency_code} onChange={(e) => set('currency_code', e.target.value.toUpperCase())} className="form-input font-mono" maxLength={5} placeholder="USD" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Symbol Position</label>
                    <select className="form-input" value={settings.currency_position} onChange={(e) => set('currency_position', e.target.value)}>
                      <option value="before">Before amount (e.g. $100)</option>
                      <option value="after">After amount (e.g. 100$)</option>
                    </select>
                  </div>
                </div>

                {/* Currency presets */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Common Currencies</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'US Dollar', code: 'USD', symbol: '$', pos: 'before' },
                      { name: 'Euro', code: 'EUR', symbol: '€', pos: 'before' },
                      { name: 'British Pound', code: 'GBP', symbol: '£', pos: 'before' },
                      { name: 'Kenyan Shilling', code: 'KES', symbol: 'KSh', pos: 'before' },
                      { name: 'Nigerian Naira', code: 'NGN', symbol: '₦', pos: 'before' },
                      { name: 'South African Rand', code: 'ZAR', symbol: 'R', pos: 'before' },
                      { name: 'Indian Rupee', code: 'INR', symbol: '₹', pos: 'before' },
                      { name: 'Japanese Yen', code: 'JPY', symbol: '¥', pos: 'before' },
                    ].map((c) => (
                      <button key={c.code} onClick={() => { set('currency_symbol', c.symbol); set('currency_code', c.code); set('currency_position', c.pos); }}
                        className={`border rounded-xl p-3 text-left hover:border-gray-400 transition-colors ${settings.currency_code === c.code ? 'border-[var(--color-primary)] bg-blue-50' : 'border-gray-200'}`}
                        style={settings.currency_code === c.code ? { borderColor: 'var(--color-primary)' } : {}}>
                        <p className="text-lg font-bold text-gray-800">{c.symbol}</p>
                        <p className="text-xs font-medium text-gray-700">{c.code}</p>
                        <p className="text-xs text-gray-400">{c.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price preview */}
                <div className="p-5 border border-gray-200 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Price Preview</p>
                  <div className="flex items-center gap-6">
                    {[9.99, 49.99, 199.00].map((amount) => (
                      <div key={amount}>
                        <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                          {settings.currency_position === 'after' ? `${amount.toFixed(2)}${settings.currency_symbol}` : `${settings.currency_symbol}${amount.toFixed(2)}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{settings.currency_code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Store Info ── */}
            {activeTab === 'store' && (
              <div className="space-y-8">
                <div><h2 className="text-lg font-semibold mb-1">Store Information</h2><p className="text-sm text-gray-500">Contact details and social media links shown in the footer.</p></div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Address</label>
                    <textarea value={settings.store_address} onChange={(e) => set('store_address', e.target.value)} className="form-input resize-none" rows={2} placeholder="123 Main St, City, Country" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input type="text" value={settings.store_phone} onChange={(e) => set('store_phone', e.target.value)} className="form-input" placeholder="+1 555 123 4567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                      <input type="email" value={settings.store_email} onChange={(e) => set('store_email', e.target.value)} className="form-input" placeholder="hello@yourstore.com" />
                    </div>
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div>
                  <h3 className="text-base font-semibold mb-4">Social Media Links</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage', icon: '📘' },
                      { key: 'social_twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/yourhandle', icon: '🐦' },
                      { key: 'social_instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle', icon: '📸' },
                    ].map((social) => (
                      <div key={social.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{social.icon} {social.label}</label>
                        <input type="url" value={settings[social.key as keyof SiteSettings]} onChange={(e) => set(social.key as keyof SiteSettings, e.target.value)} className="form-input" placeholder={social.placeholder} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Navigation ── */}
            {activeTab === 'nav' && (
              <div className="space-y-8">
                <div><h2 className="text-lg font-semibold mb-1">Navigation Links</h2><p className="text-sm text-gray-500">Links shown in the top navigation bar.</p></div>
                <LinksEditor label="Nav Links" value={settings.nav_links} onChange={(v) => set('nav_links', v)} />
                {/* Nav preview */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-white border-b px-5 h-14 flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{settings.site_name}</span>
                      <div className="flex items-center gap-5">
                        {(() => { try { return JSON.parse(settings.nav_links).map((l: { label: string; href: string }) => <span key={l.label} className="text-xs text-gray-500">{l.label}</span>); } catch { return null; } })()}
                        <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: settings.primary_color }}>Register</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Hero ── */}
            {activeTab === 'hero' && (
              <div className="space-y-8">
                <div><h2 className="text-lg font-semibold mb-1">Hero Section</h2><p className="text-sm text-gray-500">The main banner on the home page.</p></div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                    <input type="text" value={settings.hero_title} onChange={(e) => set('hero_title', e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                    <textarea value={settings.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)} className="form-input resize-none" rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA Button Text</label>
                    <input type="text" value={settings.hero_cta_text} onChange={(e) => set('hero_cta_text', e.target.value)} className="form-input" />
                  </div>
                  <UploadButton label="Background Image (optional)" value={settings.banner_url} settingKey="banner_url" onUpload={(k, u) => set(k as keyof SiteSettings, u)} />
                </div>
                {/* Hero preview */}
                <div className="rounded-xl text-white p-10 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${settings.primary_color} 0%, ${settings.secondary_color} 100%)` }}>
                  <h2 className="text-2xl font-bold mb-2">{settings.hero_title || 'Title'}</h2>
                  <p className="opacity-80 text-sm mb-4">{settings.hero_subtitle || 'Subtitle'}</p>
                  <button className="px-6 py-2 rounded-lg font-semibold text-sm shadow-md bg-white" style={{ color: settings.primary_color }}>{settings.hero_cta_text || 'Shop Now'}</button>
                </div>
              </div>
            )}

            {/* ── Landing Page ── */}
            {activeTab === 'landing' && (
              <div className="space-y-10">
                <div><h2 className="text-lg font-semibold mb-1">Landing Page Sections</h2><p className="text-sm text-gray-500">Toggle and customise each section of your home page.</p></div>

                {/* Announcement Bar */}
                <div className="space-y-4 p-5 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Announcement Bar</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Shown above the header when enabled.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" checked={settings.announcement_enabled === 'true'} onChange={(e) => set('announcement_enabled', e.target.checked ? 'true' : 'false')} className="sr-only" />
                        <div className={`w-10 h-5 rounded-full transition-colors ${settings.announcement_enabled === 'true' ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`} style={settings.announcement_enabled === 'true' ? { backgroundColor: 'var(--color-primary)' } : {}}></div>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.announcement_enabled === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <input type="text" value={settings.announcement_text} onChange={(e) => set('announcement_text', e.target.value)} className="form-input" placeholder="Free shipping on orders over $50!" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ColorInput label="Background Color" value={settings.announcement_bg} onChange={(v) => set('announcement_bg', v)} />
                    <ColorInput label="Text Color" value={settings.announcement_color} onChange={(v) => set('announcement_color', v)} />
                  </div>
                  {settings.announcement_enabled === 'true' && (
                    <div className="rounded-lg py-2 px-4 text-center text-sm font-medium" style={{ backgroundColor: settings.announcement_bg, color: settings.announcement_color }}>
                      {settings.announcement_text || 'Preview'}
                    </div>
                  )}
                </div>

                {/* Features Section */}
                <div className="space-y-4 p-5 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Features Section</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Cards highlighting your value propositions.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" checked={settings.features_enabled === 'true'} onChange={(e) => set('features_enabled', e.target.checked ? 'true' : 'false')} className="sr-only" />
                        <div className={`w-10 h-5 rounded-full transition-colors`} style={{ backgroundColor: settings.features_enabled === 'true' ? 'var(--color-primary)' : '#D1D5DB' }}></div>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.features_enabled === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                      </div>
                    </label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Section Title</label>
                      <input type="text" value={settings.features_title} onChange={(e) => set('features_title', e.target.value)} className="form-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Section Subtitle</label>
                      <input type="text" value={settings.features_subtitle} onChange={(e) => set('features_subtitle', e.target.value)} className="form-input" />
                    </div>
                  </div>
                  <FeaturesEditor value={settings.features_items} onChange={(v) => set('features_items', v)} />
                </div>

                {/* Stats Section */}
                <div className="space-y-4 p-5 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Stats Bar</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Numbers that build trust (products, customers, etc.)</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" checked={settings.stats_enabled === 'true'} onChange={(e) => set('stats_enabled', e.target.checked ? 'true' : 'false')} className="sr-only" />
                        <div className="w-10 h-5 rounded-full transition-colors" style={{ backgroundColor: settings.stats_enabled === 'true' ? 'var(--color-primary)' : '#D1D5DB' }}></div>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.stats_enabled === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                      </div>
                    </label>
                  </div>
                  <StatsEditor value={settings.stats_items} onChange={(v) => set('stats_items', v)} />
                </div>

                {/* CTA Section */}
                <div className="space-y-4 p-5 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Call-to-Action Block</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Bottom CTA section encouraging users to shop.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" checked={settings.cta_enabled === 'true'} onChange={(e) => set('cta_enabled', e.target.checked ? 'true' : 'false')} className="sr-only" />
                        <div className="w-10 h-5 rounded-full transition-colors" style={{ backgroundColor: settings.cta_enabled === 'true' ? 'var(--color-primary)' : '#D1D5DB' }}></div>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.cta_enabled === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                      </div>
                    </label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                      <input type="text" value={settings.cta_title} onChange={(e) => set('cta_title', e.target.value)} className="form-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Button Text</label>
                      <input type="text" value={settings.cta_button_text} onChange={(e) => set('cta_button_text', e.target.value)} className="form-input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                    <input type="text" value={settings.cta_subtitle} onChange={(e) => set('cta_subtitle', e.target.value)} className="form-input" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Footer ── */}
            {activeTab === 'footer' && (
              <div className="space-y-8">
                <div><h2 className="text-lg font-semibold mb-1">Footer Content</h2><p className="text-sm text-gray-500">About text, copyright, and navigation links in the footer.</p></div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">About Text</label>
                    <textarea value={settings.footer_about} onChange={(e) => set('footer_about', e.target.value)} className="form-input resize-none" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Copyright Text</label>
                    <input type="text" value={settings.footer_copyright} onChange={(e) => set('footer_copyright', e.target.value)} className="form-input" />
                  </div>
                </div>
                <hr className="border-gray-100" />
                <LinksEditor label="Shop Links" value={settings.footer_shop_links} onChange={(v) => set('footer_shop_links', v)} />
                <LinksEditor label="Support Links" value={settings.footer_support_links} onChange={(v) => set('footer_support_links', v)} />
                <LinksEditor label="Legal Links" value={settings.footer_legal_links} onChange={(v) => set('footer_legal_links', v)} />
              </div>
            )}

            {/* Bottom Save */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-400">Changes are applied site-wide after saving.</p>
              <SaveButton className="px-8 py-2.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
