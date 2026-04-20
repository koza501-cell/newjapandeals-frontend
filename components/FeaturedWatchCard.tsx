'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';

interface FeaturedWatchCardProps {
  slug: string;
  title: string;
  brand: string;
  condition: string;
  price_jpy: number;
  imageUrl: string | null;
  priority?: boolean;
}

export default function FeaturedWatchCard({
  slug,
  title,
  brand,
  condition,
  price_jpy,
  imageUrl,
  priority = false,
}: FeaturedWatchCardProps) {
  const { format, currency } = useCurrency();

  const jpyDisplay = `¥${price_jpy.toLocaleString()}`;
  const convertedDisplay = currency !== 'JPY' ? format(price_jpy) : null;

  return (
    <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/product/${slug}`} className="block relative aspect-square bg-gray-100 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${brand} ${title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
            ⌚
          </div>
        )}
        {/* Condition badge */}
        {condition && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded">
            {condition}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {brand && (
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            {brand}
          </p>
        )}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-3 flex-1">
          {title}
        </h3>

        {/* Price */}
        <div className="mb-4">
          <p className="text-lg font-bold text-gray-900">{jpyDisplay}</p>
          {convertedDisplay && (
            <p className="text-xs text-gray-500">{convertedDisplay}</p>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/product/${slug}`}
          className="block w-full bg-gray-900 hover:bg-black text-white text-sm font-semibold text-center py-2.5 rounded-lg transition-colors"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}
