'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore, useCartStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/lib/settings';

interface NavLink { label: string; href: string; }

interface HeaderProps {
  settings: SiteSettings;
}

function parseLinks(raw: string): NavLink[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export default function Header({ settings }: HeaderProps) {
  const { user, logout, hydrate } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    hydrate();
    setIsHydrated(true);
  }, [hydrate]);

  if (!isHydrated) return null;

  const navLinks = parseLinks(settings.nav_links);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          {settings.logo_url ? (
            <Image src={settings.logo_url} alt={settings.site_name} width={120} height={40} className="h-9 w-auto object-contain" />
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: 'var(--color-primary)' }}>
                {settings.site_name.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-bold text-lg text-gray-900">{settings.site_name}</span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/cart" className="relative flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            <span className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] text-[10px] font-bold text-white rounded-full flex items-center justify-center px-1" style={{ backgroundColor: 'var(--color-primary)' }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>
            <span>Cart</span>
          </Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-sm font-medium px-3 py-2 rounded-lg transition-colors" style={{ color: 'var(--color-primary)' }}>
                  Admin
                </Link>
              )}
              <Link href="/profile" className="text-sm font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                {user.full_name}
              </Link>
              <button onClick={logout} className="btn-secondary text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm">Login</Link>
              <Link href="/register" className="btn-primary text-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
            Cart
            {cartCount > 0 && (
              <span className="min-w-[20px] h-5 text-xs font-bold text-white rounded-full flex items-center justify-center px-1" style={{ backgroundColor: 'var(--color-primary)' }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50" style={{ color: 'var(--color-primary)' }} onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <Link href="/profile" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>{user.full_name}</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link href="/login" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="btn-primary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
