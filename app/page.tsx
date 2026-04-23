import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import LiveTrustBar from '@/components/LiveTrustBar';
import FeaturedWatchesSection from '@/components/FeaturedWatchesSection';
import NewArrivalsSection from '@/components/NewArrivalsSection';
import SavingsCalculator from '@/components/SavingsCalculator';
import WhyNotProxy from '@/components/WhyNotProxy';
import FeaturedProducts from '@/components/FeaturedProducts';
import PromoBanner from '@/components/PromoBanner';
import RecentlySoldSection from '@/components/RecentlySoldSection';
import type { TrustStats } from '@/app/api/trust-stats/route';

// ISR: regenerate the homepage shell at most every 5 minutes.
// Above-the-fold content (Hero, TrustBar) is static; client components
// (FeaturedProducts, SavingsCalculator, LiveTrustBar) stream in after hydration.
export const revalidate = 300;

/** Server-side prefetch of trust stats so LiveTrustBar has data on first paint. */
async function fetchTrustStats(): Promise<TrustStats | undefined> {
  // NEXT_PUBLIC_SITE_URL should be set in Vercel (e.g. https://www.newjapandeals.com).
  // VERCEL_URL is auto-set for all Vercel deployments (including previews).
  // In local dev neither is set → skip prefetch; client SWR handles it.
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (!siteUrl) return undefined;

  try {
    const res = await fetch(`${siteUrl}/api/trust-stats`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return undefined;
    return res.json();
  } catch {
    return undefined;
  }
}

export default async function Home() {
  const trustStats = await fetchTrustStats();

  return (
    <main>
      {/* Promotional Banner (if active) */}
      <PromoBanner />

      {/* Compact trust ribbon — sticky top strip */}
      <TrustBar />

      {/* Hero Section */}
      <Hero />

      {/* Live Trust Statistics Bar */}
      <LiveTrustBar fallbackData={trustStats} />

      {/* Featured Watches — DB-driven (featured=1 in products table) */}
      <FeaturedWatchesSection />

      {/* New Arrivals — automatic, 8 most recent non-featured products */}
      <NewArrivalsSection />

      {/* Recently Sold — social proof */}
      <RecentlySoldSection />

      {/* Savings Calculator */}
      <SavingsCalculator />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Why Not Proxy Section */}
      <WhyNotProxy />

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-r from-[#B50012] to-[#8B0000] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Save on Your Next Watch?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of collectors who&apos;ve already discovered the smarter way to buy Japanese watches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#B50012] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Browse Watches
            </a>
            <a
              href="/why-us"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
