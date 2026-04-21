import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';

// Products page re-validates at most every 60 s (header/metadata only — product
// data is fetched client-side via Meilisearch so it's always live).
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop Authentic Japanese Watches | New Japan Deals',
  description:
    'Browse authentic Japanese watches direct from Japan. Seiko, Citizen, Casio, G-Shock, Orient & more. ' +
    'Filter by brand, condition, and price. Licensed dealer since 2014. Zero proxy fees.',
  alternates: {
    canonical: 'https://www.newjapandeals.com/products',
  },
  openGraph: {
    title:       'Shop Authentic Japanese Watches | New Japan Deals',
    description: 'Browse authentic Japanese watches direct from Japan. Licensed dealer since 2014.',
    url:         'https://www.newjapandeals.com/products',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Shop Authentic Japanese Watches | New Japan Deals',
    description: 'Browse authentic Japanese watches direct from Japan. Zero proxy fees.',
  },
};

const API_URL  = 'https://api.newjapandeals.com';
const SITE_URL = 'https://www.newjapandeals.com';

interface ProductStub {
  slug:    string;
  brand:   string;
  model:   string;
  image_1?: string;
  image?:  string;
  images?: string[];
}

async function fetchRecentProducts(): Promise<ProductStub[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/products.php?status=published&limit=20`,
      { next: { revalidate: 300 } },
    );
    const data = await res.json();
    return (data.products || data.data || []).slice(0, 20);
  } catch {
    return [];
  }
}

function ProductsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 h-9 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="aspect-square animate-pulse bg-gray-200" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ProductsPage() {
  const products = await fetchRecentProducts();

  const itemListJsonLd = products.length > 0
    ? {
        '@context':       'https://schema.org',
        '@type':          'ItemList',
        name:             'Japanese Watches for Sale',
        description:      'Authentic pre-owned Japanese watches direct from Japan.',
        url:              `${SITE_URL}/products`,
        numberOfItems:    products.length,
        itemListElement:  products.map((p, idx) => ({
          '@type':    'ListItem',
          position:   idx + 1,
          url:        `${SITE_URL}/product/${p.slug}`,
          name:       `${p.brand} ${p.model}`,
          image:      p.image_1 || (Array.isArray(p.images) && p.images[0]) || p.image || undefined,
        })),
      }
    : null;

  return (
    <>
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsClient />
      </Suspense>
    </>
  );
}
