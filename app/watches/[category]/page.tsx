import { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/api';

const API_URL = 'https://api.newjapandeals.com';
const SITE_URL = 'https://www.newjapandeals.com';

export const revalidate = 300;

interface Props {
  params: { category: string };
}

const categoryInfo: Record<string, { name: string; description: string; param: string; paramKey: string }> = {
  automatic: {
    name: 'Automatic',
    description: 'Discover authentic automatic (self-winding) Japanese watches. From Seiko Presage to Orient Bambino, explore mechanical excellence powered by your wrist movement.',
    param: 'automatic',
    paramKey: 'movement',
  },
  quartz: {
    name: 'Quartz',
    description: 'Shop precision quartz Japanese watches. Battery-powered reliability from Seiko, Citizen, Casio, and more.',
    param: 'quartz',
    paramKey: 'movement',
  },
  'hand-wind': {
    name: 'Hand-Wind',
    description: 'Explore traditional hand-winding Japanese watches. Manual mechanical timepieces for the true watch enthusiast.',
    param: 'hand-wind',
    paramKey: 'movement',
  },
  solar: {
    name: 'Solar',
    description: 'Browse solar-powered Japanese watches including Citizen Eco-Drive. Light-powered timepieces that never need a battery change.',
    param: 'solar',
    paramKey: 'movement',
  },
  digital: {
    name: 'Digital',
    description: 'Shop digital Japanese watches including G-Shock, Casio, and more. Iconic digital display timepieces from Japan.',
    param: 'digital',
    paramKey: 'features',
  },
  chronograph: {
    name: 'Chronograph',
    description: 'Discover Japanese chronograph watches. Stopwatch-equipped timepieces from Seiko, Citizen, and Casio.',
    param: 'chronograph',
    paramKey: 'features',
  },
};

async function fetchCategoryProducts(category: string): Promise<Product[]> {
  const info = categoryInfo[category];
  if (!info) return [];
  try {
    const res = await fetch(
      `${API_URL}/api/products.php?${info.paramKey}=${encodeURIComponent(info.param)}`,
      { next: { revalidate: 300 } },
    );
    const data = await res.json();
    return data.products || data.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const info = categoryInfo[params.category];
  const name = info?.name ?? params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const description =
    info?.description ??
    `Shop authentic ${name} Japanese watches direct from Japan. Licensed dealer, worldwide shipping.`;

  return {
    title: `${name} Japanese Watches | New Japan Deals`,
    description,
    alternates: { canonical: `${SITE_URL}/watches/${params.category}` },
    openGraph: {
      title: `${name} Japanese Watches | New Japan Deals`,
      description,
      url: `${SITE_URL}/watches/${params.category}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const info = categoryInfo[params.category];
  const name = info?.name ?? params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const description =
    info?.description ??
    `Shop authentic ${name} Japanese watches direct from Japan. Licensed dealer, worldwide shipping.`;

  const products = await fetchCategoryProducts(params.category);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${name} Japanese Watches`,
    description,
    url: `${SITE_URL}/watches/${params.category}`,
    isPartOf: { '@type': 'WebSite', name: 'New Japan Deals', url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 30).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/product/${p.slug}`,
        name: p.title_en || `${p.brand} ${p.model}`,
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Watch Categories', item: `${SITE_URL}/watches` },
      { '@type': 'ListItem', position: 3, name: `${name} Watches`, item: `${SITE_URL}/watches/${params.category}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-red-600">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/watches" className="text-gray-500 hover:text-red-600">Watch Categories</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800">{name}</span>
          </nav>

          <div className="bg-gray-900 text-white rounded-xl p-8 mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {name} Japanese Watches
            </h1>
            <p className="text-gray-300 max-w-2xl text-sm md:text-base">{description}</p>
          </div>

          <p className="text-gray-600 mb-6">
            {products.length} {name.toLowerCase()} {products.length === 1 ? 'watch' : 'watches'} available
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No {name.toLowerCase()} watches available at the moment.</p>
              <Link href="/products" className="text-red-600 hover:underline mt-2 inline-block">
                Browse all watches
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
