import Link from 'next/link';
import Image from 'next/image';
import { Product, formatPrice } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const imageUrl = product.image || product.images?.[0] || '/placeholder-watch.jpg';
  const isSold = product.status === 'sold';
  
  return (
    <article className={`product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${isSold ? 'opacity-75' : ''}`}>
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={`${product.title_en} - ${product.brand || 'Japanese Watch'}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-300 ${isSold ? 'grayscale' : 'hover:scale-105'}`}
            priority={priority}
          />
          
          {isSold && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-600 text-white px-6 py-2 rounded-lg text-xl font-bold tracking-wider transform -rotate-12 shadow-lg">
                SOLD
              </span>
            </div>
          )}
          
          {product.condition && !isSold && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
              {product.condition}
            </span>
          )}
          
          {product.featured && !isSold && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
              Featured
            </span>
          )}
        </div>

        <div className="p-4">
          {product.brand && (
            <p className="text-sm text-[#B50012] font-medium mb-1 uppercase tracking-wide">
              {product.brand}
            </p>
          )}
          
          <h3 className="font-semibold text-[#1A1A1A] mb-1 line-clamp-2 text-sm md:text-base">
            {product.title_en}
          </h3>
          
          {product.model && (
            <p className="text-xs text-gray-500 mb-2">{product.model}</p>
          )}
          
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-lg font-bold ${isSold ? 'text-gray-400 line-through' : 'text-[#B50012]'}`}>
              {formatPrice(product.price_jpy, 'JPY')}
            </span>
            <span className="text-xs text-gray-500">
              (~{formatPrice(product.price_usd, 'USD')})
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 space-y-2">
        {isSold ? (
          <>
            <div className="w-full bg-gray-300 text-gray-500 py-2.5 rounded-lg font-medium text-sm text-center cursor-not-allowed">
              Sold Out
            </div>
            <div className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-lg font-medium text-sm text-center border border-gray-200">
              No Longer Available
            </div>
          </>
        ) : (
          <>
            <Link
              href={`/product/${product.slug}`}
              className="w-full bg-[#B50012] hover:bg-[#9A0010] text-white py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>🌍</span>
              <span>Buy International</span>
            </Link>
            
            {product.mercari_url ? (
              
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
          </>
        )}
      </div>
    </article>
  );
}
