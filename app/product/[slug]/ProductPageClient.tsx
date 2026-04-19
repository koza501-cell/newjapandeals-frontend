'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { sanitizeText } from '@/lib/sanitize';

const API_URL = 'https://api.newjapandeals.com';

interface Product {
  id: number; sku: string; slug: string; title: string; title_en: string;
  title_jp: string; description: string; description_en: string; description_jp: string;
  brand: string; model: string; reference_number: string; condition: string;
  case_size: string; case_material: string; movement_type: string; strap_type: string;
  year_of_production: string; box_papers: boolean; price_jpy: number; price_usd: number;
  weight_g: number; mercari_url: string; image?: string; images?: string[];
  status: string; shipping_category_id: number | null;
}

const FAQ_ITEMS = [
  { q: 'Does this ship to my country?', a: 'Yes, we ship worldwide via SpeedPAK/EMS.' },
  { q: 'How long does shipping take?', a: '7-30 days depending on destination.' },
  { q: 'Can I return this?', a: 'Yes, 14-day returns accepted.' },
  { q: 'Is this authentic?', a: 'Yes, we are a licensed Kobutsusho dealer in Japan.' },
  { q: 'Are there proxy or middleman fees?', a: 'No. We source directly so you pay zero proxy fees.' },
];

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(i => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) };

export default function ProductPageClient() {
  const params = useParams();
  const router = useRouter();
  const { items, addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let cancelled = false;
    fetch(`${API_URL}/api/products.php?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled && data.success && (data.products?.length > 0 || data.data?.length > 0)) {
          setProduct(data.products?.[0] || data.data?.[0]);
        }
      })
      .catch(err => console.error('Fetch error:', err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!addedToCart) return;
    const timer = setTimeout(() => setAddedToCart(false), 3000);
    return () => clearTimeout(timer);
  }, [addedToCart]);

  useEffect(() => {
    if (!product) return;
    fetch(`${API_URL}/api/products.php?brand=${encodeURIComponent(product.brand)}`)
      .then(res => res.json())
      .then(data => {
        const all: Product[] = data.products || data.data || [];
        setRelatedProducts(all.filter(p => p.slug !== product.slug).slice(0, 4));
      }).catch(() => {});
  }, [product]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-4">Loading...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <Link href="/products" className="text-red-600 hover:underline">← Back to Products</Link>
      </div>
    </div>
  );

  const images = product.images || [];
  const basePrice = Number(product.price_jpy) || 0;
  const handlingFee = Math.round(basePrice * 0.10);
  const shippingEstimate = 2500;
  const totalPrice = basePrice + handlingFee + shippingEstimate;
  const currentImage = images[selectedImage] || product.image || null;
  const isInCart = items.some(item => item.id === product.id);
  const ref = product.reference_number || '';
  const imgAltBase = `${product.brand} ${product.model}${ref ? ' ' + ref : ''}`;
  const primaryAlt = `${imgAltBase} — New Japan Deals`;
  const viewAlt = (n: number) => `${imgAltBase} — view ${n} — New Japan Deals`;

  const handleAddToCart = () => {
    if (!addToCart) return;
    addToCart({
      id: product.id, slug: product.slug,
      title: sanitizeText(product.title_en || product.title || `${product.brand} ${product.model}`),
      brand: product.brand, model: product.model, price_jpy: basePrice,
      image: product.image || images[0] || '', condition: product.condition || '',
      shipping_category_id: product.shipping_category_id,
    });
    setAddedToCart(true);
  };

  const handleBuyNow = () => { if (!isInCart) handleAddToCart(); router.push('/cart'); };

  const specs = [
    { label: 'Brand', value: product.brand }, { label: 'Model', value: product.model },
    { label: 'Reference Number', value: product.reference_number }, { label: 'Condition', value: product.condition },
    { label: 'Case Size', value: product.case_size }, { label: 'Case Material', value: product.case_material },
    { label: 'Movement', value: product.movement_type }, { label: 'Strap', value: product.strap_type },
    { label: 'Year', value: product.year_of_production }, { label: 'Box & Papers', value: product.box_papers ? 'Yes' : 'No' },
  ].filter(spec => spec.value && spec.value !== 'No');
  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-red-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-gray-500 hover:text-red-600">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/brand/${product.brand.toLowerCase()}`} className="text-gray-500 hover:text-red-600">{product.brand}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800" aria-current="page">{product.brand} {product.model}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
              <div className="aspect-square relative">
                {currentImage ? (
                  <img src={currentImage} alt={primaryAlt} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-6xl text-gray-300">⌚</div>
                )}
                {product.condition && (
                  <span className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm">{product.condition}</span>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-red-600' : 'border-transparent'}`}>
                    <img src={img} alt={viewAlt(idx + 1)} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-red-600 font-medium mb-1">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {sanitizeText(product.title_en || product.title || `${product.brand} ${product.model}`)}
              </h1>
              {product.title_jp && <p className="text-gray-500 mt-1">{sanitizeText(product.title_jp)}</p>}
              <p className="text-sm text-gray-400 mt-2">SKU: {product.sku}</p>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-bold text-lg mb-4">Price Breakdown</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Item Price</span><span>¥{basePrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Handling (10%)</span><span>¥{handlingFee.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping (estimate)</span><span>¥{shippingEstimate.toLocaleString()}</span></div>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span><span className="text-red-600">¥{totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-right text-gray-500 text-sm">~${Math.round(totalPrice / 150)} USD</p>
              <p className="text-xs text-gray-400 mt-4">* Final shipping calculated at checkout based on destination</p>
            </div>

            {addedToCart && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                <span className="text-green-700">✓ Added to cart!</span>
                <Link href="/cart" className="text-green-700 font-medium hover:underline">View Cart →</Link>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              {isInCart ? (
                <Link href="/cart" className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">✓ In Your Cart - View Cart</Link>
              ) : (
                <button onClick={handleAddToCart} className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg">🛒 Add to Cart</button>
              )}
              <button onClick={handleBuyNow} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg">🌍 Buy Now - Ships Worldwide</button>
              {product.mercari_url ? (
                <a href={product.mercari_url} target="_blank" rel="noopener noreferrer" className="w-full bg-white border-2 border-gray-200 text-gray-800 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-50">🇯🇵 Buy on Mercari Japan</a>
              ) : (
                <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold text-lg text-center border-2 border-gray-200">🇯🇵 Mercari link coming soon</div>
              )}
              <p className="text-center text-xs text-gray-400 pt-1">Licensed Dealer: 第441200001622号</p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Zero proxy fees</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Free inspection</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Secure shipping</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Buyer protection</div>
            </div>
          </div>
        </div>
        {/* Description */}
        {product.description_en && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h2 className="font-bold text-xl mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{sanitizeText(product.description_en)}</p>
          </div>
        )}

        {product.description_jp && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="font-bold text-xl mb-4">日本語説明 (Japanese Description)</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{sanitizeText(product.description_jp)}</p>
          </div>
        )}

        {specs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="font-bold text-xl mb-4">Specifications</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{spec.label}</span>
                  <span className="font-medium text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why Buy From Us */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mt-6">
          <h2 className="font-bold text-xl mb-4">Why Buy From New Japan Deals?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center"><div className="text-3xl mb-2">💰</div><h3 className="font-bold mb-1">Save 20-40%</h3><p className="text-sm text-gray-600">vs proxy services</p></div>
            <div className="text-center"><div className="text-3xl mb-2">🔍</div><h3 className="font-bold mb-1">Free Inspection</h3><p className="text-sm text-gray-600">Quality checked before shipping</p></div>
            <div className="text-center"><div className="text-3xl mb-2">📦</div><h3 className="font-bold mb-1">Ships in 48h</h3><p className="text-sm text-gray-600">Fast international delivery</p></div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold text-xl mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(rp => {
                const rpImage = rp.images?.[0] || rp.image || null;
                const rpPrice = Number(rp.price_jpy) || 0;
                return (
                  <Link key={rp.slug} href={`/product/${rp.slug}`} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden group">
                    <div className="aspect-square bg-gray-100">
                      {rpImage ? (
                        <img src={rpImage}
                          alt={`${rp.brand} ${rp.model}${rp.reference_number ? ' ' + rp.reference_number : ''} — New Japan Deals`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">⌚</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-red-600 font-medium">{rp.brand}</p>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2">{rp.model}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">¥{rpPrice.toLocaleString()}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="font-bold text-xl mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}