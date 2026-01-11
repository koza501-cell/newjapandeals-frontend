'use client';

import Link from 'next/link';
import TrustBar from '@/components/TrustBar';

export default function WhyUsPage() {
  const comparisonData = [
    { feature: 'Service Fee', proxy: '5-15%', us: '0%', winner: 'us' },
    { feature: 'Payment Fee', proxy: '3-5%', us: '0%', winner: 'us' },
    { feature: 'Packing Fee', proxy: '¥500-1,000', us: 'Free', winner: 'us' },
    { feature: 'Inspection Fee', proxy: '¥500+', us: 'Free', winner: 'us' },
    { feature: 'Consolidation Fee', proxy: '¥1,000+', us: 'N/A', winner: 'us' },
    { feature: 'Handling Fee', proxy: '0%', us: '10%', winner: 'proxy' },
    { feature: 'Number of Payments', proxy: '2 (Purchase + Shipping)', us: '1 (All-in-one)', winner: 'us' },
    { feature: 'Purchase Speed', proxy: '24-72 hour delay', us: 'Instant', winner: 'us' },
    { feature: 'Seller Communication', proxy: 'None', us: 'Direct (via us)', winner: 'us' },
    { feature: 'Expert Inspection', proxy: 'Basic photo check', us: '10+ years watch expertise', winner: 'us' },
    { feature: 'Packing Quality', proxy: 'Standard warehouse', us: 'Expert watch packing', winner: 'us' },
    { feature: 'Price Transparency', proxy: 'Hidden fees revealed later', us: 'Total shown upfront', winner: 'us' },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Browse & Choose',
      description: 'Find your perfect watch from our curated selection of authentic Japanese timepieces. Every listing includes detailed photos and honest descriptions.',
      icon: '🔍'
    },
    {
      step: 2,
      title: 'One Simple Payment',
      description: 'Pay once for everything - item price, handling fee, and international shipping. No surprise fees, no second payment requests.',
      icon: '💳'
    },
    {
      step: 3,
      title: 'Expert Inspection & Packing',
      description: 'We personally inspect and pack your watch using professional watch shipping materials developed over 10+ years of experience.',
      icon: '✅'
    },
    {
      step: 4,
      title: 'Fast Global Shipping',
      description: 'Ships within 48 hours via Japan Post with full tracking. EMS delivery in 3-7 days to most countries worldwide.',
      icon: '✈️'
    }
  ];

  const faqs = [
    {
      q: 'What makes you different from proxy services?',
      a: 'We are a direct dealer, not a proxy. We own or have direct access to every watch we list. This means no middleman fees, no delays waiting for someone to purchase on your behalf, and expert knowledge about every item we sell. When you buy from us, you\'re buying from watch enthusiasts who have personally inspected and photographed each timepiece.'
    },
    {
      q: 'How do I know the watches are authentic?',
      a: 'Every watch is personally inspected by our team with over 10 years of experience in Japanese watches. We verify authenticity by checking serial numbers, movement details, case construction, and dial characteristics. We accurately describe condition before listing and will answer any questions you have about specific pieces.'
    },
    {
      q: 'Why is there a 10% handling fee?',
      a: 'Our 10% handling fee covers professional inspection, high-quality photography, bilingual listing creation, secure watch-specific packing materials, and dedicated customer support. When you add up all the fees proxy services charge (service fee, payment fee, packing fee, inspection fee), they typically total 20-40% of the item price. Our single 10% fee saves you significant money.'
    },
    {
      q: 'Can I request a specific watch not listed?',
      a: 'Absolutely! Contact us with what you\'re looking for. We have an extensive network across Japan including contacts at auction houses, other dealers, and access to multiple Japanese marketplaces. We can source watches and provide a quote with no obligation. Many of our best finds come from customer requests.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfer for larger purchases. All payments are processed securely through trusted payment providers. You\'ll receive confirmation immediately after payment.'
    },
    {
      q: 'What if the watch arrives damaged?',
      a: 'We pack every watch with extreme care using professional watch shipping materials including custom foam inserts, watch pillows, and double-boxing for valuable pieces. In the rare case of shipping damage, we work with you and the carrier to resolve it promptly. We recommend shipping insurance for peace of mind on higher-value purchases.'
    },
    {
      q: 'Do you ship worldwide?',
      a: 'Yes! We ship to most countries via Japan Post. Options include EMS (fastest, 3-7 days), Airmail (7-14 days), and Surface mail (1-2 months, most economical). Shipping costs vary by destination and package weight, and are calculated and shown before checkout so there are no surprises.'
    },
    {
      q: 'How long does shipping take?',
      a: 'We ship within 48 hours of receiving payment (excluding weekends and Japanese holidays). Delivery times depend on your chosen shipping method: EMS takes 3-7 business days, Airmail takes 7-14 days, and Surface mail takes 1-2 months. All shipments include tracking numbers so you can follow your package\'s journey from Japan to your door.'
    }
  ];

  return (
    <main>
      <TrustBar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why Buy Direct from Japan?
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Skip the proxy services and their hidden fees. Buy authentic Japanese watches directly from a trusted dealer with over 10 years of experience in the Japanese watch market.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-full px-6 py-3">
            <span className="text-2xl">💰</span>
            <span className="text-green-400 font-medium">Save 20-40% compared to proxy services</span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              The Smarter Way to Buy Japanese Watches
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              If you've ever tried to buy a watch from Japan, you've probably encountered proxy services like Buyee, ZenMarket, or FromJapan. These services act as middlemen — they purchase items on your behalf from Japanese marketplaces and forward them to you internationally. Sounds convenient, right?
            </p>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              The problem is the fees. What starts as an attractive price on Mercari or Yahoo Auctions Japan quickly balloons when you add service fees, payment processing fees, domestic shipping, inspection fees, packing fees, and international shipping markups. By the time you receive your watch, you've often paid 20-40% more than the original listing price.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              <strong>New Japan Deals offers a better alternative.</strong> As a licensed dealer based in Japan, we eliminate the middleman entirely. We source, inspect, photograph, and ship watches directly to collectors worldwide. Our transparent 10% handling fee replaces all those nickel-and-dime proxy charges, saving you money while providing a superior buying experience.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-[#F5F5F0]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
              The Proxy Problem Explained
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8 text-center max-w-2xl mx-auto">
              Let's break down exactly what happens when you use a proxy service versus buying directly from New Japan Deals.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
                <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                  <span>❌</span> Using a Proxy Service
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Pay service fee (5-15% of item price)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Pay payment processing fee (3-5%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Pay domestic shipping to proxy warehouse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Pay packing fee (¥500-1,000)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Pay inspection fee (¥500+)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Pay consolidation fee if multiple items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Make TWO separate payments (purchase + shipping)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Wait 24-72 hours for proxy to purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>No direct communication with seller</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Generic warehouse packing (not watch-specific)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Machine-translated descriptions lose details</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm">
                <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                  <span>✓</span> Buying from New Japan Deals
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Zero service fee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Zero payment processing fee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>No domestic shipping (we already have it)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Free professional watch packing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Free expert inspection included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Simple 10% handling fee covers everything</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>ONE payment covers everything</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Ships within 48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Direct communication with watch experts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Expert watch-specific packing (10+ years)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Clear English descriptions by watch enthusiasts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Cost Example */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Real Cost Comparison Example
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8 text-center">
              Let's look at a real example: buying a ¥50,000 vintage Seiko watch
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 text-red-700">Via Proxy Service</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between"><span>Watch Price:</span><span>¥50,000</span></li>
                  <li className="flex justify-between"><span>Service Fee (10%):</span><span>¥5,000</span></li>
                  <li className="flex justify-between"><span>Payment Fee (4%):</span><span>¥2,000</span></li>
                  <li className="flex justify-between"><span>Domestic Shipping:</span><span>¥800</span></li>
                  <li className="flex justify-between"><span>Inspection Fee:</span><span>¥500</span></li>
                  <li className="flex justify-between"><span>Packing Fee:</span><span>¥500</span></li>
                  <li className="flex justify-between"><span>International Shipping:</span><span>¥3,000</span></li>
                  <li className="flex justify-between font-bold text-red-700 pt-2 border-t"><span>Total:</span><span>¥61,800</span></li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 text-green-700">Via New Japan Deals</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between"><span>Watch Price:</span><span>¥50,000</span></li>
                  <li className="flex justify-between"><span>Handling Fee (10%):</span><span>¥5,000</span></li>
                  <li className="flex justify-between"><span>Service Fee:</span><span>¥0</span></li>
                  <li className="flex justify-between"><span>Payment Fee:</span><span>¥0</span></li>
                  <li className="flex justify-between"><span>Inspection & Packing:</span><span>¥0</span></li>
                  <li className="flex justify-between"><span>International Shipping:</span><span>¥2,500</span></li>
                  <li className="flex justify-between font-bold text-green-700 pt-2 border-t"><span>Total:</span><span>¥57,500</span></li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-2xl font-bold text-green-600">You Save: ¥4,300 (7%)</p>
              <p className="text-gray-600 mt-2">Savings increase on higher-priced watches!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-16 bg-[#F5F5F0]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
            Complete Feature Comparison
          </h2>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1A1A1A] text-white">
                    <th className="px-6 py-4 text-left">Feature</th>
                    <th className="px-6 py-4 text-center">Proxy Services</th>
                    <th className="px-6 py-4 text-center bg-[#B50012]">New Japan Deals</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-medium">{row.feature}</td>
                      <td className={`px-6 py-4 text-center ${row.winner === 'proxy' ? 'text-green-600 font-medium' : 'text-red-600'}`}>
                        {row.proxy}
                      </td>
                      <td className={`px-6 py-4 text-center ${row.winner === 'us' ? 'text-green-600 font-medium' : ''}`}>
                        {row.winner === 'us' && <span className="mr-1">✓</span>}
                        {row.us}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            How It Works
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Buying from New Japan Deals is simple and straightforward. No complicated processes, no waiting for middlemen.
          </p>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-[#B50012] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="text-sm text-[#B50012] font-medium mb-2">Step {step.step}</div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why Trust Us?
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            We're not just another online store. We're licensed, experienced, and passionate about Japanese watches.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">🇯🇵</div>
              <h3 className="font-bold text-xl mb-2">Based in Japan</h3>
              <p className="text-gray-400">Operating from Chiba Prefecture, Japan since 2014. We have direct access to the Japanese domestic market that international buyers can't easily reach.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⌚</div>
              <h3 className="font-bold text-xl mb-2">Watch Experts</h3>
              <p className="text-gray-400">10+ years specializing in Japanese watches. We know Seiko, Citizen, Casio, Orient, and other Japanese brands inside and out. Our expertise protects you.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="font-bold text-xl mb-2">Global Shipping</h3>
              <p className="text-gray-400">Safely delivered watches to collectors in 30+ countries worldwide. Our packing methods are refined from years of experience shipping delicate timepieces.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-2">Licensed Antique Dealer</p>
            <p className="text-[#C9A962] font-medium">古物商許可 第441200001622号</p>
            <p className="text-gray-500 text-sm mt-1">Issued by Chiba Prefectural Public Safety Commission</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#F5F5F0]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Got questions? We've got answers. If you don't see your question here, feel free to contact us directly.
          </p>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white rounded-xl shadow-md overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer font-medium flex justify-between items-center hover:bg-gray-50">
                  {faq.q}
                  <span className="text-[#B50012] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-4 text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#B50012] to-[#8B0000] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Save on Your Next Watch?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Browse our collection of authentic Japanese watches at prices proxy services simply cannot match. Join hundreds of satisfied collectors who've discovered the smarter way to buy from Japan.
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
