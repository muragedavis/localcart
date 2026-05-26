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

  useEffect(() => {
    hydrate();
    setIsHydrated(true);
  }, [hydrate]);

  if (!isHydrated) return null;

  const navLinks = parseLinks(settings.nav_links);

  return (
    <header className="border-b border-gray-100 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-header-bg)', color: 'var(--color-header-text)' }}>
      <div className="container flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          {settings.logo_url ? (
            <Image src={settings.logo_url} alt={settings.site_name} width={120} height={40} className="h-8 w-auto object-contain" />
          ) : (
            <>
              <div className="w-8 h-8 flex items-center justify-center text-white text-xs font-black tracking-wider"
                style={{ backgroundColor: 'var(--color-primary)' }}>
                {settings.site_name.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-black text-sm tracking-widest uppercase text-gray-900 dark:text-slate-100">{settings.site_name}</span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}
              className="text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors relative group">
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-200"
                style={{ backgroundColor: 'var(--color-primary)' }} />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart */}
          <Link href="/cart"
            className="relative flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 px-3 py-2 transition-colors">
            <span className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] text-[10px] font-black text-white flex items-center justify-center px-1"
                  style={{ backgroundColor: 'var(--color-primary)' }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>
            <span>Cart</span>
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin"
                  className="text-xs font-black tracking-widest uppercase px-4 py-2 text-white transition-all duration-200 hover:opacity-80 rounded-lg"
                  style={{ backgroundColor: 'var(--color-primary)' }}>
                  Admin
                </Link>
              )}
              <Link href="/profile"
                className="text-xs font-bold tracking-widest uppercase text-gray-700 dark:text-slate-300 px-3 py-2 hover:text-gray-900 dark:hover:text-slate-100 transition-colors">
                {user.full_name}
              </Link>
              <button onClick={logout}
                className="text-xs font-black tracking-widest uppercase px-4 py-2 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:border-gray-900 dark:hover:border-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-all duration-200 rounded-lg">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-xs font-black tracking-widest uppercase px-4 py-2 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 transition-colors">
                Login
              </Link>
              <Link href="/register"
                className="text-xs font-black tracking-widest uppercase px-5 py-2 text-white transition-all duration-200 hover:opacity-80 rounded-lg"
                style={{ backgroundColor: 'var(--color-primary)' }}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile: cart + theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <Link href="/cart" className="relative p-2">
            <svg className="w-5 h-5 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[16px] h-4 text-[9px] font-black text-white flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button className="p-2 text-gray-700 dark:text-slate-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen
              ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-700 transition-colors duration-300"
          style={{ backgroundColor: 'var(--color-header-bg)' }}>
          <div className="container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className="block px-3 py-3 text-xs font-bold tracking-widest uppercase text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin"
                    className="block px-3 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors rounded-lg"
                    style={{ color: 'var(--color-primary)' }}
                    onClick={() => setMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <Link href="/profile"
                  className="block px-3 py-3 text-xs font-bold tracking-widest uppercase text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  {user.full_name}
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-3 text-xs font-bold tracking-widest uppercase text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login"
                  className="flex-1 text-center py-3 text-xs font-black tracking-widest uppercase border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:border-gray-900 dark:hover:border-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-all rounded-lg"
                  onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register"
                  className="flex-1 text-center py-3 text-xs font-black tracking-widest uppercase text-white transition-all hover:opacity-80 rounded-lg"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
