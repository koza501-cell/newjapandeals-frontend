'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import TrustBar from '@/components/TrustBar';

interface Product {
  id: number;
  sku: string;
  slug: string;
  title_en: string;
  title_jp: string;
  description_en: string;
  description_jp: string;
  brand: string;
  model: string;
  reference_number: string;
  price_jpy: number;
  condition: string;
  case_size: string;
  case_material: string;
  movement_type: string;
  strap_type: string;
  year_of_production: string;
  box_papers: boolean;
  mercari_url: string;
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
  status: string;
}

const shippingRates: Record<string, Record<string, { price: number; days: string }>> = {
  'USA': { 'EMS': { price: 2500, days: '3-5' }, 'Airmail': { price: 1800, days: '7-14' }, 'Surface': { price: 1200, days: '30-60' } },
  'UK': { 'EMS': { price: 2800, days: '3-7' }, 'Airmail': { price: 2000, days: '7-14' }, 'Surface': { price: 1400, days: '30-60' } },
  'Germany': { 'EMS': { price: 2800, days: '3-7' }, 'Airmail': { price: 2000, days: '7-14' }, 'Surface': { price: 1400, days: '30-60' } },
  'France': { 'EMS': { price: 2800, days: '3-7' }, 'Airmail': { price: 2000, days: '7-14' }, 'Surface': { price: 1400, days: '30-60' } },
  'Australia': { 'EMS': { price: 2200, days: '3-5' }, 'Airmail': { price: 1600, days: '7-14' }, 'Surface': { price: 1100, days: '30-60' } },
  'Canada': { 'EMS': { price: 2600, days: '4-7' }, 'Airmail': { price: 1900, days: '7-14' }, 'Surface': { price: 1300, days: '30-60' } },
  'Singapore': { 'EMS': { price: 2000, days: '2-4' }, 'Airmail': { price: 1500, days: '5-10' }, 'Surface': { price: 1000, days: '30-60' } },
  'Other': { 'EMS': { price: 3000, days: '5-10' }, 'Airmail': { price: 2200, days: '10-21' }, 'Surface': { price: 1500, days: '45-90' } },
};

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [country, setCountry] = useState('USA');
  const [shippingMethod, setShippingMethod] = useState('EMS');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://api.newjapandeals.com/api/products.php?slug=${params.slug}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#B50012] rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-[#B50012] hover:underline">← Back to Products</Link>
        </div>
      </div>
    );
  }

  // Get all images
  const images = [product.image_1, product.image_2, product.image_3, product.image_4, product.image_5].filter(Boolean);

  // Price calculations - convert string to number
  const basePrice = parseFloat(product.price_jpy) || 0;
  const handlingFee = Math.round(basePrice * 0.10);
  const shippingFee = shippingRates[country]?.[shippingMethod]?.price || 2500;
  const totalPrice = basePrice + handlingFee + shippingFee;
  const deliveryDays = shippingRates[country]?.[shippingMethod]?.days || '5-10';

  // Proxy comparison
  const proxyServiceFee = Math.round(basePrice * 0.08);
  const proxyPaymentFee = 500;
  const proxyPackingFee = 800;
  const proxyConsolidation = 1000;
  const proxyShipping = shippingFee + 500;
  const proxyTotal = basePrice + proxyServiceFee + proxyPaymentFee + proxyPackingFee + proxyConsolidation + proxyShipping;
  const savings = proxyTotal - totalPrice;
  const savingsPercent = Math.round((savings / proxyTotal) * 100);

  return (
    <main>
      <TrustBar />
      
      <div className="bg-[#F5F5F0] min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-[#B50012]">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-[#B50012]">Products</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800">{product.brand} {product.model}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Images */}
            <div>
              {/* Main Image */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                <div className="aspect-square relative">
                  {images[selectedImage] ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.title_en}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span className="text-6xl">⌚</span>
                    </div>
                  )}
                  {/* Condition Badge */}
                  <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm">
                    {product.condition}
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-[#B50012]' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Purchase */}
            <div className="space-y-6">
              {/* Title & Brand */}
              <div>
                <div className="text-[#B50012] font-medium mb-1">{product.brand}</div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {product.title_en || `${product.brand} ${product.model}`}
                </h1>
                {product.title_jp && (
                  <p className="text-gray-500 mt-1">{product.title_jp}</p>
                )}
                <div className="text-sm text-gray-400 mt-2">SKU: {product.sku}</div>
              </div>

              {/* Proxy-Free Pricing Badge */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                  <span>🎯</span> PROXY-FREE PRICING
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Via Proxy</div>
                    <div className="text-red-500 line-through font-medium">~¥{proxyTotal.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Via Us</div>
                    <div className="text-green-600 font-bold">¥{totalPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">You Save</div>
                    <div className="text-green-600 font-bold">¥{savings.toLocaleString()} ({savingsPercent}%)</div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Price Breakdown</h3>
                
                {/* Country & Shipping Selection */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Ship to</label>
                    <select 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {Object.keys(shippingRates).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Shipping</label>
                    <select 
                      value={shippingMethod} 
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {Object.keys(shippingRates[country] || {}).map(method => (
                        <option key={method} value={method}>
                          {method} ({shippingRates[country][method].days} days)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item Price</span>
                    <span>¥{basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Handling (10%)</span>
                    <span>¥{handlingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping ({shippingMethod})</span>
                    <span>¥{shippingFee.toLocaleString()}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#B50012]">¥{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-right text-gray-500 text-sm">
                    ~${Math.round(totalPrice / 150).toLocaleString()} USD
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                  <span>📦</span> Estimated delivery: {deliveryDays} business days
                </div>
              </div>

              {/* Dual Purchase Buttons */}
              <div className="space-y-3">
                {/* International Checkout - Primary */}
                <button className="w-full bg-[#B50012] hover:bg-[#9A0010] text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3">
                  <span className="text-2xl">🌍</span>
                  <div className="text-left">
                    <div>International Checkout</div>
                    <div className="text-sm font-normal opacity-80">Ships worldwide from Japan</div>
                  </div>
                </button>

                {/* Mercari Japan Button */}
                {product.mercari_url ? (
                  <a 
                    href={product.mercari_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white hover:bg-gray-50 text-gray-800 py-4 rounded-xl font-bold text-lg transition-all border-2 border-gray-200 flex items-center justify-center gap-3"
                  >
                    <span className="text-2xl">🇯🇵</span>
                    <div className="text-left">
                      <div>Buy on Mercari Japan</div>
                      <div className="text-sm font-normal text-gray-500">For Japan residents only</div>
                    </div>
                  </a>
                ) : (
                  <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold text-lg text-center border-2 border-gray-200">
                    <span className="text-2xl">🇯🇵</span> Mercari link coming soon
                  </div>
                )}
              </div>

              {/* Trust Points */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">✓</span> Zero proxy fees
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">✓</span> Single payment
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">✓</span> Expert packing
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">✓</span> Secure checkout
                </div>
              </div>
            </div>
          </div>

          {/* Product Details & Description */}
          <div className="grid lg:grid-cols-3 gap-8 mt-12">
            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Specifications</h3>
              <dl className="space-y-3 text-sm">
                {product.brand && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Brand</dt>
                    <dd className="font-medium">{product.brand}</dd>
                  </div>
                )}
                {product.model && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Model</dt>
                    <dd className="font-medium">{product.model}</dd>
                  </div>
                )}
                {product.reference_number && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Reference</dt>
                    <dd className="font-medium">{product.reference_number}</dd>
                  </div>
                )}
                {product.case_size && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Case Size</dt>
                    <dd className="font-medium">{product.case_size}</dd>
                  </div>
                )}
                {product.case_material && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Case Material</dt>
                    <dd className="font-medium">{product.case_material}</dd>
                  </div>
                )}
                {product.movement_type && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Movement</dt>
                    <dd className="font-medium">{product.movement_type}</dd>
                  </div>
                )}
                {product.strap_type && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Strap</dt>
                    <dd className="font-medium">{product.strap_type}</dd>
                  </div>
                )}
                {product.year_of_production && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Year</dt>
                    <dd className="font-medium">{product.year_of_production}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Box & Papers</dt>
                  <dd className="font-medium">{product.box_papers ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </div>

            {/* Description */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Description</h3>
              {product.description_en ? (
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                  {product.description_en}
                </div>
              ) : (
                <p className="text-gray-400">No description available.</p>
              )}
              
              {product.description_jp && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-500 mb-2">日本語説明</h4>
                  <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                    {product.description_jp}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
