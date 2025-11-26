import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProductImages, formatPrice, Product } from '@/lib/api';

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await getProductBySlug(params.slug);
    const product = res.data;

    if (!product) {
      return { title: 'Product Not Found' };
    }

    const title = product.meta_title || `${product.title_en} | New Japan Deals`;
    const description = product.meta_description || 
      `Buy ${product.title_en} from Japan. ${product.brand || ''} ${product.model || ''} ${product.condition}. Ships worldwide. ${formatPrice(product.price_jpy)} JPY.`;

    return {
      title,
      description,
      keywords: [
        product.brand,
        product.model,
        'Japanese watch',
        'buy from Japan',
        product.condition,
        product.title_en,
      ].filter(Boolean).join(', '),
      openGraph: {
        title,
        description,
        url: `https://newjapandeals.com/product/${product.slug}`,
        siteName: 'New Japan Deals',
        images: product.image_1 ? [
          {
            url: product.image_1,
            width: 800,
            height: 800,
            alt: product.title_en,
          },
        ] : [],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.image_1 ? [product.image_1] : [],
      },
      alternates: {
        canonical: `https://newjapandeals.com/product/${product.slug}`,
      },
    };
  } catch {
    return { title: 'Product Not Found' };
  }
}

// Product page component
export default async function ProductPage({ params }: Props) {
  let product: Product;
  
  try {
    const res = await getProductBySlug(params.slug);
    if (!res.data) notFound();
    product = res.data;
  } catch {
    notFound();
  }

  const images = getProductImages(product);
  
  // JSON-LD Product Schema (CRITICAL for SEO rich snippets)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title_en,
    description: product.description_en || product.title_en,
    image: images,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Japanese Watch',
    },
    model: product.model,
    itemCondition: product.condition === 'Brand New' 
      ? 'https://schema.org/NewCondition' 
      : 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: `https://newjapandeals.com/product/${product.slug}`,
      priceCurrency: 'JPY',
      price: product.price_jpy,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'New Japan Deals',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'Worldwide',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 5,
            maxValue: 14,
            unitCode: 'DAY',
          },
        },
      },
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://newjapandeals.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://newjapandeals.com/products',
      },
      ...(product.brand ? [{
        '@type': 'ListItem',
        position: 3,
        name: product.brand,
        item: `https://newjapandeals.com/brand/${product.brand.toLowerCase()}`,
      }] : []),
      {
        '@type': 'ListItem',
        position: product.brand ? 4 : 3,
        name: product.title_en,
        item: `https://newjapandeals.com/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container-custom py-8">
        {/* Breadcrumbs (SEO + UX) */}
        <nav className="breadcrumb mb-6" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Products</Link>
          {product.brand && (
            <>
              <span>/</span>
              <Link href={`/brand/${product.brand.toLowerCase()}`}>{product.brand}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.title_en}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {images[0] ? (
                <Image
                  src={images[0]}
                  alt={`${product.title_en} - Main Image`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((img, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={img}
                      alt={`${product.title_en} - Image ${index + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Brand */}
            {product.brand && (
              <Link 
                href={`/brand/${product.brand.toLowerCase()}`}
                className="text-primary font-medium hover:underline"
              >
                {product.brand}
              </Link>
            )}

            {/* Title (H1 for SEO) */}
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
              {product.title_en}
            </h1>

            {/* Japanese Title */}
            {product.title_jp && (
              <p className="text-lg text-gray-600 font-japanese mb-4">{product.title_jp}</p>
            )}

            {/* SKU & Condition */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-gray-100 px-3 py-1 rounded text-sm">SKU: {product.sku}</span>
              <span className="bg-gray-100 px-3 py-1 rounded text-sm">Condition: {product.condition}</span>
            </div>

            {/* Price */}
            <div className="bg-cream p-6 rounded-lg mb-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatPrice(product.price_jpy, 'JPY')}
              </div>
              <div className="text-gray-600 space-x-4">
                <span>≈ {formatPrice(product.price_usd, 'USD')}</span>
                <span>≈ {formatPrice(product.price_eur, 'EUR')}</span>
                <span>≈ {formatPrice(product.price_gbp, 'GBP')}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                *Prices in USD/EUR/GBP are approximate
              </p>
            </div>

            {/* Buy Button */}
            <Link
              href={`/checkout?product=${product.id}`}
              className="btn-primary w-full text-center rounded-lg text-lg block mb-4"
            >
              Buy Now
            </Link>

            {/* Product Details */}
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                {product.brand && (
                  <>
                    <dt className="text-gray-500">Brand</dt>
                    <dd className="font-medium">{product.brand}</dd>
                  </>
                )}
                {product.model && (
                  <>
                    <dt className="text-gray-500">Model</dt>
                    <dd className="font-medium">{product.model}</dd>
                  </>
                )}
                {product.reference_number && (
                  <>
                    <dt className="text-gray-500">Reference</dt>
                    <dd className="font-medium">{product.reference_number}</dd>
                  </>
                )}
                <dt className="text-gray-500">Condition</dt>
                <dd className="font-medium">{product.condition}</dd>
                <dt className="text-gray-500">Weight</dt>
                <dd className="font-medium">{product.weight_g}g (approx.)</dd>
              </dl>
            </div>

            {/* Description */}
            {product.description_en && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <div className="prose text-gray-700 whitespace-pre-line">
                  {product.description_en}
                </div>
              </div>
            )}

            {/* Japanese Description */}
            {product.description_jp && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">商品説明</h2>
                <div className="prose text-gray-700 font-japanese whitespace-pre-line">
                  {product.description_jp}
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Shipping</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  Ships from Japan within 1-3 business days
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  Worldwide shipping with tracking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  Free shipping on orders over ¥50,000
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  Delivery: 5-14 business days (varies by location)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
