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
      description: 'Find your perfect watch from our curated selection of authentic Japanese timepieces.',
      icon: '🔍'
    },
    {
      step: 2,
      title: 'One Simple Payment',
      description: 'Pay once for everything - item, handling, and shipping. No surprise fees later.',
      icon: '💳'
    },
    {
      step: 3,
      title: 'Expert Inspection & Packing',
      description: 'We personally inspect and pack your watch with 10+ years of expertise.',
      icon: '✅'
    },
    {
      step: 4,
      title: 'Fast Global Shipping',
      description: 'Ships within 48 hours via EMS with full tracking. Delivered in 3-7 days.',
      icon: '✈️'
    }
  ];

  const faqs = [
    {
      q: 'What makes you different from proxy services?',
      a: 'We are a direct dealer, not a proxy. We own or have direct access to every watch we list. This means no middleman fees, no delays, and expert knowledge about every item we sell.'
    },
    {
      q: 'How do I know the watches are authentic?',
      a: 'Every watch is personally inspected by our team with over 10 years of experience in Japanese watches. We verify authenticity and accurately describe condition before listing.'
    },
    {
      q: 'Why is there a 10% handling fee?',
      a: 'Our 10% handling covers inspection, professional photography, bilingual listing creation, secure packing, and customer support. Unlike proxies that charge 20-40% in combined fees, you save significantly.'
    },
    {
      q: 'Can I request a specific watch not listed?',
      a: 'Yes! Contact us with what you are looking for. We can source watches from our network across Japan and provide a quote with no obligation.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept major credit cards, PayPal, and bank transfer. All payments are processed securely.'
    },
    {
      q: 'What if the watch arrives damaged?',
      a: 'We pack every watch with extreme care using professional watch shipping materials. In the rare case of shipping damage, we work with you and the carrier to resolve it promptly.'
    },
    {
      q: 'Do you ship worldwide?',
      a: 'Yes! We ship to most countries via Japan Post EMS, Airmail, or Surface mail. Shipping costs vary by destination and are shown before checkout.'
    },
    {
      q: 'How long does shipping take?',
      a: 'EMS: 3-7 business days, Airmail: 7-14 days, Surface: 1-2 months. We ship within 48 hours of payment.'
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
            Skip the proxy services and their hidden fees. Buy authentic Japanese watches directly from a trusted 10-year dealer.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-full px-6 py-3">
            <span className="text-2xl">💰</span>
            <span className="text-green-400 font-medium">Save 20-40% compared to proxy services</span>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
              The Proxy Problem
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-xl p-6 border border-red-100">
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
                    <span>Make TWO separate payments</span>
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
                    <span>Generic warehouse packing</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
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
                    <span>Free professional packing</span>
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
                    <span>ONE payment, ONE shipment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Ships within 48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Direct communication available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Expert watch packing (10+ years)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-16 bg-[#F5F5F0]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
            Side-by-Side Comparison
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
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
            How It Works
          </h2>
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
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why Trust Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">🇯🇵</div>
              <h3 className="font-bold text-xl mb-2">Based in Japan</h3>
              <p className="text-gray-400">Operating from Japan since 2014. Direct access to the best Japanese watch market.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⌚</div>
              <h3 className="font-bold text-xl mb-2">Watch Experts</h3>
              <p className="text-gray-400">10+ years specializing in Japanese watches. We know Seiko, Citizen, Casio, and Orient inside out.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="font-bold text-xl mb-2">Hundreds Shipped</h3>
              <p className="text-gray-400">Safely delivered watches to collectors in 30+ countries worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#F5F5F0]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
            Frequently Asked Questions
          </h2>
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
            Browse our collection of authentic Japanese watches at prices proxy services cannot match.
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
