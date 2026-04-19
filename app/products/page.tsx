'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = 'https://api.newjapandeals.com';

interface Product {
  id: number;
  slug: string;
  title_en: string;
  brand: string;
  model: string;
  price_jpy: number;
  condition: string;
  image: string;
  images?: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products.php?status=published`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data || data.products || []);
        }
      })
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-9 w-32 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                      ⌚
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.title_en || `${product.brand} ${product.model}`}
                  </h3>
                  <p className="text-lg font-bold text-blue-600">
                    ¥{Number(product.price_jpy).toLocaleString()}
                  </p>
                  {product.condition && (
                    <p className="text-xs text-gray-500 mt-1">{product.condition}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
