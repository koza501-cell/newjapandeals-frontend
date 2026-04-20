'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import FilterPanel from '@/components/FilterPanel';
import { useCurrency } from '@/context/CurrencyContext';
import {
  CATEGORIES,
  PRICE_RANGES,
  VALID_CATEGORIES,
  VALID_CONDITIONS,
} from '@/config/filter-config';

const MEILI_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST;
const MEILI_KEY  = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY;
const PHP_API    = 'https://api.newjapandeals.com';

interface MeiliProduct {
  id:        string;
  slug:      string;
  title:     string;
  brand:     string;
  condition: string;
  price_jpy: number;
  image_1:   string | null;
}

// ── Filter / sort helpers ─────────────────────────────────────────────────────

function buildFilter(params: URLSearchParams): string {
  const parts: string[] = ['in_stock = true'];

  const category = params.get('category') ?? '';
  if (category && VALID_CATEGORIES.has(category)) {
    parts.push(`category = '${category}'`);
  }

  const conditions = params.getAll('condition').filter(c => VALID_CONDITIONS.has(c));
  if (conditions.length > 0) {
    parts.push(`condition IN [${conditions.map(c => `'${c}'`).join(', ')}]`);
  }

  const priceMin = params.get('priceMin');
  const priceMax = params.get('priceMax');
  if (priceMin && Number(priceMin) > 0)      parts.push(`price_jpy >= ${Number(priceMin)}`);
  if (priceMax && Number(priceMax) < 999999) parts.push(`price_jpy <= ${Number(priceMax)}`);

  // Sanitise free values: strip single-quotes to prevent filter injection
  const brands = params.getAll('brand').map(b => b.replace(/'/g, ''));
  if (brands.length > 0) {
    parts.push(`brand IN [${brands.map(b => `'${b}'`).join(', ')}]`);
  }

  const movements = params.getAll('movement').map(m => m.replace(/'/g, ''));
  if (movements.length > 0) {
    parts.push(`movement IN [${movements.map(m => `'${m}'`).join(', ')}]`);
  }

  return parts.join(' AND ');
}

function buildSort(sort: string): string[] {
  if (sort === 'price_asc')  return ['price_jpy:asc'];
  if (sort === 'price_desc') return ['price_jpy:desc'];
  return ['created_at:desc'];
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: MeiliProduct }) {
  const { format, currency } = useCurrency();
  const jpyDisplay = `¥${product.price_jpy.toLocaleString()}`;
  const converted  = currency !== 'JPY' ? format(product.price_jpy) : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
        {product.image_1 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_1}
            alt={`${product.brand} ${product.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-gray-300">
            ⌚
          </div>
        )}
        {product.condition && (
          <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm">
            {product.condition}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
            {product.brand}
          </p>
        )}
        <h3 className="mb-3 flex-1 text-sm font-medium leading-snug text-gray-900 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-base font-bold text-gray-900">{jpyDisplay}</p>
        {converted && <p className="text-xs text-gray-500">{converted}</p>}
      </div>
    </Link>
  );
}

// ── ProductsClient ────────────────────────────────────────────────────────────

export default function ProductsClient() {
  const searchParams    = useSearchParams();
  const router          = useRouter();
  const pathname        = usePathname();

  const [products,         setProducts]         = useState<MeiliProduct[]>([]);
  const [totalHits,        setTotalHits]        = useState(0);
  const [loading,          setLoading]          = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Stable string for effect dependency — only changes when URL actually changes
  const searchParamsStr = searchParams.toString();

  // ── Fetch products whenever URL params change ────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function doFetch() {
      const params = new URLSearchParams(searchParamsStr);
      const q      = params.get('q') ?? '';
      const filter = buildFilter(params);
      const sort   = buildSort(params.get('sort') ?? 'newest');

      // Meilisearch path
      if (MEILI_HOST && MEILI_KEY) {
        try {
          const res = await fetch(`${MEILI_HOST}/indexes/products/search`, {
            method:  'POST',
            headers: {
              'Content-Type':  'application/json',
              'Authorization': `Bearer ${MEILI_KEY}`,
            },
            body:   JSON.stringify({ q, filter, sort, limit: 100 }),
            signal: AbortSignal.timeout(8000),
          });
          if (!cancelled && res.ok) {
            const data = await res.json();
            setProducts(data.hits ?? []);
            setTotalHits(data.estimatedTotalHits ?? (data.hits?.length ?? 0));
            setLoading(false);
            return;
          }
        } catch (err) {
          if (!cancelled) console.error('[Products] Meilisearch error:', err);
        }
      }

      // PHP fallback — no advanced filtering, shows all published products
      try {
        const res = await fetch(`${PHP_API}/api/products.php?status=published`, {
          signal: AbortSignal.timeout(15000),
        });
        if (!cancelled && res.ok) {
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const raw: any[] = data.products ?? data.data ?? [];
          setProducts(
            raw.map(p => ({
              id:        String(p.id ?? p.slug),
              slug:      p.slug,
              title:     p.title_en ?? p.title ?? `${p.brand ?? ''} ${p.model ?? ''}`.trim(),
              brand:     p.brand ?? '',
              condition: p.condition ?? '',
              price_jpy: Number(p.price_jpy ?? 0),
              image_1:   p.image_1 ?? p.image ?? null,
            }))
          );
          setTotalHits(raw.length);
        }
      } catch (err) {
        if (!cancelled) console.error('[Products] PHP fallback error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    doFetch();
    return () => { cancelled = true; };
  }, [searchParamsStr]);

  // ── URL state helpers ────────────────────────────────────────────────────
  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      params.delete(key);
      if (value === null) continue;
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value !== '') {
        params.set(key, value);
      }
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => router.push(pathname, { scroll: false });

  // ── Derived filter state for rendering ───────────────────────────────────
  const q          = searchParams.get('q') ?? '';
  const category   = searchParams.get('category') ?? '';
  const conditions = searchParams.getAll('condition');
  const priceMin   = searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : null;
  const priceMax   = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : null;
  const brands     = searchParams.getAll('brand');
  const movements  = searchParams.getAll('movement');
  const sort       = searchParams.get('sort') ?? 'newest';

  const activeFilterCount = (
    (category ? 1 : 0) +
    conditions.length +
    (priceMin !== null || priceMax !== null ? 1 : 0) +
    brands.length +
    movements.length
  );

  // Active filter chips
  const chips: { label: string; onRemove: () => void }[] = [];
  if (category) {
    const cat = CATEGORIES.find(c => c.value === category);
    chips.push({
      label:    cat?.label ?? category,
      onRemove: () => updateFilters({ category: null, brand: null, movement: null }),
    });
  }
  conditions.forEach(c =>
    chips.push({
      label:    c,
      onRemove: () => updateFilters({ condition: conditions.filter(x => x !== c) }),
    })
  );
  if (priceMin !== null || priceMax !== null) {
    const range = PRICE_RANGES.find(r => r.min === priceMin && r.max === priceMax);
    chips.push({
      label:    range?.label ?? 'Price filter',
      onRemove: () => updateFilters({ priceMin: null, priceMax: null }),
    });
  }
  brands.forEach(b =>
    chips.push({
      label:    b,
      onRemove: () => updateFilters({ brand: brands.filter(x => x !== b) }),
    })
  );
  movements.forEach(m =>
    chips.push({
      label:    m,
      onRemove: () => updateFilters({ movement: movements.filter(x => x !== m) }),
    })
  );

  const filterPanelProps = { category, conditions, priceMin, priceMax, brands, movements, resultCount: totalHits, onChange: updateFilters };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1
          className="mb-6 text-3xl font-bold text-gray-900"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {q ? `Results for "${q}"` : 'All Products'}
        </h1>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <FilterPanel {...filterPanelProps} isDesktop />
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Filter bar */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  {loading
                    ? 'Loading\u2026'
                    : `${totalHits.toLocaleString()} result${totalHits !== 1 ? 's' : ''}`}
                </p>
                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <select
                    value={sort}
                    onChange={e => updateFilters({ sort: e.target.value })}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>

                  {/* Mobile filter button */}
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                  </button>
                </div>
              </div>

              {/* Active filter chips */}
              {chips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {chips.map((chip, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={chip.onRemove}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-xs text-white hover:bg-gray-700 transition-colors"
                    >
                      {chip.label}
                      <span aria-hidden="true" className="text-gray-400">×</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-900"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="aspect-square animate-pulse bg-gray-200" />
                    <div className="space-y-2 p-4">
                      <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                      <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <p className="mb-3 text-xl">No products found</p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm text-gray-600 underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white">
            {/* Sheet header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
                className="-mr-1 p-1 text-gray-400 hover:text-gray-900"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="px-5 pb-6">
              <FilterPanel
                {...filterPanelProps}
                isDesktop={false}
                onMobileApply={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
