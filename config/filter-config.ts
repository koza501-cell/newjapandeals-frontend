/**
 * Single source of truth for all product filter configuration.
 * Update this file to add/remove categories, price ranges, etc.
 */

export const CATEGORIES = [
  { value: '',                   label: 'All Items' },
  { value: 'watches',            label: '⌚ Watches' },
  { value: 'diecast-toys',       label: '🚗 Die-cast & Toys' },
  { value: 'camera-accessories', label: '📷 Camera Accessories' },
  { value: 'other',              label: '📦 Other' },
] as const;

export const CONDITIONS = ['New', 'Used', 'Working Junk', 'For Parts'] as const;

export const GENDERS = [
  { value: 'mens',   label: "Men's" },
  { value: 'womens', label: "Women's" },
  { value: 'unisex', label: 'Unisex' },
] as const;

export const MOVEMENTS = ['Quartz', 'Automatic', 'Manual Wind', 'Solar', 'Unknown'] as const;

export const PRICE_RANGES = [
  { label: 'Under ¥2,000',       min: 0,     max: 1999    },
  { label: '¥2,000 – ¥5,000',    min: 2000,  max: 4999    },
  { label: '¥5,000 – ¥10,000',   min: 5000,  max: 9999    },
  { label: '¥10,000 – ¥20,000',  min: 10000, max: 19999   },
  { label: 'Over ¥20,000',       min: 20000, max: 9999999 },
] as const;

export const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest First' },
  { value: 'price_jpy:asc',   label: 'Price: Low to High' },
  { value: 'price_jpy:desc',  label: 'Price: High to Low' },
] as const;

/** Movement type and gender filters are only relevant for watches (or all items). */
export const WATCH_ONLY_FILTERS = ['movement_type', 'gender'] as const;

export const DEFAULT_SORT = 'created_at:desc';
export const PAGE_SIZE = 24;
