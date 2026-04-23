import type { Metadata } from 'next';
import Link from 'next/link';

const API_URL = 'https://api.newjapandeals.com';
const SITE_URL = 'https://www.newjapandeals.com';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Watch Brands | New Japan Deals',
  description:
    'Browse authentic Japanese watches by brand. Seiko, Citizen, Casio, G-Shock, Orient & more. Licensed dealer since 2014.',
  alternates: { canonical: `${SITE_URL}/brands` },
  openGraph: {
    title: 'Watch Brands | New Japan Deals',
    description: 'Browse authentic Japanese watches by brand. Licensed dealer since 2014.',
    url: `${SITE_URL}/brands`,
  },
};

interface BrandEntry {
  brand: string;
  count: string;
}

async function fetchBrands(): Promise<BrandEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/products.php?action=brands`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return data.brands || [];
  } catch {
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await fetchBrands();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Watch Brands',
    description: 'Browse authentic Japanese watches by brand.',
    url: `${SITE_URL}/brands`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'New Japan Deals',
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-red-600">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800">Brands</span>
          </nav>

          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Watch Brands
          </h1>
          <p className="text-gray-500 mb-8">
            Browse our collection by brand. All watches sourced directly from Japan.
          </p>

          {brands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {brands.map((b) => {
                const brandSlug = b.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <Link
                    key={b.brand}
                    href={`/brand/${brandSlug}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-red-50 transition-colors">
                      <span className="text-2xl text-gray-400 group-hover:text-red-600 transition-colors">&#x231A;</span>
                    </div>
                    <h2 className="font-semibold text-gray-900 text-lg mb-1">{b.brand}</h2>
                    <p className="text-sm text-gray-500">
                      {b.count} {Number(b.count) === 1 ? 'watch' : 'watches'}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">No brands available at the moment.</p>
          )}
        </div>
      </div>
    </>
  );
}
