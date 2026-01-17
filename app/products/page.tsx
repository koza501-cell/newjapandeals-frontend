'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = 'https://api.newjapandeals.com';
const SECRET_KEY = 'njd2026';

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

function ProductsContent() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === SECRET_KEY;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPreview) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/products.php?status=published`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data || data.products || []);
        }
      })
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, [isPreview]);

  // Coming Soon Page for Public
  if (!isPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Launching Soon
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-tight">
            <span className="block">Authentic Japanese</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Watches</span>
            <span className="block text-2xl md:text-3xl font-normal text-gray-300 mt-4">Direct from Japan to Your Wrist</span>
          </h1>

          <p className="text-lg md:text-xl text-center text-gray-300 max-w-2xl mx-auto mb-12">
            We're curating an exclusive collection of vintage and modern Japanese timepieces. 
            Skip the proxy services and buy directly from Japan.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">20-40%</div>
              <div className="text-sm text-gray-400">Savings vs Proxies</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">48h</div>
              <div className="text-sm text-gray-400">Fast Shipping</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-sm text-gray-400">Authentic Items</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">$0</div>
              <div className="text-sm text-gray-400">No Proxy Fees</div>
            </div>
          </div>

          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">Featured Brands</p>
            <div className="flex flex-wrap justify-center gap-8 text-2xl md:text-3xl font-light text-gray-400">
              <span>SEIKO</span>
              <span className="text-gray-600">•</span>
              <span>CITIZEN</span>
              <span className="text-gray-600">•</span>
              <span>CASIO</span>
              <span className="text-gray-600">•</span>
              <span>ORIENT</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Be the First to Know</h2>
            <p className="text-gray-300 mb-8">Get notified when we launch.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition">
                Notify Me
              </Link>
              <Link href="/blog" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition border border-white/20">
                Read Our Blog
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="text-gray-400 hover:text-white transition">← Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  // Real Products Page (preview mode)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-6">
          <strong>Preview Mode:</strong> Only you can see this page.
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.slug}?preview=${SECRET_KEY}`}
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

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-4">Loading...</p>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper - THIS FIXES THE ERROR
export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
