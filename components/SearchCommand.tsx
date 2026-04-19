'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchProduct {
  id: number;
  slug: string;
  brand: string;
  model: string;
  reference_number?: string;
  price_jpy: number;
  image_1?: string;
  condition: string;
}

interface SearchBlogPost {
  slug: string;
  title: string;
  excerpt?: string;
}

const POPULAR_SEARCHES = [
  { label: 'Seiko SKX',         href: '/products?q=Seiko+SKX' },
  { label: 'G-Shock DW-5600',   href: '/products?q=G-Shock+DW-5600' },
  { label: 'Citizen Promaster', href: '/products?q=Citizen+Promaster' },
  { label: 'Vintage Seiko',     href: '/products?q=Vintage+Seiko' },
];

const PHP_API = 'https://api.newjapandeals.com';

// Meilisearch is active when both env vars are present (set in Vercel dashboard).
// The search-only public key is safe to expose in the client bundle.
const MEILI_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST;
const MEILI_KEY  = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY;
const useMeili   = !!(MEILI_HOST && MEILI_KEY);

interface Props {
  onClose?:    () => void;
  autoFocus?:  boolean;
  className?:  string;
}

/** Fire a `search_performed` GA4 / gtag event (ties into Prompt 4.4 analytics). */
function trackSearch(query: string, resultCount: number, engine: 'meilisearch' | 'php') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'search_performed', {
        search_term:   query,
        result_count:  resultCount,
        search_engine: engine,
      });
    }
  } catch { /* analytics must never throw */ }
}

export default function SearchCommand({ onClose, autoFocus, className }: Props) {
  const [query,       setQuery]       = useState('');
  const [products,    setProducts]    = useState<SearchProduct[]>([]);
  const [posts,       setPosts]       = useState<SearchBlogPost[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [isFocused,   setIsFocused]   = useState(!!autoFocus);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router       = useRouter();

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Close on click-outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Meilisearch path (raw fetch — avoids SDK URL-construction issues with sub-path hosts) ──
  const searchMeili = useCallback(async (q: string) => {
    if (!useMeili) return false;
    const headers: HeadersInit = {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${MEILI_KEY}`,
    };
    const [productRes, blogRes] = await Promise.allSettled([
      fetch(`${MEILI_HOST}/indexes/products/search`, {
        method:  'POST',
        headers,
        body:    JSON.stringify({ q, limit: 6, filter: 'in_stock = true' }),
        signal:  AbortSignal.timeout(5000),
      }),
      fetch(`${MEILI_HOST}/indexes/blog/search`, {
        method:  'POST',
        headers,
        body:    JSON.stringify({ q, limit: 3 }),
        signal:  AbortSignal.timeout(5000),
      }),
    ]);

    let prods: SearchProduct[] = [];
    let blg:   SearchBlogPost[] = [];

    if (productRes.status === 'fulfilled' && productRes.value.ok) {
      const data = await productRes.value.json();
      prods = data.hits ?? [];
    } else if (productRes.status === 'rejected') {
      console.error('[SearchCommand] Meilisearch products fetch failed:', productRes.reason);
    }
    if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
      const data = await blogRes.value.json();
      blg = data.hits ?? [];
    }

    setProducts(prods);
    setPosts(blg);
    trackSearch(q, prods.length + blg.length, 'meilisearch');
    return true;
  }, []);

  // ── PHP fallback path ───────────────────────────────────────────────────────
  const searchPhp = useCallback(async (q: string) => {
    const enc = encodeURIComponent(q);
    const [productRes, blogRes] = await Promise.allSettled([
      fetch(`${PHP_API}/api/products.php?search=${enc}&limit=6&status=published`),
      fetch(`${PHP_API}/api/blog.php?search=${enc}&limit=3`),
    ]);

    let prods: SearchProduct[] = [];
    let blg:   SearchBlogPost[] = [];

    if (productRes.status === 'fulfilled' && productRes.value.ok) {
      const data = await productRes.value.json();
      prods = (data.products ?? data.data ?? []).slice(0, 6);
    }
    if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
      const data = await blogRes.value.json();
      blg = (data.posts ?? []).slice(0, 3);
    }

    setProducts(prods);
    setPosts(blg);
    trackSearch(q, prods.length + blg.length, 'php');
  }, []);

  // ── Unified search with debounce ────────────────────────────────────────────
  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setProducts([]);
      setPosts([]);
      return;
    }
    setLoading(true);
    try {
      const handledByMeili = await searchMeili(q);
      if (!handledByMeili) await searchPhp(q);
    } catch {
      setProducts([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [searchMeili, searchPhp]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    setActiveIndex(-1);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  const allItems = [
    ...products.map(p => ({ href: `/product/${p.slug}` })),
    ...posts.map(p => ({ href: `/blog/${p.slug}` })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, allItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, -1));
        break;
      case 'Enter':
        if (activeIndex >= 0 && allItems[activeIndex]) {
          router.push(allItems[activeIndex].href);
          onClose?.();
        } else if (query.trim()) {
          router.push(`/products?q=${encodeURIComponent(query.trim())}`);
          onClose?.();
        }
        break;
      case 'Escape':
        setIsFocused(false);
        onClose?.();
        break;
    }
  };

  const showDropdown = isFocused && query.length > 0;
  const showPopular  = isFocused && query.length === 0;
  const showEmpty    = showDropdown && !loading && products.length === 0 && posts.length === 0;

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      {/* Input */}
      <div className="relative flex items-center">
        <svg
          className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown || showPopular}
          aria-controls="search-listbox"
          aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
          aria-label="Search watches and guides"
          placeholder="Search watches, brands, models…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B50012] focus:border-transparent placeholder-gray-400 transition-all"
          autoComplete="off"
        />
        {loading && (
          <div
            className="absolute right-3 w-3.5 h-3.5 border-2 border-[#B50012] border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Popular searches (focused, no query) */}
      {showPopular && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Popular searches
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map(s => (
              <Link
                key={s.label}
                href={s.href}
                onClick={onClose}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-[#B50012] hover:text-white text-gray-600 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results / empty state */}
      {showDropdown && (
        <div
          id="search-listbox"
          role="listbox"
          aria-label="Search results"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto"
        >
          {showEmpty ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500 mb-4">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-gray-400 mb-3">Try a popular search:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {POPULAR_SEARCHES.map(s => (
                  <Link
                    key={s.label}
                    href={s.href}
                    onClick={onClose}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-[#B50012] hover:text-white text-gray-600 transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <>
              {products.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Watches
                  </div>
                  {products.map((p, i) => (
                    <Link
                      key={p.id}
                      id={`search-item-${i}`}
                      href={`/product/${p.slug}`}
                      role="option"
                      aria-selected={activeIndex === i}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeIndex === i ? 'bg-gray-50' : ''}`}
                    >
                      {p.image_1 ? (
                        <img
                          src={p.image_1}
                          alt=""
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-300 text-lg">
                          ⌚
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {p.brand} {p.model}{p.reference_number ? ` ${p.reference_number}` : ''}
                        </div>
                        <div className="text-xs text-gray-400">
                          ¥{p.price_jpy?.toLocaleString()} · {p.condition}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {posts.length > 0 && (
                <div className={products.length > 0 ? 'border-t border-gray-100' : ''}>
                  <div className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Guides
                  </div>
                  {posts.map((post, i) => {
                    const idx = products.length + i;
                    return (
                      <Link
                        key={post.slug}
                        id={`search-item-${idx}`}
                        href={`/blog/${post.slug}`}
                        role="option"
                        aria-selected={activeIndex === idx}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeIndex === idx ? 'bg-gray-50' : ''}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400 text-sm">
                          📝
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{post.title}</div>
                          {post.excerpt && (
                            <div className="text-xs text-gray-400 truncate">{post.excerpt}</div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {query.trim() && (
                <div className="border-t border-gray-100">
                  <Link
                    href={`/products?q=${encodeURIComponent(query.trim())}`}
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm text-[#B50012] font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    See all results for &ldquo;{query}&rdquo;
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
