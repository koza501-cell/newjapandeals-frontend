'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const WISHLIST_KEY = 'njd_wishlist';

interface WishlistContextType {
  slugs:       string[];
  toggle:      (slug: string) => void;
  isWishlisted:(slug: string) => boolean;
  count:       number;
}

const WishlistContext = createContext<WishlistContextType>({
  slugs:        [],
  toggle:       () => {},
  isWishlisted: () => false,
  count:        0,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) setSlugs(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = (slug: string) => {
    setSlugs(prev => {
      const next = prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug];
      try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const isWishlisted = (slug: string) => slugs.includes(slug);

  return (
    <WishlistContext.Provider value={{ slugs, toggle, isWishlisted, count: slugs.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  return useContext(WishlistContext);
}
