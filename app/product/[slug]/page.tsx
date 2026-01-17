'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TrustBar from '@/components/TrustBar';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { useCart } from '@/context/CartContext';

const API_URL = 'https://api.newjapandeals.com';

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
  image?: string;
  images?: string[];
  status: string;
  shipping_category_id: number | null;
}

export default function ProductPage() {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const params = useParams();
  const router = useRouter();
  const cart = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  // Get cart functions safely (but don't call hooks here)
  const items = cart?.items || [];
  const addToCart = cart?.addToCart;

  // Fetch product effect
  useEffect(() => {
    async function fetchProduct() {
      if (!params.slug) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/products.php?slug=${params.slug}`, {
          cache: 'no-store'
        });
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          setProduct(data.products[0]);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug]);

  // Added to cart notification effect
  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => setAddedToCart(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  // Document title effect
  useEffect(() => {
    if (product) {
      document.title = `${product.title_en || `${product.brand} ${product.model}`} | New Japan Deals`;
    }
  }, [product]);

  // Helper function (not a hook)
  const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  // Check if in cart (computed value, not a hook)
  const isInCart = product ? items.some(item => item.id === product.id) : false;

  // Event handlers (not hooks)
  const handleAddToCart = () => {
    if (!product || !addToCart) return;
    
    const basePrice = parseFloat(String(product.price_jpy)) || 0;
    
    addToCart({
      id: product.id,
      slug: product.slug,
      title: product.title_en || `${product.brand} ${product.model}`,
      brand: product.brand,
      model: product.model,
      price_jpy: basePrice,
      image: product.image || product.images?.[0] || '',
      condition: product.condition,
      shipping_category_id: product.shipping_category_id,
    });
    
    setAddedToCart(true);
  };

  const handleBuyNow = () => {
    if (!product || !addToCart) return;
    
    const basePrice = parseFloat(String(product.price_jpy)) || 0;
    
    if (!isInCart) {
      addToCart({
        id: product.id,
        slug: product.slug,
        title: product.title_en || `${product.brand} ${product.model}`,
        brand: product.brand,
        model: product.model,
        price_jpy: basePrice,
        image: product.image || product.images?.[0] || '',
        condition: product.condition,
        shipping_category_id: product.shipping_category_id,
      });
    }
    
    router.push('/cart');
  };

  // CONDITIONAL RETURNS GO HERE - AFTER ALL HOOKS
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

  // Computed values for render
  const images: string[] = product.images || [];
  const basePrice = parseFloat(String(product.price_jpy)) || 0;
  const handlingFee = Math.round(basePrice * 0.10);
  const shippingFee = 2500;
  const totalPrice = basePrice + handlingFee + shippingFee;
  const currentImageUrl = images.length > 0 ? getImageUrl(images[selectedImage]) : null;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title_en || `${product.brand} ${product.model}`,
    "description": product.description_en || `Authentic ${product.brand} ${product.model} watch from Japan`,
    "image": currentImageUrl || "https://newjapandeals.com/og-image.png",
    "sku": product.sku,
    "brand": { "@type": "Brand", "name": product.brand },
    "offers": {
      "@type": "Offer",
      "url": `https://newjapandeals.com/product/${product.slug}`,
      "priceCurrency": "JPY",
      "price": basePrice,
      "availability": product.status === 'sold' ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "47"
    }
  };

  return (
    <main>
      <TrustBar />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://newjapandeals.com' },
          { name: 'Products', url: 'https://newjapandeals.com/products' },
          { name: product.title_en || `${product.brand} ${product.model}`, url: `https://newjapandeals.com/product/${product.slug}` }
        ]} 
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <div className="bg-[#F5F5F0] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <nav className="text-sm mb-6">
            <ol className="flex items-center">
              <li><Link href="/" className="text-gray-500 hover:text-[#B50012]">Home</Link></li>
              <li className="mx-2 text-gray-400">/</li>
              <li><Link href="/products" className="text-gray-500 hover:text-[#B50012]">Products</Link></li>
              <li className="mx-2 text-gray-400">/</li>
              <li><span className="text-gray-800">{product.brand} {product.model}</span></li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                <div className="aspect-square relative">
                  {currentImageUrl ? (
                    <img src={currentImageUrl} alt={product.title_en || `${product.brand} ${product.model}`} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span className="text-6xl">⌚</span>
                    </div>
                  )}
                  {product.condition && (
                    <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm">
                      {product.condition}
                    </div>
                  )}
                </div>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => {
                    const thumbUrl = getImageUrl(img);
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-[#B50012]' : 'border-transparent'}`}
                      >
                        {thumbUrl && <img src={thumbUrl} alt="" className="w-full h-full object-cover" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-[#B50012] font-medium mb-1">{product.brand}</div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {product.title_en || `${product.brand} ${product.model}`}
                </h1>
                {product.title_jp && <p className="text-gray-500 mt-1">{product.title_jp}</p>}
                <div className="text-sm text-gray-400 mt-2">SKU: {product.sku}</div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center">
                    {[1,2,3,4,5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.9 (47 reviews)</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="font-bold text-lg mb-4">Price Breakdown</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Item Price</span><span>¥{basePrice.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Handling (10%)</span><span>¥{handlingFee.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Shipping (estimate)</span><span>¥{shippingFee.toLocaleString()}</span></div>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span><span className="text-[#B50012]">¥{totalPrice.toLocaleString()}</span>
                </div>
                <div className="text-right text-gray-500 text-sm">~${Math.round(totalPrice / 150).toLocaleString()} USD</div>
                <p className="text-xs text-gray-400 mt-4">* Final shipping calculated at checkout</p>
              </div>

              {addedToCart && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-700"><span>✓</span> Added to cart!</div>
                  <Link href="/cart" className="text-green-700 font-medium hover:underline">View Cart →</Link>
                </div>
              )}

              <div className="space-y-3">
                {isInCart ? (
                  <Link href="/cart" className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3">
                    <span className="text-2xl">✓</span>
                    <div className="text-left"><div>In Your Cart</div><div className="text-sm font-normal opacity-80">Click to view cart</div></div>
                  </Link>
                ) : (
                  <button onClick={handleAddToCart} className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 hover:scale-[1.02]">
                    <span className="text-2xl">🛒</span>
                    <div className="text-left"><div>Add to Cart</div><div className="text-sm font-normal opacity-80">Continue shopping</div></div>
                  </button>
                )}
                <button onClick={handleBuyNow} className="w-full bg-[#B50012] hover:bg-[#9A0010] text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3">
                  <span className="text-2xl">🌍</span>
                  <div className="text-left"><div>Buy Now</div><div className="text-sm font-normal opacity-80">Ships worldwide from Japan</div></div>
                </button>
                {product.mercari_url ? (
                  <a href={product.mercari_url} target="_blank" rel="noopener noreferrer" className="w-full bg-white hover:bg-gray-50 text-gray-800 py-4 rounded-xl font-bold text-lg transition-all border-2 border-gray-200 flex items-center justify-center gap-3">
                    <span className="text-2xl">🇯🇵</span>
                    <div className="text-left"><div>Buy on Mercari Japan</div><div className="text-sm font-normal text-gray-500">For Japan residents only</div></div>
                  </a>
                ) : (
                  <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold text-lg text-center border-2 border-gray-200">
                    <span className="text-2xl">🇯🇵</span> Mercari link coming soon
                  </div>
                )}
              </div>

              <ul className="grid grid-cols-2 gap-3 text-sm">
                <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> Zero proxy fees</li>
                <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> Free inspection</li>
                <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> Secure shipping</li>
                <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> Buyer protection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
