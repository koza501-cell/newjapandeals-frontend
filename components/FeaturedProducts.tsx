'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = 'https://api.newjapandeals.com';

interface Product {
  id: number;
  sku: string;
  slug: string;
  title_en: string;
  title_jp: string;
  brand: string;
  model: string;
  price_jpy: number;
  condition: string;
  image: string;
  images: string[];
  status: string;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_URL}/api/products.php?featured=1&limit=4`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const calculateProxySavings = (price: number) => {
    const proxyTotal = price + (price * 0.08) + 500 + 800 + 1000 + 500 + 3000;
    const ourTotal = price + (price * 0.10) + 2500;
    return Math.round(proxyTotal - ourTotal);
  };

  if (loading) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#B50012] rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">Loading featured watches...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Featured Watches
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-picked authentic Japanese timepieces at proxy-free prices.
            </p>
          </div>
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 mb-4">New watches coming soon!</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-[#B50012] font-medium hover:underline"
            >
              Browse All Products <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Featured Watches
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hand-picked authentic Japanese timepieces at proxy-free prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const imageUrl = product.image || product.images?.[0] || null;
            const isSold = product.status === 'sold';
            
            return (
              <Link 
                key={product.id} 
                href={`/product/${product.slug || product.id}`}
                className={`group bg-white rounded-xl shadow-lg overflow-hidden transition-all ${isSold ? 'opacity-75' : 'hover:shadow-xl hover:-translate-y-1'}`}
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.title_en || product.title_jp || `${product.brand} ${product.model}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={`object-cover transition-transform duration-500 ${isSold ? 'grayscale' : 'group-hover:scale-105'}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">⌚</span>
                    </div>
                  )}
                  
                  {/* SOLD Overlay */}
                  {isSold && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-lg font-bold tracking-wider transform -rotate-12 shadow-lg">
                        SOLD
                      </span>
                    </div>
                  )}
                  
                  {/* Savings Badge */}
                  {!isSold && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Save ¥{calculateProxySavings(product.price_jpy).toLocaleString()}
                    </div>
                  )}

                  {/* Condition Badge */}
                  {product.condition && !isSold && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {product.condition}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="text-sm text-[#B50012] font-medium mb-1">
                    {product.brand}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.title_en || product.title_jp || `${product.brand} ${product.model}`}
                  </h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className={`text-2xl font-bold ${isSold ? 'text-gray-400 line-through' : 'text-[#1A1A1A]'}`}>
                        ¥{product.price_jpy.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        ~${Math.round(product.price_jpy / 150)} USD
                      </div>
                    </div>
                    {!isSold && (
                      <div className="text-xs text-gray-400 text-right">
                        <span className="line-through">Via Proxy: ¥{Math.round(product.price_jpy * 1.3).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105"
          >
            View All Watches <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
