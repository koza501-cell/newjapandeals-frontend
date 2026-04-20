'use client';

import { useState } from 'react';
import {
  CATEGORIES,
  CONDITIONS,
  GENDERS,
  MOVEMENTS,
  PRICE_RANGES,
} from '@/config/filter-config';

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Collapsible section ───────────────────────────────────────────────────────

function FilterSection({
  title,
  activeCount,
  children,
}: {
  title:       string;
  activeCount: number;
  children:    React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const header = activeCount > 0 ? `${title} (${activeCount})` : title;

  return (
    <div className="border-b border-gray-100 py-3.5 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className={`text-sm font-semibold ${activeCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
          {header}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="mt-2.5 space-y-2">{children}</div>}
    </div>
  );
}

// ── Option row (checkbox or radio) ───────────────────────────────────────────

function OptionRow({
  type,
  name,
  value,
  label,
  count,
  checked,
  onChange,
}: {
  type:     'checkbox' | 'radio';
  name?:    string;
  value:    string;
  label:    string;
  count?:   number;
  checked:  boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 group">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 flex-shrink-0 accent-gray-900"
      />
      <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900 leading-tight">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-gray-400 tabular-nums">{count}</span>
      )}
    </label>
  );
}

// ── FilterPanel ───────────────────────────────────────────────────────────────

export interface FilterState {
  category:      string;
  conditions:    string[];
  priceMin:      number | null;
  priceMax:      number | null;
  brands:        string[];
  movementTypes: string[];
  genders:       string[];
}

export interface FilterPanelProps extends FilterState {
  /** Facet distribution from Meilisearch — { brand: { Seiko: 12, … }, … } */
  facets:       Record<string, Record<string, number>>;
  resultCount:  number;
  onChange:     (updates: Record<string, string | string[] | null>) => void;
  isDesktop:    boolean;
  onMobileApply?: () => void;
}

const BRANDS_VISIBLE = 8;

export default function FilterPanel({
  category,
  conditions,
  priceMin,
  priceMax,
  brands,
  movementTypes,
  genders,
  facets,
  resultCount,
  onChange,
  isDesktop,
  onMobileApply,
}: FilterPanelProps) {
  const [showAllBrands, setShowAllBrands] = useState(false);

  const hasAnyFilter = !!(
    category ||
    conditions.length ||
    priceMin !== null ||
    priceMax !== null ||
    brands.length ||
    movementTypes.length ||
    genders.length
  );

  // Category is watches or '' → show watch-only filters
  const showWatchFilters = category === '' || category === 'watches';

  // Brands: sort by facet count desc, deduplicate
  const brandFacets = facets?.brand ?? {};
  const allBrandOptions = Object.entries(brandFacets)
    .sort(([, a], [, b]) => b - a)
    .map(([brand, count]) => ({ brand, count }));
  const visibleBrandOptions = showAllBrands
    ? allBrandOptions
    : allBrandOptions.slice(0, BRANDS_VISIBLE);
  const hiddenBrandCount = allBrandOptions.length - BRANDS_VISIBLE;

  // Active price range
  const activePriceRange = PRICE_RANGES.find(
    r => r.min === priceMin && r.max === priceMax
  ) ?? null;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCategory = (value: string) => {
    const next = category === value ? '' : value;
    // Clear watch-only filters when leaving watches
    const extra: Record<string, null> =
      next !== 'watches' && next !== '' ? { movement_type: null, gender: null } : {};
    onChange({ category: next || null, ...extra });
  };

  const toggleMulti = (key: string, current: string[], value: string) => {
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ [key]: next.length ? next : null });
  };

  const handlePriceRange = (min: number, max: number) => {
    if (priceMin === min && priceMax === max) {
      onChange({ priceMin: null, priceMax: null });
    } else {
      onChange({ priceMin: String(min), priceMax: String(max) });
    }
  };

  const clearAll = () =>
    onChange({
      category:      null,
      condition:     null,
      priceMin:      null,
      priceMax:      null,
      brand:         null,
      movement_type: null,
      gender:        null,
    });

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className={isDesktop ? 'sticky top-4' : undefined}>
      {/* Desktop header */}
      {isDesktop && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Filters</span>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-900"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Category */}
      <FilterSection title="Category" activeCount={category ? 1 : 0}>
        {CATEGORIES.map(cat => (
          <OptionRow
            key={cat.value}
            type="radio"
            name="fp-category"
            value={cat.value}
            label={cat.label}
            count={cat.value ? (facets?.category?.[cat.value] ?? undefined) : undefined}
            checked={category === cat.value}
            onChange={() => handleCategory(cat.value)}
          />
        ))}
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition" activeCount={conditions.length}>
        {CONDITIONS.map(cond => (
          <OptionRow
            key={cond}
            type="checkbox"
            value={cond}
            label={cond}
            count={facets?.condition?.[cond]}
            checked={conditions.includes(cond)}
            onChange={() => toggleMulti('condition', conditions, cond)}
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" activeCount={activePriceRange ? 1 : 0}>
        {PRICE_RANGES.map(range => (
          <OptionRow
            key={range.label}
            type="radio"
            name="fp-price"
            value={range.label}
            label={range.label}
            checked={activePriceRange?.label === range.label}
            onChange={() => handlePriceRange(range.min, range.max)}
          />
        ))}
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" activeCount={brands.length}>
        {allBrandOptions.length === 0 ? (
          <p className="text-xs text-gray-400">Loading brands…</p>
        ) : (
          <>
            {visibleBrandOptions.map(({ brand, count }) => (
              <OptionRow
                key={brand}
                type="checkbox"
                value={brand}
                label={brand}
                count={count}
                checked={brands.includes(brand)}
                onChange={() => toggleMulti('brand', brands, brand)}
              />
            ))}
            {allBrandOptions.length > BRANDS_VISIBLE && (
              <button
                type="button"
                onClick={() => setShowAllBrands(s => !s)}
                className="mt-1 text-xs text-gray-500 underline underline-offset-2 hover:text-gray-900"
              >
                {showAllBrands
                  ? 'Show less'
                  : `Show more (+${hiddenBrandCount})`}
              </button>
            )}
          </>
        )}
      </FilterSection>

      {/* Movement Type — watches only */}
      {showWatchFilters && (
        <FilterSection title="Movement Type" activeCount={movementTypes.length}>
          {MOVEMENTS.map(m => (
            <OptionRow
              key={m}
              type="checkbox"
              value={m}
              label={m}
              count={facets?.movement_type?.[m]}
              checked={movementTypes.includes(m)}
              onChange={() => toggleMulti('movement_type', movementTypes, m)}
            />
          ))}
        </FilterSection>
      )}

      {/* Gender — watches only */}
      {showWatchFilters && (
        <FilterSection title="Gender" activeCount={genders.length}>
          {GENDERS.map(g => (
            <OptionRow
              key={g.value}
              type="checkbox"
              value={g.value}
              label={g.label}
              count={facets?.gender?.[g.value]}
              checked={genders.includes(g.value)}
              onChange={() => toggleMulti('gender', genders, g.value)}
            />
          ))}
        </FilterSection>
      )}

      {/* Bottom actions */}
      <div className={`mt-4 space-y-3 ${isDesktop ? '' : 'pb-2'}`}>
        {hasAnyFilter && (
          <button
            type="button"
            onClick={clearAll}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-900"
          >
            Clear all filters
          </button>
        )}
        {!isDesktop && (
          <button
            type="button"
            onClick={onMobileApply}
            className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            Show {resultCount.toLocaleString()} result{resultCount !== 1 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  );
}
