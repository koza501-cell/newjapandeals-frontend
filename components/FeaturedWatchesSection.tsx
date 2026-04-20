import Link from 'next/link';
import FeaturedWatchCard from './FeaturedWatchCard';
import { featuredSlugs } from '@/config/featured-watches';

const API_URL = 'https://api.newjapandeals.com';

interface RawProduct {
  slug: string;
  title_en?: string;
  title_jp?: string;
  brand?: string;
  model?: string;
  condition?: string;
  price_jpy?: number;
  image_1?: string;
  image?: string;
  images?: string[];
  status?: string;
}

async function fetchProductBySlug(slug: string): Promise<RawProduct | null> {
  try {
    const res = await fetch(`${API_URL}/api/products.php?slug=${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const product: RawProduct | undefined = data.products?.[0] ?? data.data?.[0];
    return product ?? null;
  } catch {
    return null;
  }
}

export default async function FeaturedWatchesSection() {
  const results = await Promise.all(featuredSlugs.map(fetchProductBySlug));
  const products = results.filter((p): p is RawProduct => p !== null && p.status !== 'sold');

  if (products.length === 0) return null;

  return (
    <section className="bg-gray-50 py-14 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Featured Watches
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Hand-picked from our Japan inventory · Updated weekly
          </p>
        </div>

        {/* Grid: 2 cols mobile → 3 cols tablet → 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product, index) => {
            const title =
              product.title_en ||
              product.title_jp ||
              `${product.brand ?? ''} ${product.model ?? ''}`.trim() ||
              'Watch';
            const imageUrl =
              product.image_1 ||
              product.image ||
              (Array.isArray(product.images) ? product.images[0] : null) ||
              null;

            return (
              <FeaturedWatchCard
                key={product.slug}
                slug={product.slug}
                title={title}
                brand={product.brand ?? ''}
                condition={product.condition ?? ''}
                price_jpy={product.price_jpy ?? 0}
                imageUrl={imageUrl}
                priority={index < 2}
              />
            );
          })}
        </div>

        {/* View all */}
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 underline underline-offset-4"
          >
            View all watches →
          </Link>
        </div>
      </div>
    </section>
  );
}
