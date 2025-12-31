import Link from 'next/link';
import Image from 'next/image';
import { Product, formatPrice } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const imageUrl = product.image_1 || '/placeholder-watch.jpg';
  
  return (
    <article className="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {/* Clickable Image & Info - Links to Detail Page */}
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={`${product.title_en} - ${product.brand || 'Japanese Watch'}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
          {/* Condition badge */}
          {product.condition && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
              {product.condition}
            </span>
          )}
          {/* Featured badge */}
          {product.featured && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-[#B50012] font-medium mb-1 uppercase tracking-wide">
              {product.brand}
            </p>
          )}
          
          {/* Title */}
          <h3 className="font-semibold text-[#1A1A1A] mb-1 line-clamp-2 text-sm md:text-base">
            {product.title_en}
          </h3>
          
          {/* Model */}
          {product.model && (
            <p className="text-xs text-gray-500 mb-2">{product.model}</p>
          )}
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#B50012]">
              {formatPrice(product.price_jpy, 'JPY')}
            </span>
            <span className="text-xs text-gray-500">
              (~{formatPrice(product.price_usd, 'USD')})
            </span>
          </div>
        </div>
      </Link>

      {/* Dual Buy Buttons - Outside of Link */}
      <div className="px-4 pb-4 space-y-2">
        {/* Buy International Button */}
        <Link
          href={`/product/${product.slug}`}
          className="w-full bg-[#B50012] hover:bg-[#9A0010] text-white py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>🌍</span>
          <span>Buy International</span>
        </Link>

        {/* Buy on Mercari Button */}
        {product.mercari_url ? (
          <a
            href={product.mercari_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-colors border border-gray-300 flex items-center justify-center gap-2"
          >
            <span>🇯🇵</span>
            <span>Buy on Mercari</span>
          </a>
        ) : (
          <div className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-lg font-medium text-sm text-center border border-gray-200 flex items-center justify-center gap-2">
            <span>🇯🇵</span>
            <span>Mercari Soon</span>
          </div>
        )}
      </div>
    </article>
  );
}
