'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore, useCartStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/lib/settings';
import ThemeToggle from './ThemeToggle';

interface NavLink { label: string; href: string; }
interface HeaderProps { settings: SiteSettings; }

function parseLinks(raw: string): NavLink[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export default function Header({ settings }: HeaderProps) {
  const { user, logout, hydrate } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    hydrate();
    setIsHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hydrate]);

  if (!isHydrated) return null;

  const navLinks = parseLinks(settings.nav_links);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-sm border-b border-gray-100/80 dark:border-gray-800/80'
          : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
      }`}
      style={{ color: 'var(--color-header-text)' }}
    >
      <div className="container flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          {settings.logo_url ? (
            <Image src={settings.logo_url} alt={settings.site_name} width={120} height={40} className="h-8 w-auto object-contain" />
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm transition-shadow group-hover:shadow-md"
                style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))` }}>
                {settings.site_name.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-bold text-base text-gray-900 dark:text-gray-100">{settings.site_name}</span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}
              className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-150">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />

          {/* Cart */}
          <Link href="/cart"
            className="relative flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-150">
            <span className="relative">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[17px] h-[17px] text-[9px] font-bold text-white rounded-full flex items-center justify-center px-0.5 shadow-sm"
                  style={{ background: 'var(--color-primary)' }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>
            <span className="text-sm">Cart</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link href="/admin"
                  className="text-sm font-semibold px-3.5 py-2 rounded-lg text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-px"
                  style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))` }}>
                  Admin
                </Link>
              )}
              <Link href="/profile"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {user.full_name}
              </Link>
              <button onClick={logout}
                className="text-sm font-medium px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-150">
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Sign in
              </Link>
              <Link href="/register"
                className="text-sm font-semibold px-4 py-2 rounded-xl text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-px"
                style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))` }}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-3.5 text-[8px] font-bold text-white rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-primary)' }}>
                {cartCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen
              ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <div className="container py-3 space-y-0.5">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                    style={{ color: 'var(--color-primary)' }} onClick={() => setMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <Link href="/profile" className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  {user.full_name}
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link href="/login"
                  className="flex-1 text-center py-2.5 text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
                <Link href="/register"
                  className="flex-1 text-center py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 shadow-sm"
                  style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))` }}
                  onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
