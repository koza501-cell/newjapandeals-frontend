import { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getBrandProducts, Product } from '@/lib/api';
import { notFound } from 'next/navigation';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = brandInfo[params.brand];
  if (!brand) return { title: 'Brand Not Found' };

  return {
    title: `${brand.name} Watches from Japan | New Japan Deals`,
    description: brand.description,
    alternates: {
      canonical: `https://newjapandeals.com/brand/${params.brand}`,
    },
    openGraph: {
      title: `${brand.name} Watches from Japan`,
      description: brand.description,
      url: `https://newjapandeals.com/brand/${params.brand}`,
    },
  };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const brand = brandInfo[params.brand];
  if (!brand) notFound();

  const page = parseInt(searchParams.page || '1');
  let products: Product[] = [];
  let pagination = { page: 1, limit: 20, total: 0, pages: 0 };

  try {
    const res = await getBrandProducts(brand.name, page);
    products = res.data || [];
    pagination = res.pagination || pagination;
  } catch (error) {
    console.error('Error fetching brand products:', error);
  }

  // JSON-LD for brand page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${brand.name} Watches`,
    description: brand.description,
    url: `https://newjapandeals.com/brand/${params.brand}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'New Japan Deals',
      url: 'https://newjapandeals.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="breadcrumb mb-6">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{brand.name}</span>
        </nav>

        {/* Hero */}
        <div className="bg-secondary text-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {brand.name} Watches from Japan
          </h1>
          <p className="text-gray-300 max-w-2xl">
            {brand.description}
          </p>
        </div>

        {/* Results */}
        <p className="text-gray-600 mb-6">
          {pagination.total} {brand.name} watches available
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
            <p className="text-gray-500 text-lg">No {brand.name} watches available at the moment.</p>
            <Link href="/products" className="text-primary hover:underline mt-2 inline-block">
              Browse all watches
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {page > 1 && (
              <Link
                href={`/brand/${params.brand}?page=${page - 1}`}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            {page < pagination.pages && (
              <Link
                href={`/brand/${params.brand}?page=${page + 1}`}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
