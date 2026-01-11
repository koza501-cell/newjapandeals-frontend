'use client';

import Link from 'next/link';
import TrustBar from '@/components/TrustBar';

export default function AboutPage() {
  return (
    <main>
      <TrustBar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Story
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From a childhood passion to connecting watch lovers worldwide with Japan's hidden treasures — we're here to change how you buy authentic Japanese watches
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                Where It All Began
              </h2>
              
              <div className="bg-[#F5F5F0] p-8 rounded-xl mb-8">
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "It started with a simple gift — my father's old watch. He was buying himself a new one, and rather than letting his faithful timepiece collect dust in a drawer, he placed it in my hands. I was just a boy, but in that moment, holding something that had marked countless moments of his life, I felt a connection I couldn't explain."
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                That watch became the first piece of what would grow into a personal collection starting in 2008. Each watch I acquired wasn't just a device for telling time — it was a story, a piece of history, a small mechanical marvel waiting to be appreciated. I spent countless hours learning about movements, studying different brands, and understanding what makes Japanese watchmaking so special.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                By 2014, my passion had evolved into something more. I began buying and selling watches on Japanese marketplaces like Mercari, Rakuma, and Yahoo Auctions Japan. What started as a way to fund my own collection quickly became a full-time pursuit. I discovered something remarkable about Japan's watch culture that changed everything.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Living in Japan gave me access to a world of watches that most international collectors could only dream of. Vintage Seiko divers, rare Citizen chronographs, limited-edition G-Shocks, and countless other timepieces that never made it outside Japan's borders. I realized I was sitting on a goldmine of horological treasures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Japan's Watch Culture */}
      <section className="py-16 bg-[#F5F5F0]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Japan: A Watch Lover's Paradise
            </h2>

            <p className="text-gray-700 leading-relaxed mb-8 text-lg text-center max-w-3xl mx-auto">
              Japan has one of the most vibrant secondhand watch markets in the world. The combination of meticulous care, dry climate, and a culture that values quality creates perfect conditions for watch preservation.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🇯🇵</div>
                <h3 className="font-bold text-xl mb-3">Unmatched Care</h3>
                <p className="text-gray-600">
                  Japanese owners treat their watches with exceptional care. Even "junk" watches here are often cleaner and better preserved than working watches elsewhere in the world. It's part of the culture — respect for objects and their longevity.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="font-bold text-xl mb-3">Hidden Treasures</h3>
                <p className="text-gray-600">
                  Japan is one of the world's largest markets for vintage, JDM (Japan Domestic Market), rare, and collectible timepieces — many never seen outside the country. Models released exclusively for the Japanese market are highly sought after by collectors worldwide.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="font-bold text-xl mb-3">The "Junk" Opportunity</h3>
                <p className="text-gray-600">
                  High repair costs in Japan mean many watches are sold as "junk" when they simply need a battery change or light service. What Japanese sellers consider not worth repairing often becomes a collector's dream find for international buyers.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">⌚</div>
                <h3 className="font-bold text-xl mb-3">Thousands of Watches</h3>
                <p className="text-gray-600">
                  After dealing with thousands of watches over the years, we've learned that most "non-working" Japanese watches spring back to life with minimal effort. A dead battery, dried lubricant, or stuck crown — simple fixes that unlock incredible value.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <p className="text-gray-700 leading-relaxed text-lg">
                To us, each watch isn't just a product — <strong>it's like a child</strong>. We handle every timepiece with the care and respect it deserves, understanding that behind every watch is a story waiting to continue with its new owner. Whether it's a vintage Seiko King Quartz from the 1970s or a modern Casio G-Shock limited edition, we treat each piece as if it were destined for our own collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Started NJD */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Why New Japan Deals?
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              For years, we sold primarily on Japanese domestic marketplaces. Most of our buyers were international collectors using proxy services like Buyee, ZenMarket, and FromJapan. We heard their stories — the frustrations, the hidden fees, the confusion of machine-translated descriptions that often missed critical details about watch condition.
            </p>

            <div className="bg-red-50 border-l-4 border-[#B50012] p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 leading-relaxed">
                <strong>The problem was clear:</strong> Proxy services add 20-40% in hidden fees including service charges, domestic shipping, payment processing, inspection fees, and international shipping markups. Machine translations lose critical details about watch condition. Buyers couldn't ask questions about specific scratches, movement accuracy, or negotiate bundle deals. There had to be a better way.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              <strong>New Japan Deals is that better way.</strong> We bridge the gap between Japan's incredible watch market and collectors worldwide. You get clear English descriptions written by someone who actually understands watches, transparent pricing with no hidden fees, direct communication with a real person who can answer your questions, and the peace of mind that comes from buying from a licensed, registered dealer in Japan.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8 text-lg">
              We understand that buying a watch online — especially from another country — requires trust. That's why we've built our business on transparency, honest descriptions, and genuine customer care. We're not a faceless corporation or an automated proxy system. We're watch enthusiasts who happen to live in the best place in the world for finding incredible timepieces.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Two Ways to Buy</h4>
                  <p className="text-gray-600 text-sm">Buy direct from Mercari/Rakuma if you can, or purchase through us with full English support. We give you options.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Real Descriptions</h4>
                  <p className="text-gray-600 text-sm">No machine translation. Natural English descriptions written by watch enthusiasts so you understand exactly what you're buying.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Direct Communication</h4>
                  <p className="text-gray-600 text-sm">Ask questions about specific details, request additional photos, negotiate discounts on bundles, arrange combined shipping — talk to a real person who cares.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w
