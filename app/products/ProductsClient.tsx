'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import FilterPanel from '@/components/FilterPanel';
import { useCurrency } from '@/context/CurrencyContext';
import {
  CATEGORIES,
  GENDERS,
  PRICE_RANGES,
  SORT_OPTIONS,
  DEFAULT_SORT,
  PAGE_SIZE,
} from '@/config/filter-config';

const MEILI_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST;
const MEILI_KEY  = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY;
const PHP_API    = 'https://api.newjapandeals.com';

// ── Types ─────────────────────────────────────────────────────────────────────

interface MeiliProduct {
  id:        string;
  slug:      string;
  title:     string;
  brand:     string;
  condition: string;
  price_jpy: number;
  image_1:   string | null;
  status?:   string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Escape single-quotes in filter values to prevent Meilisearch filter injection. */
function esc(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// These statuses are ALWAYS excluded — cannot be overridden by user filters.
// Belt-and-suspenders: the reindex cron also excludes these from the index,
// but we enforce it here too so a re-listed item never slips through.
// Note: status='sold' products ARE shown (with a SOLD badge).
const BASE_FILTER = 'status NOT IN ["sold_mercari", "sold_website", "archived"]';

function buildFilter(params: URLSearchParams): string {
  const parts: string[] = [BASE_FILTER];

  const category = params.get('category') ?? '';
  if (category) parts.push(`category = '${esc(category)}'`);

  const conditions = params.getAll('condition');
  if (conditions.length > 0) {
    parts.push(`condition IN [${conditions.map(c => `'${esc(c)}'`).join(', ')}]`);
  }

  const priceMin = params.get('priceMin');
  const priceMax = params.get('priceMax');
  if (priceMin !== null && priceMax !== null) {
    const lo = Number(priceMin);
    const hi = Number(priceMax);
    if (lo === 0) {
      parts.push(`price_jpy <= ${hi}`);
    } else if (hi >= 9999999) {
      parts.push(`price_jpy >= ${lo}`);
    } else {
      parts.push(`price_jpy ${lo} TO ${hi}`);
    }
  }

  const brands = params.getAll('brand');
  if (brands.length > 0) {
    parts.push(`brand IN [${brands.map(b => `'${esc(b)}'`).join(', ')}]`);
  }

  const movements = params.getAll('movement_type');
  if (movements.length > 0) {
    parts.push(`movement_type IN [${movements.map(m => `'${esc(m)}'`).join(', ')}]`);
  }

  const genders = params.getAll('gender');
  if (genders.length > 0) {
    parts.push(`gender IN [${genders.map(g => `'${esc(g)}'`).join(', ')}]`);
  }

  return parts.join(' AND ');
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: MeiliProduct }) {
  const { format, currency } = useCurrency();
  const jpyDisplay = `¥${product.price_jpy.toLocaleString()}`;
  const converted  = currency !== 'JPY' ? format(product.price_jpy) : null;
  const isSold = product.status === 'sold';

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
        {product.image_1 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_1}
            alt={`${product.brand} ${product.title}`}
            className={`h-full w-full object-cover transition-transform duration-300 ${isSold ? '' : 'group-hover:scale-105'}`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-gray-300">⌚</div>
        )}
        {isSold && (
          <div className="absolute top-0 left-0" style={{ width: 0, height: 0, borderTop: '80px solid #e53935', borderRight: '80px solid transparent' }}>
            <span className="absolute font-bold text-white" style={{ fontSize: '14px', transform: 'rotate(-45deg)', top: '-68px', left: '2px', width: '56px', textAlign: 'center', lineHeight: 1 }}>
              SOLD
            </span>
          </div>
        )}
        {product.condition && !isSold && (
          <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm">
            {product.condition}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        {product.brand && (
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            {product.brand}
          </p>
        )}
        <h3 className="mb-2.5 flex-1 text-sm font-medium leading-snug text-gray-900 line-clamp-2">
          {product.title}
        </h3>
        <p className={`text-sm font-bold ${isSold ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{jpyDisplay}</p>
        {converted && <p className={`text-xs ${isSold ? 'text-gray-400 line-through' : 'text-gray-500'}`}>{converted}</p>}
      </div>
    </Link>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage:  number;
  totalPages:   number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const delta = 2;
  const rangeStart = Math.max(1, currentPage - delta);
  const rangeEnd   = Math.min(totalPages, currentPage + delta);
  const range: number[] = [];
  for (let i = rangeStart; i <= rangeEnd; i++) range.push(i);

  const showLeftEllipsis  = rangeStart > 2;
  const showRightEllipsis = rangeEnd < totalPages - 1;
  const showFirst         = rangeStart > 1;
  const showLast          = rangeEnd < totalPages;

  const btn = (active: boolean) =>
    `flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors
     ${active
       ? 'border-gray-900 bg-gray-900 text-white'
       : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'}`;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={btn(false)}
      >
        ← Prev
      </button>

      {showFirst && (
        <>
          <button type="button" onClick={() => onPageChange(1)} className={btn(false)}>1</button>
          {showLeftEllipsis && <span className="px-1 text-sm text-gray-400">…</span>}
        </>
      )}

      {range.map(p => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={btn(p === currentPage)}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {showLast && (
        <>
          {showRightEllipsis && <span className="px-1 text-sm text-gray-400">…</span>}
          <button type="button" onClick={() => onPageChange(totalPages)} className={btn(false)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={btn(false)}
      >
        Next →
      </button>
    </nav>
  );
}

// ── ProductsClient ────────────────────────────────────────────────────────────

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();

  const [products,         setProducts]         = useState<MeiliProduct[]>([]);
  const [totalHits,        setTotalHits]        = useState(0);
  const [facets,           setFacets]           = useState<Record<string, Record<string, number>>>({});
  const [loading,          setLoading]          = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const searchParamsStr = searchParams.toString();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function doFetch() {
      const params  = new URLSearchParams(searchParamsStr);
      const q       = params.get('q') ?? '';
      const sort    = params.get('sort') ?? DEFAULT_SORT;
      const page    = Math.max(1, Number(params.get('page') ?? '1'));
      const offset  = (page - 1) * PAGE_SIZE;
      const filter  = buildFilter(params);

      // ── Meilisearch path ───────────────────────────────────────────────────
      if (MEILI_HOST && MEILI_KEY) {
        try {
          const res = await fetch(`${MEILI_HOST}/indexes/products/search`, {
            method:  'POST',
            headers: {
              'Content-Type':  'application/json',
              'Authorization': `Bearer ${MEILI_KEY}`,
            },
            body: JSON.stringify({
              q,
              filter,
              sort:   [sort],
              limit:  PAGE_SIZE,
              offset,
              facets: ['category', 'brand', 'condition', 'movement_type', 'gender', 'status'],
              attributesToRetrieve: ['id', 'slug', 'title', 'brand', 'condition', 'price_jpy', 'image_1', 'status'],
            }),
            signal: AbortSignal.timeout(8000),
          });

          if (!cancelled && res.ok) {
            const data = await res.json();
            const hits = data.hits ?? [];
            // If an unfiltered, no-query search returns 0 results the index is
            // likely empty (e.g. after a Meilisearch crash/restart). Fall through
            // to the PHP fallback so the page never goes blank unexpectedly.
            const hasUserFilters = q !== '' || filter !== BASE_FILTER;
            if (hits.length > 0 || hasUserFilters) {
              setProducts(hits);
              setTotalHits(data.estimatedTotalHits ?? hits.length);
              setFacets(data.facetDistribution ?? {});
              setLoading(false);
              return;
            }
            // 0 results + no filters → index appears empty, fall through to PHP
            console.warn('[Products] Meilisearch returned 0 results with no filters — falling back to PHP');
          }
        } catch (err) {
          if (!cancelled) console.error('[Products] Meilisearch error:', err);
        }
      }

      // ── PHP fallback (no filtering, no facets) ─────────────────────────────
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
              status:    p.status ?? '',
            }))
          );
          setTotalHits(raw.length);
          setFacets({});
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

  // ── URL helpers ────────────────────────────────────────────────────────────

  /**
   * Update filter params and reset to page 1.
   * Pass null to remove a param, array for multi-value params.
   */
  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // filter change → back to page 1
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

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete('page');
    else params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ── Derived state ──────────────────────────────────────────────────────────

  const q             = searchParams.get('q') ?? '';
  const category      = searchParams.get('category') ?? '';
  const conditions    = searchParams.getAll('condition');
  const priceMin      = searchParams.get('priceMin') !== null ? Number(searchParams.get('priceMin')) : null;
  const priceMax      = searchParams.get('priceMax') !== null ? Number(searchParams.get('priceMax')) : null;
  const brands        = searchParams.getAll('brand');
  const movementTypes = searchParams.getAll('movement_type');
  const genders       = searchParams.getAll('gender');
  const sort          = searchParams.get('sort') ?? DEFAULT_SORT;
  const currentPage   = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const totalPages    = Math.ceil(totalHits / PAGE_SIZE);

  const activeFilterCount =
    (category ? 1 : 0) +
    conditions.length +
    (priceMin !== null || priceMax !== null ? 1 : 0) +
    brands.length +
    movementTypes.length +
    genders.length;

  // Active filter chips
  type Chip = { label: string; onRemove: () => void };
  const chips: Chip[] = [];

  if (category) {
    const cat = CATEGORIES.find(c => c.value === category);
    chips.push({
      label:    cat?.label ?? category,
      onRemove: () => updateFilters({ category: null, movement_type: null, gender: null }),
    });
  }
  conditions.forEach(c =>
    chips.push({ label: c, onRemove: () => updateFilters({ condition: conditions.filter(x => x !== c) }) })
  );
  if (priceMin !== null || priceMax !== null) {
    const range = PRICE_RANGES.find(r => r.min === priceMin && r.max === priceMax);
    chips.push({ label: range?.label ?? 'Price filter', onRemove: () => updateFilters({ priceMin: null, priceMax: null }) });
  }
  brands.forEach(b =>
    chips.push({ label: b, onRemove: () => updateFilters({ brand: brands.filter(x => x !== b) }) })
  );
  movementTypes.forEach(m =>
    chips.push({ label: m, onRemove: () => updateFilters({ movement_type: movementTypes.filter(x => x !== m) }) })
  );
  genders.forEach(g => {
    const gObj = GENDERS.find(x => x.value === g);
    chips.push({ label: gObj?.label ?? g, onRemove: () => updateFilters({ gender: genders.filter(x => x !== g) }) });
  });

  const filterPanelProps = {
    category,
    conditions,
    priceMin,
    priceMax,
    brands,
    movementTypes,
    genders,
    facets,
    resultCount: totalHits,
    onChange:    updateFilters,
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1
          className="mb-6 text-3xl font-bold text-gray-900"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {q ? `Results for "${q}"` : 'All Products'}
        </h1>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel {...filterPanelProps} isDesktop />
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Filter bar */}
            <div className="mb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Result count */}
                <p className="text-sm text-gray-500">
                  {loading
                    ? 'Loading\u2026'
                    : `${totalHits.toLocaleString()} result${totalHits !== 1 ? 's' : ''}`}
                </p>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <select
                    value={sort}
                    onChange={e => updateFilters({ sort: e.target.value })}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
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
                    Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
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
                      <span aria-hidden="true" className="opacity-60">×</span>
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

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="aspect-square animate-pulse bg-gray-200" />
                    <div className="space-y-2 p-3.5">
                      <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                      <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <p className="mb-3 text-xl">No products found</p>
                {activeFilterCount > 0 && (
                  <button type="button" onClick={clearAll} className="text-sm text-gray-600 underline">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
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
          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white">
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
            <div className="px-5 pb-6 pt-2">
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
