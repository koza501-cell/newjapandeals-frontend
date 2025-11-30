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
            From a childhood passion to connecting watch lovers worldwide with Japan's hidden treasures
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
                That watch became the first piece of what would grow into a personal collection starting in 2008. Each watch I acquired wasn't just a device for telling time — it was a story, a piece of history, a small mechanical marvel waiting to be appreciated.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                By 2014, my passion had evolved into something more. I began buying and selling watches on Japanese marketplaces, and I quickly discovered something remarkable about Japan's watch culture.
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
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🇯🇵</div>
                <h3 className="font-bold text-xl mb-3">Unmatched Care</h3>
                <p className="text-gray-600">
                  Japanese owners treat their watches with exceptional care. Even "junk" watches here are often cleaner and better preserved than working watches elsewhere in the world.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="font-bold text-xl mb-3">Hidden Treasures</h3>
                <p className="text-gray-600">
                  Japan is one of the world's largest markets for vintage, JDM (Japan Domestic Market), rare, and collectible timepieces — many never seen outside the country.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="font-bold text-xl mb-3">The "Junk" Opportunity</h3>
                <p className="text-gray-600">
                  High repair costs in Japan mean many watches are sold as "junk" when they simply need a battery change or light service. Your treasure awaits.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">⌚</div>
                <h3 className="font-bold text-xl mb-3">Thousands of Watches</h3>
                <p className="text-gray-600">
                  After dealing with thousands of watches, we've learned that most "non-working" Japanese watches spring back to life with minimal effort.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <p className="text-gray-700 leading-relaxed text-lg">
                To us, each watch isn't just a product — <strong>it's like a child</strong>. We handle every timepiece with the care and respect it deserves, understanding that behind every watch is a story waiting to continue with its new owner.
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
              For years, we sold primarily on Japanese domestic marketplaces. Most of our buyers were international collectors using proxy services. We heard their stories — the frustrations, the hidden fees, the confusion of machine-translated descriptions.
            </p>

            <div className="bg-red-50 border-l-4 border-[#B50012] p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 leading-relaxed">
                <strong>The problem was clear:</strong> Proxy services add 20-40% in hidden fees. Machine translations lose critical details about watch condition. Buyers couldn't ask questions or negotiate bundle deals. There had to be a better way.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              <strong>New Japan Deals is that better way.</strong> We bridge the gap between Japan's incredible watch market and collectors worldwide. You get clear English descriptions, transparent pricing, direct communication, and the peace of mind that comes from buying from a licensed, registered dealer.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Two Ways to Buy</h4>
                  <p className="text-gray-600 text-sm">Buy direct from Mercari/Rakuma if you can, or purchase through us with full English support.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Real Descriptions</h4>
                  <p className="text-gray-600 text-sm">No machine translation. Natural English descriptions so you understand exactly what you're buying.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Direct Communication</h4>
                  <p className="text-gray-600 text-sm">Ask questions, request discounts on bundles, negotiate combined shipping — talk to a real person.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Transparent Pricing</h4>
                  <p className="text-gray-600 text-sm">No hidden fees. What you see is what you pay.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Licensed & Registered in Japan
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-4 text-[#C9A962]">Company Information</h3>
                <ul className="space-y-3 text-gray-300">
                  <li><strong>Company:</strong> 合同会社山田トレード</li>
                  <li><strong>English:</strong> Yamada Trade LLC</li>
                  <li><strong>Location:</strong> Chiba Prefecture, Japan</li>
                  <li><strong>Established:</strong> Selling online since 2014</li>
                </ul>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-4 text-[#C9A962]">Official License</h3>
                <ul className="space-y-3 text-gray-300">
                  <li><strong>License Type:</strong> 古物商許可</li>
                  <li><strong>Antique Dealer License</strong></li>
                  <li><strong>Issued By:</strong> 千葉県公安委員会</li>
                  <li><strong>License No:</strong> 第441200001622号</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">
                We are a legally registered company in Japan, licensed by the Chiba Prefectural Public Safety Commission to deal in secondhand goods.
              </p>
              <a 
                href="https://www.yamadatrade.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#C9A962] hover:underline"
              >
                Visit our parent company website →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Promise to You
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-5xl mb-4">📸</div>
                <h3 className="font-bold text-xl mb-2">Actual Images</h3>
                <p className="text-gray-600">Every photo is of the actual watch you'll receive. No stock photos, no surprises.</p>
              </div>
              <div>
                <div className="text-5xl mb-4">📝</div>
                <h3 className="font-bold text-xl mb-2">Honest Descriptions</h3>
                <p className="text-gray-600">We tell you exactly what we know. If it's junk, we say it's junk. No hidden surprises.</p>
              </div>
              <div>
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="font-bold text-xl mb-2">Real Support</h3>
                <p className="text-gray-600">Questions? Just ask. We're real people who genuinely love watches.</p>
              </div>
            </div>

            <div className="bg-[#F5F5F0] p-8 rounded-xl">
              <p className="text-xl text-gray-700 italic mb-6">
                "We're not just selling watches. We're sharing our passion with collectors around the world, one timepiece at a time."
              </p>
              <p className="text-gray-500">— Founder, New Japan Deals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#B50012] to-[#8B0000] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Find Your Next Treasure?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Browse our collection of authentic Japanese watches and experience the New Japan Deals difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#B50012] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Browse Watches
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
