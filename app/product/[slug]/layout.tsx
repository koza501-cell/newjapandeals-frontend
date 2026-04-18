import type { Metadata } from 'next';

const API_URL = 'https://api.newjapandeals.com';

const JUNK_KEYWORDS = [
  'junk', 'as-is', 'parts-repair', 'parts-only',
  'battery-dead', 'battery-expired', 'for-repair',
];

async function getProduct(slug: string) {
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
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = params;
  const canonical = `https://www.newjapandeals.com/product/${slug}`;
  const isJunk = JUNK_KEYWORDS.some(kw => slug.includes(kw));

  if (isJunk) {
    return {
      title: 'As-Is Item | New Japan Deals',
      alternates: { canonical },
      robots: { index: false, follow: false },
    };
  }

  const product = await getProduct(slug);

  if (product) {
    const name = product.title_en || product.title || `${product.brand} ${product.model}`;
    const price = Number(product.price_jpy) || 0;
    const handlingFee = Math.round(price * 0.10);
    const totalPrice = price + handlingFee + 2500;
    const priceUSD = Math.round(totalPrice / 150);
    const desc = product.description_en || product.description ||
      `Buy ${name} direct from Japan. ¥${price.toLocaleString()} (~$${priceUSD} USD). Zero proxy fees, expert packaging, worldwide shipping.`;
    const ogImage = product.images?.[0] || product.image || '/og-image.png';

    return {
      title: `${name} | New Japan Deals`,
      description: desc.slice(0, 160),
      alternates: { canonical },
      openGraph: {
        title: `${name} | New Japan Deals`,
        description: desc.slice(0, 160),
        url: canonical,
        siteName: 'New Japan Deals',
        images: [{ url: ogImage, width: 800, height: 800, alt: name }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} | New Japan Deals`,
        description: desc.slice(0, 160),
        images: [ogImage],
      },
    };
  }

  return {
    title: 'Product | New Japan Deals',
    alternates: { canonical },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;
  const isJunk = JUNK_KEYWORDS.some(kw => slug.includes(kw));

  if (isJunk) return <>{children}</>;

  const product = await getProduct(slug);

  if (!product) return <>{children}</>;

  const name = product.title_en || product.title || `${product.brand} ${product.model}`;
  const price = Number(product.price_jpy) || 0;
  const handlingFee = Math.round(price * 0.10);
  const totalPrice = price + handlingFee + 2500;
  const images = product.images || (product.image ? [product.image] : []);

  const conditionRaw = (product.condition || '').toLowerCase();
  const itemCondition = conditionRaw.includes('new')
    ? 'https://schema.org/NewCondition'
    : 'https://schema.org/UsedCondition';

  const availability = product.status === 'sold'
    ? 'https://schema.org/SoldOut'
    : 'https://schema.org/InStock';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: product.description_en || product.description ||
      `${name} — authentic Japanese watch sourced directly from Japan by a licensed dealer.`,
    sku: product.sku || slug,
    brand: { '@type': 'Brand', name: product.brand },
    image: images,
    offers: {
      '@type': 'Offer',
      url: `https://www.newjapandeals.com/product/${slug}`,
      priceCurrency: 'JPY',
      price: totalPrice,
      availability,
      itemCondition,
      seller: { '@type': 'Organization', name: 'New Japan Deals' },
    },
    ...(product.model && { model: product.model }),
    ...(product.reference_number && { productID: product.reference_number }),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.newjapandeals.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.newjapandeals.com/products' },
      { '@type': 'ListItem', position: 3, name, item: `https://www.newjapandeals.com/product/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
