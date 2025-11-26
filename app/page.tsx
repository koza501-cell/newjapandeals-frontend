import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts, getNewArrivals, getCategories, Product } from '@/lib/api';

export const metadata: Metadata = {
  title: 'New Japan Deals | Authentic Japanese Watches - Seiko, Citizen, G-Shock Direct from Japan',
  description: 'Shop authentic Japanese watches direct from Japan. Seiko, Citizen, Casio G-Shock, Orient & vintage timepieces at the best prices. Free international shipping over ¥50,000.',
  keywords: 'Japanese watches, Seiko, Citizen, G-Shock, Casio, Orient, vintage watches, buy from Japan',
  alternates: {
    canonical: 'https://newjapandeals.com',
  },
};

// Fetch data at build/request time (SSR for SEO)
async function getData() {
  try {
    const [featuredRes, newArrivalsRes, categoriesRes] = await Promise.all([
      getFeaturedProducts(8),
      getNewArrivals(8),
      getCategories(),
    ]);
    
    return {
      featured: featuredRes.data || [],
      newArrivals: newArrivalsRes.data || [],
      categories: categoriesRes.data || [],
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { featured: [], newArrivals: [], categories: [] };
  }
}

export default async function HomePage() {
  const { featured, newArrivals, categories } = await getData();

  // JSON-LD for homepage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'New Japan Deals',
    description: 'Authentic Japanese watches direct from Japan',
    url: 'https://newjapandeals.com',
    priceRange: '¥¥',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Japanese Watches',
      itemListElement: categories.map((cat: any) => ({
        '@type': 'OfferCatalog',
        name: cat.name_en,
        url: `https://newjapandeals.com/category/${cat.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative bg-secondary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        </div>
        <div className="container-custom relative z-20 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Authentic Japanese Watches
              <span className="text-gold block">Direct from Japan</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Discover rare Seiko, Citizen, G-Shock, and vintage timepieces. 
              Sourced directly from Japan with worldwide shipping.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary rounded-lg inline-block">
                Shop All Watches
              </Link>
              <Link href="/brand/seiko" className="btn-secondary border border-white rounded-lg inline-block">
                Browse Seiko
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-cream py-6 border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🇯🇵</span>
              <span className="text-sm font-medium">Direct from Japan</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">✈️</span>
              <span className="text-sm font-medium">Worldwide Shipping</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">✓</span>
              <span className="text-sm font-medium">100% Authentic</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🔒</span>
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Featured Watches</h2>
                <p className="text-gray-600 mt-2">Hand-picked exceptional timepieces</p>
              </div>
              <Link href="/products?featured=1" className="text-primary font-medium hover:underline hidden md:block">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product: Product, index: number) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Link href="/products?featured=1" className="text-primary font-medium hover:underline">
                View All Featured →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Shop by Brand */}
      <section className="py-16 bg-cream">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Shop by Brand
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Seiko', 'Citizen', 'Casio', 'G-Shock', 'Orient', 'Vintage'].map((brand) => (
              <Link
                key={brand}
                href={`/brand/${brand.toLowerCase()}`}
                className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow group"
              >
                <div className="h-16 flex items-center justify-center mb-3">
                  <span className="text-2xl font-display font-bold text-secondary group-hover:text-primary transition-colors">
                    {brand}
                  </span>
                </div>
                <span className="text-sm text-gray-500">Shop Now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold">New Arrivals</h2>
                <p className="text-gray-600 mt-2">Just landed from Japan</p>
              </div>
              <Link href="/products?sort=newest" className="text-primary font-medium hover:underline hidden md:block">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 bg-secondary text-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Why Buy from New Japan Deals?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎌</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct from Japan</h3>
              <p className="text-gray-400">
                We source all watches directly from Japan, ensuring authenticity and access to Japan-exclusive models.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-400">
                By cutting out middlemen, we offer authentic Japanese watches at prices significantly below retail.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Worldwide Shipping</h3>
              <p className="text-gray-400">
                We ship to over 100 countries with tracking. Free shipping on orders over ¥50,000.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Block */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl font-display font-bold mb-6">
            Your Trusted Source for Authentic Japanese Watches
          </h2>
          <div className="prose text-gray-700">
            <p>
              New Japan Deals is your premier destination for authentic Japanese watches shipped directly from Japan. 
              We specialize in iconic Japanese watch brands including Seiko, Citizen, Casio G-Shock, and Orient, 
              as well as rare vintage timepieces that are difficult to find outside of Japan.
            </p>
            <p>
              Whether you're looking for a classic Seiko Presage, a rugged G-Shock, a sophisticated Citizen Eco-Drive, 
              or a collectible vintage piece, our curated selection offers something for every watch enthusiast. 
              All our watches are sourced directly from trusted Japanese suppliers, guaranteeing authenticity.
            </p>
            <p>
              We ship worldwide with full tracking and insurance. Our team carefully inspects and packages each watch 
              to ensure it arrives safely at your doorstep, no matter where you are in the world.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
