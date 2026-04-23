import { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/api';

const API_URL = 'https://api.newjapandeals.com';
const SITE_URL = 'https://www.newjapandeals.com';

export const revalidate = 300;

interface Props {
  params: { brand: string };
  searchParams: { page?: string };
}

const brandInfo: Record<string, { name: string; description: string }> = {
  seiko: {
    name: 'Seiko',
    description: 'Discover authentic Seiko watches from Japan. From the iconic Presage to the legendary Prospex dive watches, shop the complete range of Seiko timepieces.',
  },
  citizen: {
    name: 'Citizen',
    description: 'Shop Citizen Eco-Drive watches from Japan. Solar-powered precision and Japanese craftsmanship in every timepiece.',
  },
  casio: {
    name: 'Casio',
    description: 'Browse Casio watches including digital classics and sophisticated analog models. Japanese reliability at its finest.',
  },
  'g-shock': {
    name: 'G-Shock',
    description: 'Shop G-Shock watches from Japan. Built to withstand extreme conditions, these legendary timepieces combine toughness with style.',
  },
  orient: {
    name: 'Orient',
    description: 'Discover Orient watches from Japan. Affordable mechanical excellence with classic designs and reliable movements.',
  },
  vintage: {
    name: 'Vintage',
    description: 'Explore our collection of vintage Japanese watches. Rare and collectible timepieces from Seiko, Citizen, and more.',
  },
};

/** Fetch products for a brand directly from the PHP API */
async function fetchBrandProducts(brandName: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/products.php?brand=${encodeURIComponent(brandName)}`,
      { next: { revalidate: 300 } },
    );
    const data = await res.json();
    return data.products || data.data || [];
  } catch {
    return [];
  }
}

/** Derive a display name from the slug when it's not in our known list */
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const known = brandInfo[params.brand];
  const brandName = known?.name ?? slugToName(params.brand);
  const description =
    known?.description ??
    `Shop authentic ${brandName} watches direct from Japan. Licensed dealer, worldwide shipping.`;

  return {
    title: `${brandName} Watches for Sale | New Japan Deals`,
    description,
    alternates: { canonical: `${SITE_URL}/brand/${params.brand}` },
    openGraph: {
      title: `${brandName} Watches for Sale | New Japan Deals`,
      description,
      url: `${SITE_URL}/brand/${params.brand}`,
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const known = brandInfo[params.brand];
  const brandName = known?.name ?? slugToName(params.brand);
  const description =
    known?.description ??
    `Shop authentic ${brandName} watches direct from Japan. Licensed dealer, worldwide shipping.`;

  const products = await fetchBrandProducts(brandName);

  // JSON-LD: ItemList schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${brandName} Watches`,
    description,
    url: `${SITE_URL}/brand/${params.brand}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'New Japan Deals',
      url: SITE_URL,
    },
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
      { '@type': 'ListItem', position: 2, name: 'Brands', item: `${SITE_URL}/brands` },
      { '@type': 'ListItem', position: 3, name: brandName, item: `${SITE_URL}/brand/${params.brand}` },
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
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-red-600">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/brands" className="text-gray-500 hover:text-red-600">Brands</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800">{brandName}</span>
          </nav>

          {/* Hero */}
          <div className="bg-gray-900 text-white rounded-xl p-8 mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {brandName} Watches for Sale
            </h1>
            <p className="text-gray-300 max-w-2xl text-sm md:text-base">{description}</p>
          </div>

          {/* Results count */}
          <p className="text-gray-600 mb-6">
            {products.length} {brandName} {products.length === 1 ? 'watch' : 'watches'} available
          </p>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No {brandName} watches available at the moment.</p>
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
