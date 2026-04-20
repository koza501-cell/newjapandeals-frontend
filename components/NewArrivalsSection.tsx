import Link from 'next/link';
import FeaturedWatchCard from './FeaturedWatchCard';

export const revalidate = 3600;

const MEILI_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST;
const MEILI_KEY  = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY;

interface MeiliProduct {
  slug:      string;
  title:     string;
  brand:     string;
  condition: string;
  price_jpy: number;
  image_1:   string | null;
}

async function fetchNewArrivals(): Promise<MeiliProduct[]> {
  if (!MEILI_HOST || !MEILI_KEY) return [];
  try {
    const res = await fetch(`${MEILI_HOST}/indexes/products/search`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${MEILI_KEY}`,
      },
      body: JSON.stringify({
        q:       '',
        // Exclude featured products (they show in the section above) and sold/archived
        filter:  'featured != 1 AND status NOT IN ["sold_mercari", "sold_website", "archived"] AND availability != "sold"',
        sort:    ['created_at:desc'],
        limit:   4,
        attributesToRetrieve: ['slug', 'title', 'brand', 'condition', 'price_jpy', 'image_1'],
      }),
      // @ts-expect-error — Next.js extended fetch option
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.hits ?? [];
  } catch {
    return [];
  }
}

export default async function NewArrivalsSection() {
  const products = await fetchNewArrivals();
  if (products.length === 0) return null;

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            New Arrivals
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Just landed from Japan
          </p>
        </div>

        {/* Grid: 2 cols mobile → 3 cols tablet → 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product, index) => (
            <FeaturedWatchCard
              key={product.slug}
              slug={product.slug}
              title={product.title}
              brand={product.brand ?? ''}
              condition={product.condition ?? ''}
              price_jpy={product.price_jpy ?? 0}
              imageUrl={product.image_1}
              priority={index < 2}
            />
          ))}
        </div>

        {/* View all */}
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 underline underline-offset-4"
          >
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
