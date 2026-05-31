import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Vintage Japanese Watches | New Japan Deals',
  description:
    'Shop authentic vintage Japanese watches direct from Japan. Rare Seiko, Citizen, Orient and more. ' +
    'Pre-owned classics with worldwide shipping. Licensed dealer since 2014.',
  alternates: { canonical: 'https://www.newjapandeals.com/vintage' },
  openGraph: {
    title: 'Vintage Japanese Watches | New Japan Deals',
    description: 'Rare vintage Japanese watches direct from Japan. Seiko, Citizen, Orient and more.',
    url: 'https://www.newjapandeals.com/vintage',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vintage Japanese Watches | New Japan Deals',
    description: 'Rare vintage Japanese watches. Ships worldwide from Japan.',
  },
};

const API_URL  = 'https://api.newjapandeals.com';
const SITE_URL = 'https://www.newjapandeals.com';

interface Product {
  id: number; slug: string; brand?: string; model?: string;
  title_en?: string; condition?: string; status: string;
  price_jpy: number; price_usd?: number;
  image?: string; images?: string[]; image_1?: string;
  is_vintage?: boolean;
}

async function fetchVintageProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/products.php?is_vintage=1&status=published&limit=100`,
      { next: { revalidate: 300 } },
    );
    const data = await res.json();
    return data.products || data.data || [];
  } catch {
    return [];
  }
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 h-9 w-64 animate-pulse rounded bg-gray-200" />
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

async function VintageGrid() {
  const products = await fetchVintageProducts();

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">⌚</p>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No vintage watches yet</h2>
          <p className="text-gray-500 mb-6">Check back soon — new arrivals added regularly.</p>
          <Link href="/products" className="bg-[#B50012] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#9A0010]">
            Browse All Watches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-[#B50012]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Vintage Watches</span>
          </nav>
          <h1 className="text-3xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Vintage Japanese Watches
          </h1>
          <p className="text-gray-500 mt-1">{products.length} vintage piece{products.length !== 1 ? 's' : ''} available</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((p, idx) => {
            const img = p.image_1 || p.image || (p.images?.[0]) || '/placeholder-watch.jpg';
            const isSold = p.status === 'sold';
            return (
              <article key={p.id} className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow ${isSold ? 'opacity-75' : ''}`}>
                <Link href={`/product/${p.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={img}
                      alt={`${p.brand || ''} ${p.model || ''} vintage watch`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className={`object-cover transition-transform duration-300 ${isSold ? 'grayscale' : 'hover:scale-105'}`}
                      priority={idx < 4}
                    />
                    <span className="absolute bottom-3 left-3 bg-amber-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                      Vintage
                    </span>
                    {isSold && (
                      <div className="absolute top-0 left-0" style={{ width: 0, height: 0, borderTop: '80px solid #e53935', borderRight: '80px solid transparent' }}>
                        <span className="absolute font-bold text-white" style={{ fontSize: '14px', transform: 'rotate(-45deg)', top: '-62px', left: '6px', width: '58px', textAlign: 'center', lineHeight: 1 }}>
                          SOLD
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {p.brand && <p className="text-sm text-[#B50012] font-medium mb-1 uppercase tracking-wide">{p.brand}</p>}
                    <h2 className="font-semibold text-[#1A1A1A] mb-1 line-clamp-2 text-sm md:text-base">{p.title_en || `${p.brand} ${p.model}`}</h2>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-lg font-bold ${isSold ? 'text-gray-400 line-through' : 'text-[#B50012]'}`}>
                        ¥{Number(p.price_jpy).toLocaleString()}
                      </span>
                      {p.price_usd && (
                        <span className="text-xs text-gray-500">~${p.price_usd.toFixed(0)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function VintagePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Vintage Japanese Watches',
    description: 'Authentic vintage Japanese watches direct from Japan.',
    url: `${SITE_URL}/vintage`,
    provider: { '@type': 'Organization', name: 'New Japan Deals', url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense fallback={<Skeleton />}>
        <VintageGrid />
      </Suspense>
    </>
  );
}
