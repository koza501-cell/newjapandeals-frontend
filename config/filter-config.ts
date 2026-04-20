/**
 * Single source of truth for all product filters.
 * Update this file to add/remove categories, conditions, brands, etc.
 */

export const CATEGORIES = [
  { value: 'watches',            label: '⌚ Watches' },
  { value: 'diecast-toys',       label: '🚗 Die-cast & Toys' },
  { value: 'camera-accessories', label: '📷 Camera Accessories' },
  { value: 'other',              label: '📦 Other' },
] as const;

export interface FilterGroup {
  id:      string;
  label:   string;
  type:    'checkbox' | 'radio';
  options: string[];
}

/**
 * Category-specific filter groups.
 * Keys must match CATEGORIES[n].value.
 */
export const CATEGORY_FILTERS: Record<string, FilterGroup[]> = {
  watches: [
    {
      id:      'brand',
      label:   'Brand',
      type:    'checkbox',
      options: ['Seiko', 'Casio', 'G-Shock', 'Citizen', 'Orient', 'Diesel', 'Other'],
    },
    {
      id:      'movement',
      label:   'Movement',
      type:    'checkbox',
      options: ['Quartz', 'Automatic', 'Manual Wind', 'Solar', 'Unknown'],
    },
  ],
  'diecast-toys': [
    {
      id:      'brand',
      label:   'Brand',
      type:    'checkbox',
      options: ['Tomica', 'Hot Wheels', 'Matchbox', 'Other'],
    },
  ],
  'camera-accessories': [
    {
      id:      'brand',
      label:   'Brand',
      type:    'checkbox',
      options: ['Canon', 'Nikon', 'Sony', 'Olympus', 'Other'],
    },
  ],
  other: [],
};

export const CONDITIONS = ['Like New', 'Good', 'Fair', 'For Parts'] as const;

export const PRICE_RANGES = [
  { label: 'Under ¥2,000',       min: 0,     max: 2000   },
  { label: '¥2,000 – ¥5,000',    min: 2000,  max: 5000   },
  { label: '¥5,000 – ¥10,000',   min: 5000,  max: 10000  },
  { label: '¥10,000 – ¥20,000',  min: 10000, max: 20000  },
  { label: 'Over ¥20,000',       min: 20000, max: 999999 },
] as const;

/** Set of valid category values for runtime validation. */
export const VALID_CATEGORIES = new Set(CATEGORIES.map(c => c.value));

/** Set of valid condition values for runtime validation. */
export const VALID_CONDITIONS = new Set(CONDITIONS as readonly string[]);
