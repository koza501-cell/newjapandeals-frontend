'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';

const PHP_API = 'https://api.newjapandeals.com';

interface SoldProduct {
  id: number;
  slug: string;
  title: string;
  title_en: string;
  brand: string;
  model: string;
  price_jpy: number;
  image_1?: string;
  image?: string;
  images?: string[];
  status: string;
}

function SoldCard({ product }: { product: SoldProduct }) {
  const { format, currency } = useCurrency();
  const jpyDisplay = `¥${product.price_jpy.toLocaleString()}`;
  const converted = currency !== 'JPY' ? format(product.price_jpy) : null;
  const imageUrl = product.image_1 || product.image || (product.images?.[0]) || null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`${product.brand} ${product.title_en || product.title}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-gray-300">&#x231A;</div>
        )}
        <div className="absolute inset-0 bg-black/30 overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 w-[150%] py-3 text-center text-2xl font-bold uppercase tracking-widest text-white shadow-lg"
            style={{ backgroundColor: 'rgba(229, 57, 53, 0.85)', transform: 'translate(-50%, -50%) rotate(-35deg)' }}
          >
            SOLD
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        {product.brand && (
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            {product.brand}
          </p>
        )}
        <h3 className="mb-2.5 flex-1 text-sm font-medium leading-snug text-gray-900 line-clamp-2">
          {product.title_en || product.title || `${product.brand} ${product.model}`}
        </h3>
        <p className="text-sm font-bold text-gray-400 line-through">{jpyDisplay}</p>
        {converted && <p className="text-xs text-gray-400 line-through">{converted}</p>}
      </div>
    </Link>
  );
}

export default function RecentlySoldSection() {
  const [products, setProducts] = useState<SoldProduct[]>([]);

  useEffect(() => {
    fetch(`${PHP_API}/api/products.php?status=sold&limit=8&sort=newest`)
      .then(res => res.json())
      .then(data => {
        const items = data.products || data.data || [];
        setProducts(items.slice(0, 8));
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bg-gray-50 py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Recently Sold &mdash; Ships Worldwide
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            These watches found new owners. Yours could be next.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(product => (
            <SoldCard key={product.id || product.slug} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 underline underline-offset-4"
          >
            View All Products &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
