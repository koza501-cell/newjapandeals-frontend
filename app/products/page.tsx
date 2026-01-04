'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TrustBar from '@/components/TrustBar';

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
  image_1: string;
  image: string; 
  images: string[];  
  status: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const productsRes = await fetch(`${API_URL}/api/products.php?status=published`, {
  cache: 'no-store'
});
        const productsData = await productsRes.json();
        if (productsData.success) {
          setProducts(productsData.products || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  const conditions = Array.from(new Set(products.map(p => p.condition).filter(Boolean)));

  let filteredProducts = products.filter(p => {
    if (selectedBrand && p.brand !== selectedBrand) return false;
    if (selectedCondition && p.condition !== selectedCondition) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        p.title_en?.toLowerCase().includes(query) ||
        p.title_jp?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.model?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price_jpy - b.price_jpy;
      case 'price_high': return b.price_jpy - a.price_jpy;
      case 'newest': return b.id - a.id;
      default: return 0;
    }
  });

  const calculateSavings = (price: number | string) => {
    const p = typeof price === 'string' ? parseFloat(price) : price;
    const proxyTotal = p + (p * 0.08) + 500 + 800 + 1000 + 3000;
    const ourTotal = p + (p * 0.10) + 2500;
    return Math.round(proxyTotal - ourTotal);
  };

  const formatPrice = (price: number | string) => {
    const p = typeof price === 'string' ? parseFloat(price) : price;
    return Math.round(p).toLocaleString();
  };

  return (
    <main>
      <TrustBar />
      
      <section className="bg-[#1A1A1A] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Japanese Watches
          </h1>
          <p className="text-gray-400">
            Authentic timepieces at proxy-free prices. All personally inspected and shipped from Japan.
          </p>
        </div>
      </section>

      <div className="bg-[#F5F5F0] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
                <h3 className="font-bold mb-4">Filters</h3>
                
                <div className="mb-6">
                  <label className="text-sm text-gray-500 block mb-2">Search</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search watches..."
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <div className="mb-6">
                  <label className="text-sm text-gray-500 block mb-2">Brand</label>
                  <select 
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-gray-500 block mb-2">Condition</label>
                  <select 
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">All Conditions</option>
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-gray-500 block mb-2">Sort By</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>

                <button 
                  onClick={() => {
                    setSelectedBrand('');
                    setSelectedCondition('');
                    setSearchQuery('');
                    setSortBy('newest');
                  }}
                  className="w-full text-sm text-[#B50012] hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'watch' : 'watches'} found
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#B50012] rounded-full animate-spin"></div>
                  <p className="text-gray-500 mt-4">Loading watches...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow">
                  <p className="text-gray-500 mb-4">No watches found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSelectedBrand('');
                      setSelectedCondition('');
                      setSearchQuery('');
                    }}
                    className="text-[#B50012] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Link 
                      key={product.id}
                      href={`/product/${product.slug || product.id}`}
                      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image || ''}
                            alt={product.title_en || product.title_jp}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-5xl">⌚</span>
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Save ¥{calculateSavings(product.price_jpy).toLocaleString()}
                        </div>

                        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {product.condition}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="text-sm text-[#B50012] font-medium mb-1">
                          {product.brand}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                          {product.title_en || product.title_jp || `${product.brand} ${product.model}`}
                        </h3>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-2xl font-bold text-[#1A1A1A]">
                              ¥{formatPrice(product.price_jpy)}
                            </div>
                            <div className="text-xs text-gray-500">
                              ~${Math.round(parseFloat(String(product.price_jpy)) / 150)} USD
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 text-right">
                            <span className="line-through">Proxy: ~¥{formatPrice(parseFloat(String(product.price_jpy)) * 1.25)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
