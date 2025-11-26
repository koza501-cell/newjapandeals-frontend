'use client';

import Link from 'next/link';
import { useState } from 'react';

const brands = ['Seiko', 'Citizen', 'Casio', 'G-Shock', 'Orient', 'Vintage'];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-secondary text-white text-sm py-2">
        <div className="container-custom flex justify-between items-center">
          <span className="hidden sm:block">🇯🇵 Authentic Japanese Watches - Direct from Japan</span>
          <span className="sm:hidden text-xs">🇯🇵 Direct from Japan</span>
          <div className="flex items-center gap-4">
            <span className="hidden md:block">Free Int'l Shipping over ¥50,000</span>
            <Link href="/track-order" className="hover:text-gold transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-display font-bold text-primary">
              New Japan Deals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/products" className="font-medium hover:text-primary transition-colors">
              All Watches
            </Link>
            <div className="relative group">
              <button className="font-medium hover:text-primary transition-colors flex items-center gap-1">
                Brands
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {brands.map((brand) => (
                  <Link
                    key={brand}
                    href={`/brand/${brand.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-cream hover:text-primary transition-colors"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" className="font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link href="/cart" className="p-2 hover:text-primary transition-colors relative" aria-label="Cart">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:text-primary transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-4 animate-fadeIn">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for watches... (e.g., Seiko SKX007, Citizen Eco-Drive)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t animate-fadeIn">
          <nav className="container-custom py-4 space-y-4">
            <Link href="/products" className="block font-medium py-2 hover:text-primary">
              All Watches
            </Link>
            <div className="py-2">
              <span className="font-medium text-gray-500">Brands</span>
              <div className="mt-2 ml-4 space-y-2">
                {brands.map((brand) => (
                  <Link
                    key={brand}
                    href={`/brand/${brand.toLowerCase()}`}
                    className="block py-1 hover:text-primary"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" className="block font-medium py-2 hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="block font-medium py-2 hover:text-primary">
              Contact
            </Link>
            <Link href="/track-order" className="block font-medium py-2 hover:text-primary">
              Track Order
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
