'use client';

import { useState } from 'react';
import {
  CATEGORIES,
  CATEGORY_FILTERS,
  CONDITIONS,
  PRICE_RANGES,
  type FilterGroup,
} from '@/config/filter-config';

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Accordion section ─────────────────────────────────────────────────────────

function FilterSection({
  title,
  badge,
  initialOpen,
  children,
}: {
  title:        string;
  badge?:       number;
  initialOpen:  boolean;
  children:     React.ReactNode;
}) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          {title}
          {badge ? (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] text-white">
              {badge}
            </span>
          ) : null}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

// ── Checkbox / radio row ──────────────────────────────────────────────────────

function OptionRow({
  type,
  name,
  value,
  label,
  checked,
  onChange,
}: {
  type:     'checkbox' | 'radio';
  name?:    string;
  value:    string;
  label:    string;
  checked:  boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 group">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 flex-shrink-0 accent-gray-900"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );
}

// ── FilterPanel ───────────────────────────────────────────────────────────────

export interface FilterState {
  category:   string;
  conditions: string[];
  priceMin:   number | null;
  priceMax:   number | null;
  brands:     string[];
  movements:  string[];
}

interface FilterPanelProps extends FilterState {
  resultCount:    number;
  onChange:       (updates: Record<string, string | string[] | null>) => void;
  /** true = desktop sidebar (sections open by default, no Apply button) */
  isDesktop:      boolean;
  /** Called when mobile "Show X results" button is pressed */
  onMobileApply?: () => void;
}

export default function FilterPanel({
  category,
  conditions,
  priceMin,
  priceMax,
  brands,
  movements,
  resultCount,
  onChange,
  isDesktop,
  onMobileApply,
}: FilterPanelProps) {
  const hasAnyFilter = !!(
    category ||
    conditions.length ||
    priceMin !== null ||
    priceMax !== null ||
    brands.length ||
    movements.length
  );

  const activePriceRange =
    PRICE_RANGES.find(r => r.min === priceMin && r.max === priceMax) ?? null;

  const categoryFilters: FilterGroup[] = category ? (CATEGORY_FILTERS[category] ?? []) : [];

  // Handlers
  const handleCategory = (value: string) => {
    const next = category === value ? null : value;
    // Clear category-specific filters when switching category
    onChange({ category: next, brand: null, movement: null });
  };

  const handleCondition = (value: string) => {
    const next = conditions.includes(value)
      ? conditions.filter(c => c !== value)
      : [...conditions, value];
    onChange({ condition: next });
  };

  const handlePriceRange = (min: number, max: number) => {
    if (priceMin === min && priceMax === max) {
      onChange({ priceMin: null, priceMax: null });
    } else {
      onChange({ priceMin: String(min), priceMax: String(max) });
    }
  };

  const handleMulti = (key: string, current: string[], value: string) => {
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ [key]: next });
  };

  const clearAll = () =>
    onChange({
      category: null,
      condition: null,
      priceMin: null,
      priceMax: null,
      brand: null,
      movement: null,
    });

  return (
    <div className={isDesktop ? 'sticky top-4' : ''}>
      {/* Panel header (desktop only) */}
      {isDesktop && (
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-gray-900 underline underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Category */}
      <FilterSection
        title="Category"
        badge={category ? 1 : undefined}
        initialOpen={isDesktop}
      >
        {CATEGORIES.map(cat => (
          <OptionRow
            key={cat.value}
            type="radio"
            name="category"
            value={cat.value}
            label={cat.label}
            checked={category === cat.value}
            onChange={() => handleCategory(cat.value)}
          />
        ))}
      </FilterSection>

      {/* Condition */}
      <FilterSection
        title="Condition"
        badge={conditions.length || undefined}
        initialOpen={isDesktop}
      >
        {CONDITIONS.map(cond => (
          <OptionRow
            key={cond}
            type="checkbox"
            value={cond}
            label={cond}
            checked={conditions.includes(cond)}
            onChange={() => handleCondition(cond)}
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        badge={activePriceRange ? 1 : undefined}
        initialOpen={isDesktop}
      >
        {PRICE_RANGES.map(range => (
          <OptionRow
            key={range.label}
            type="radio"
            name="priceRange"
            value={range.label}
            label={range.label}
            checked={activePriceRange?.label === range.label}
            onChange={() => handlePriceRange(range.min, range.max)}
          />
        ))}
      </FilterSection>

      {/* Dynamic category-specific filters */}
      {categoryFilters.map(group => {
        const current = group.id === 'brand' ? brands : group.id === 'movement' ? movements : [];
        return (
          <FilterSection
            key={group.id}
            title={group.label}
            badge={current.length || undefined}
            initialOpen={isDesktop}
          >
            {group.options.map(option => (
              <OptionRow
                key={option}
                type="checkbox"
                value={option}
                label={option}
                checked={current.includes(option)}
                onChange={() => handleMulti(group.id, current, option)}
              />
            ))}
          </FilterSection>
        );
      })}

      {/* Mobile: Clear all + Show results */}
      {!isDesktop && (
        <div className="mt-6 space-y-3 pb-2">
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="w-full text-sm text-gray-500 hover:text-gray-900"
            >
              Clear all filters
            </button>
          )}
          <button
            type="button"
            onClick={onMobileApply}
            className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            Show {resultCount.toLocaleString()} result{resultCount !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
