'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = 'https://api.newjapandeals.com';
const SECRET_KEY = 'njd2026'; // Add ?preview=njd2026 to URL to see products

interface Product {
  id: number;
  slug: string;
  title_en: string;
  brand: string;
  model: string;
  price_jpy: string;
  condition: string;
  image_1: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === SECRET_KEY;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPreview) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [isPreview]);

  async function fetchProducts() {
    try {
      const res = await fetch(`${API_URL}/api/products.php?status=published`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  // Coming Soon Page for Public
  if (!isPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Watch Animation SVG */}
        <div className="absolute top-20 right-10 opacity-10 hidden lg:block">
          <svg width="300" height="300" viewBox="0 0 100 100" className="animate-spin" style={{animationDuration: '20s'}}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="1"/>
            <line x1="50" y1="50" x2="50" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="50" y1="50" x2="70" y2="50" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Launching Soon
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-tight">
            <span className="block">Authentic Japanese</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Watches
            </span>
            <span className="block text-2xl md:text-3xl font-normal text-gray-300 mt-4">
              Direct from Japan to Your Wrist
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-center text-gray-300 max-w-2xl mx-auto mb-12">
            We're curating an exclusive collection of vintage and modern Japanese timepieces. 
            Skip the proxy services and buy directly from Japan.
          </p>

          {/* Stats/Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">20-40%</div>
              <div className="text-sm text-gray-400">Savings vs Proxies</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">48h</div>
              <div className="text-sm text-gray-400">Fast Shipping</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-sm text-gray-400">Authentic Items</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition">
              <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">$0</div>
              <div className="text-sm text-gray-400">No Proxy Fees</div>
            </div>
          </div>

          {/* Brands Preview */}
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">Featured Brands</p>
            <div className="flex flex-wrap justify-center gap-8 text-2xl md:text-3xl font-light text-gray-400">
              <span className="hover:text-white transition">SEIKO</span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-white transition">CITIZEN</span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-white transition">CASIO</span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-white transition">ORIENT</span>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Be the First to Know</h2>
            <p className="text-gray-300 mb-8">
              Get notified when we launch and receive exclusive early access to our collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Notify Me
              </Link>
              <Link 
                href="/blog" 
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition border border-white/20"
              >
                Read Our Blog
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 mb-4">Trusted & Secure</p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SSL Secured
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                PayPal Protected
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Seller
              </div>
            </div>
          </div>

          {/* Back Home Link */}
          <div className="mt-12 text-center">
            <Link href="/" className="text-gray-400 hover:text-white transition inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Real Products Page (only visible with ?preview=njd2026)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Preview Mode Banner */}
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-6">
          <strong>Preview Mode:</strong> Only you can see this page. Public sees "Coming Soon".
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
                  {product.image_1 ? (
                    <img 
                      src={`${API_URL}${product.image_1}`}
                      alt={product.title_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.title_en || `${product.brand} ${product.model}`}
                  </h3>
                  <p className="text-lg font-bold text-blue-600">
                    ¥{parseInt(product.price_jpy).toLocaleString()}
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
