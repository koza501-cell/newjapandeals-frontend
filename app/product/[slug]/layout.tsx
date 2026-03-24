import type { Metadata } from 'next';

const API_URL = 'https://api.newjapandeals.com';

const JUNK_KEYWORDS = [
  'junk', 'as-is', 'parts-repair', 'parts-only',
  'battery-dead', 'battery-expired', 'for-repair',
];

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

  try {
    const res = await fetch(`${API_URL}/api/products.php?slug=${slug}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const product = data.products?.[0] || data.data?.[0];

    if (product) {
      const name = product.title_en || product.title || `${product.brand} ${product.model}`;
      const desc = product.description_en || product.description ||
        `Buy ${name} direct from Japan. Zero proxy fees, expert packaging.`;
      return {
        title: `${name} | New Japan Deals`,
        description: desc,
        alternates: { canonical },
        openGraph: {
          title: `${name} | New Japan Deals`,
          description: desc,
          ...(product.images?.[0] && { images: [{ url: product.images[0] }] }),
        },
      };
    }
  } catch {
    // fall through
  }

  return {
    title: 'Product | New Japan Deals',
    alternates: { canonical },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
