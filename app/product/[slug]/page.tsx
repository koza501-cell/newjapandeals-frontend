import type { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';

const API_URL = 'https://api.newjapandeals.com';

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/api/products.php?slug=${params.slug}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const product = data.products?.[0] || data.data?.[0];
    if (!product) return {};

    const brand = product.brand || '';
    const model = product.model || '';
    const ref = product.reference_number ? ` ${product.reference_number}` : '';
    const movement = product.movement_type || 'mechanical';
    const rawDesc = `${brand} ${model} - ${movement} watch. Authentic from Japan, no proxy fees, ships worldwide.`;
    const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + '...' : rawDesc;
    const ogImage =
      product.image_1 ||
      product.image ||
      (Array.isArray(product.images) && product.images[0]) ||
      'https://www.newjapandeals.com/og-image.png';

    return {
      title: `${brand} ${model}${ref} | New Japan Deals`,
      description,
      openGraph: {
        title: `${brand} ${model}${ref} | New Japan Deals`,
        description,
        type: 'website',
        images: [{ url: ogImage, alt: `${brand} ${model}${ref}` }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${brand} ${model}${ref} | New Japan Deals`,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {};
  }
}

export default function ProductPage() {
  return <ProductPageClient />;
}