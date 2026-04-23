import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://www.newjapandeals.com';
const API_URL = 'https://api.newjapandeals.com';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Watch Categories | New Japan Deals',
  description:
    'Browse Japanese watches by movement type. Automatic, quartz, hand-wind, solar, digital, chronograph & more. Licensed dealer since 2014.',
  alternates: { canonical: `${SITE_URL}/watches` },
  openGraph: {
    title: 'Watch Categories | New Japan Deals',
    description: 'Browse Japanese watches by movement type. Licensed dealer since 2014.',
    url: `${SITE_URL}/watches`,
  },
};

const categories = [
  { slug: 'automatic', name: 'Automatic', icon: '⚙️', description: 'Self-winding mechanical watches powered by your wrist movement.' },
  { slug: 'quartz', name: 'Quartz', icon: '⚡', description: 'Battery-powered precision timepieces with reliable accuracy.' },
  { slug: 'hand-wind', name: 'Hand-Wind', icon: '🔧', description: 'Traditional manual-winding mechanical watches for purists.' },
  { slug: 'solar', name: 'Solar', icon: '☀️', description: 'Light-powered eco-friendly watches including Citizen Eco-Drive.' },
  { slug: 'digital', name: 'Digital', icon: '🖥️', description: 'Digital display watches including G-Shock and Casio classics.' },
  { slug: 'chronograph', name: 'Chronograph', icon: '⏱️', description: 'Stopwatch-equipped timepieces for timing and sport.' },
];

async function fetchCategoryCounts(): Promise<Record<string, number>> {
  try {
    const counts: Record<string, number> = {};
    await Promise.all(
      categories.map(async (cat) => {
        const param = ['digital', 'chronograph'].includes(cat.slug) ? 'features' : 'movement';
        const res = await fetch(
          `${API_URL}/api/products.php?${param}=${encodeURIComponent(cat.slug)}&limit=1`,
          { next: { revalidate: 300 } },
        );
        const data = await res.json();
        counts[cat.slug] = data.total || (data.products || data.data || []).length || 0;
      }),
    );
    return counts;
  } catch {
    return {};
  }
}

export default async function WatchesPage() {
  const counts = await fetchCategoryCounts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Watch Categories',
    description: 'Browse Japanese watches by movement type.',
    url: `${SITE_URL}/watches`,
    isPartOf: { '@type': 'WebSite', name: 'New Japan Deals', url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-red-600">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800">Watch Categories</span>
          </nav>

          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Watch Categories
          </h1>
          <p className="text-gray-500 mb-8">
            Browse our collection by movement type. All watches sourced directly from Japan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/watches/${cat.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors text-2xl">
                  {cat.icon}
                </div>
                <h2 className="font-semibold text-gray-900 text-xl mb-1">{cat.name} Watches</h2>
                <p className="text-sm text-gray-500 mb-3 flex-1">{cat.description}</p>
                {counts[cat.slug] !== undefined && (
                  <p className="text-sm text-red-600 font-medium">
                    {counts[cat.slug]} {counts[cat.slug] === 1 ? 'watch' : 'watches'} available
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
