import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import SavingsCalculator from '@/components/SavingsCalculator';
import WhyNotProxy from '@/components/WhyNotProxy';
import FeaturedProducts from '@/components/FeaturedProducts';
import PromoBanner from '@/components/PromoBanner';

export default function Home() {
  return (
    <main>
      {/* Promotional Banner (if active) */}
      <PromoBanner />
      
      {/* Trust Bar */}
      <TrustBar />
      
      {/* Hero Section */}
      <Hero />
      
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
            Join hundreds of collectors who've already discovered the smarter way to buy Japanese watches.
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
