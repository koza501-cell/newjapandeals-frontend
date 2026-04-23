import type { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';

const API_URL  = 'https://api.newjapandeals.com';
const SITE_URL = 'https://www.newjapandeals.com';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getProduct(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/api/products.php?slug=${slug}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.products?.[0] || data.data?.[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};

  const brand    = product.brand || '';
  const model    = product.model || '';
  const ref      = product.reference_number ? ` ${product.reference_number}` : '';
  const movement = product.movement_type || 'mechanical';
  const condition = product.condition || '';
  const url      = `${SITE_URL}/product/${params.slug}`;

  const title    = `${brand} ${model}${ref} - ${movement} Watch | New Japan Deals`;
  const rawDesc  =
    `Shop ${brand} ${model}${ref} ${movement} watch. Authentic Japanese ${condition}. ` +
    'Ships worldwide from Japan. Licensed dealer since 2014.';
  const description = rawDesc.length > 155 ? rawDesc.slice(0, 152) + '...' : rawDesc;

  const ogImage =
    (Array.isArray(product.images) && product.images[0]) ||
    product.image_1 ||
    product.image ||
    `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type:   'website',
      url,
      images: [{ url: ogImage, alt: `${brand} ${model}${ref}` }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [ogImage],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  const productJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type':    'Product',
        name:       `${product.brand || ''} ${product.model || ''}${product.reference_number ? ' ' + product.reference_number : ''}`.trim(),
        description: ((product.description_en || product.description || '') as string).slice(0, 200),
        image: [
          ...(Array.isArray(product.images) ? product.images : []),
          product.image_1,
          product.image,
        ].filter(Boolean),
        brand:    { '@type': 'Brand', name: product.brand || '' },
        sku:      product.sku      || '',
        mpn:      product.reference_number || '',
        url:      `${SITE_URL}/product/${params.slug}`,
        category: 'Watches',
        countryOfOrigin: 'Japan',
        ...(product.case_material ? { material: product.case_material } : {}),
        additionalProperty: [
          product.movement_type      && { '@type': 'PropertyValue', name: 'Movement',   value: product.movement_type },
          product.case_size          && { '@type': 'PropertyValue', name: 'Case Size',  value: product.case_size },
          product.strap_type         && { '@type': 'PropertyValue', name: 'Band Type',  value: product.strap_type },
          product.year_of_production && { '@type': 'PropertyValue', name: 'Year',       value: product.year_of_production },
          product.reference_number   && { '@type': 'PropertyValue', name: 'Reference Number', value: product.reference_number },
        ].filter(Boolean),
        offers: {
          '@type':         'Offer',
          price:           product.price_usd || Math.round((Number(product.price_jpy) || 0) / 150),
          priceCurrency:   'USD',
          availability:    product.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          itemCondition:   'https://schema.org/UsedCondition',
          url:             `${SITE_URL}/product/${params.slug}`,
          seller: {
            '@type': 'Organization',
            name:    'New Japan Deals',
            url:     SITE_URL,
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: { '@type': 'QuantitativeValue', minValue: 1,  maxValue: 2,  unitCode: 'DAY' },
              transitTime:  { '@type': 'QuantitativeValue', minValue: 7,  maxValue: 30, unitCode: 'DAY' },
            },
          },
          hasMerchantReturnPolicy: {
            '@type':                  'MerchantReturnPolicy',
            applicableCountry:        'US',
            returnPolicyCategory:     'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays:       14,
            returnMethod:             'https://schema.org/ReturnByMail',
            returnFees:               'https://schema.org/ReturnFeesCustomerResponsibility',
          },
        },
      }
    : null;

  const breadcrumbJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type':    'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
          { '@type': 'ListItem', position: 3, name: product.brand, item: `${SITE_URL}/brand/${(product.brand || '').toLowerCase()}` },
          { '@type': 'ListItem', position: 4, name: `${product.brand} ${product.model}`, item: `${SITE_URL}/product/${params.slug}` },
        ],
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <ProductPageClient />
    </>
  );
}
