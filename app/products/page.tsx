import { Suspense } from 'react';
import ProductsClient from './ProductsClient';

// Products page re-validates at most every 60 s (header/metadata only — product
// data is fetched client-side via Meilisearch so it's always live).
export const revalidate = 60;

export const metadata = {
  title: 'All Products | New Japan Deals',
  description:
    'Browse authentic Japanese watches, die-cast toys, camera accessories and more. Filter by category, condition, brand and price.',
};

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

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsClient />
    </Suspense>
  );
}
