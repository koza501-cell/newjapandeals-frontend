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
    <article className="product-card bg-white rounded-lg overflow-hidden shadow-md">
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={`${product.title_en} - ${product.brand || 'Japanese Watch'}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            priority={priority}
          />
          {/* Condition badge */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
            {product.condition}
          </span>
          {/* Featured badge */}
          {product.featured && (
            <span className="absolute top-3 right-3 bg-gold text-white px-2 py-1 rounded text-xs font-medium">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-primary font-medium mb-1">{product.brand}</p>
          )}
          
          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-secondary mb-2 line-clamp-2">
            {product.title_en}
          </h3>
          
          {/* Model */}
          {product.model && (
            <p className="text-sm text-gray-500 mb-2">{product.model}</p>
          )}
          
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price_jpy, 'JPY')}
            </span>
            <span className="text-sm text-gray-500">
              (~{formatPrice(product.price_usd, 'USD')})
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
