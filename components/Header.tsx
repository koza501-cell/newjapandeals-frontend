'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchCommand from '@/components/SearchCommand';
import CurrencyPicker from '@/components/CurrencyPicker';

const NAV_LINKS = [
  { href: '/products', label: 'Shop' },
  { href: '/why-us',   label: 'Why Us' },
  { href: '/blog',     label: 'Blog' },
  { href: '/about',    label: 'About' },
  { href: '/faq',      label: 'FAQ' },
  { href: '/contact',  label: 'Contact' },
];

export default function Header() {
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled,         setScrolled]         = useState(false);
  const [cartHovered,      setCartHovered]      = useState(false);
  const cartLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { items, getItemCount, getSubtotal } = useCart();
  const { count: wishlistCount }             = useWishlist();
  const itemCount = getItemCount();

  // Add shadow once user scrolls past 8px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile panels on route change (Next.js soft navigation)
  const closeAll = () => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const handleCartEnter = () => {
    if (cartLeaveTimer.current) clearTimeout(cartLeaveTimer.current);
    setCartHovered(true);
  };
  const handleCartLeave = () => {
    cartLeaveTimer.current = setTimeout(() => setCartHovered(false), 250);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 h-16">

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="New Japan Deals — Home"
          >
            <span className="text-2xl" aria-hidden="true">⌚</span>
            <div className="leading-tight">
              <div
                className="font-bold text-base text-[#1A1A1A]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                New Japan Deals
              </div>
              {/* Micro-badge — visible sm+ */}
              <div className="hidden sm:block relative group">
                <span
                  className="text-[10px] text-gray-400 border-b border-dotted border-gray-300 cursor-default"
                  title="古物商許可 第441200001622号 — Licensed antique dealer, Chiba Japan, since 2014"
                >
                  Licensed Dealer · 古物商 #441200001622
                </span>
                {/* Hover tooltip */}
                <div className="absolute left-0 top-5 w-56 bg-[#1A1A1A] text-white text-[11px] leading-snug rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-10 shadow-lg">
                  古物商許可 第441200001622号<br />
                  Licensed antique dealer in Chiba, Japan since 2014.
                </div>
              </div>
            </div>
          </Link>

          {/* ── Centre: Search (desktop) ─────────────────────────────── */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto">
            <SearchCommand className="w-full" />
          </div>

          {/* ── Right actions ────────────────────────────────────────── */}
          <div className="flex items-center gap-0.5 ml-auto">

            {/* Currency picker — desktop */}
            <div className="hidden md:block">
              <CurrencyPicker />
            </div>

            {/* Mobile search icon */}
            <button
              onClick={() => { setMobileSearchOpen(v => !v); setMobileMenuOpen(false); }}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open search"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist heart — visible sm+ */}
            <Link
              href="/products"
              className="relative hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors items-center"
              aria-label={`Wishlist — ${wishlistCount} saved item${wishlistCount !== 1 ? 's' : ''}`}
            >
              <svg
                className="w-5 h-5 transition-colors"
                style={{ color: wishlistCount > 0 ? '#B50012' : '#9CA3AF' }}
                fill={wishlistCount > 0 ? '#B50012' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#B50012] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                  aria-hidden="true"
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart with hover mini-cart popover */}
            <div
              className="relative"
              onMouseEnter={handleCartEnter}
              onMouseLeave={handleCartLeave}
            >
              <Link
                href="/cart"
                className="relative flex p-2 rounded-lg hover:bg-gray-100 transition-colors items-center"
                aria-label={`Shopping cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#B50012] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                    aria-hidden="true"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Mini-cart popover (desktop hover, only when cart has items) */}
              {cartHovered && items.length > 0 && (
                <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      Cart ({itemCount})
                    </span>
                    <Link href="/cart" className="text-xs text-[#B50012] font-medium hover:underline">
                      Edit
                    </Link>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                    {items.slice(0, 4).map(item => (
                      <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 flex-shrink-0 text-xl">
                            ⌚
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {item.brand} {item.model}
                          </div>
                          <div className="text-xs text-gray-400">
                            ¥{item.price_jpy?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {items.length > 4 && (
                      <div className="px-4 py-2 text-xs text-gray-400">
                        +{items.length - 4} more item{items.length - 4 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        ¥{getSubtotal().toLocaleString()}
                      </span>
                    </div>
                    <Link
                      href="/cart"
                      className="block w-full bg-[#B50012] text-white text-center text-sm font-semibold py-2.5 rounded-lg hover:bg-[#8B000E] transition-colors"
                    >
                      View Cart & Checkout
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger — mobile */}
            <button
              onClick={() => { setMobileMenuOpen(v => !v); setMobileSearchOpen(false); }}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile search bar ─────────────────────────────────────── */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1">
            <SearchCommand
              autoFocus
              onClose={() => setMobileSearchOpen(false)}
              className="w-full"
            />
          </div>
        )}

        {/* ── Mobile navigation drawer ──────────────────────────────── */}
        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden py-3 border-t border-gray-100"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeAll}
                  className="px-2 py-2.5 text-gray-700 hover:text-[#B50012] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cart"
                onClick={closeAll}
                className="px-2 py-2.5 text-gray-700 hover:text-[#B50012] hover:bg-gray-50 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <span aria-hidden="true">🛒</span>
                Cart
                {itemCount > 0 && (
                  <span className="ml-auto text-xs bg-[#B50012] text-white rounded-full px-2 py-0.5 font-semibold">
                    {itemCount}
                  </span>
                )}
              </Link>
              {/* Currency picker in mobile menu */}
              <div className="px-2 pt-3 mt-1 border-t border-gray-100">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
                  Currency
                </p>
                <CurrencyPicker />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
