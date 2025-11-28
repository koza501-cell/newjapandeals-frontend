'use client';

export default function WhyNotProxy() {
  const proxyProblems = [
    { icon: '💸', text: 'Service Fee (5-15%)' },
    { icon: '💳', text: 'Payment Fee (3-5%)' },
    { icon: '📦', text: 'Packing Fee (¥500+)' },
    { icon: '🔍', text: 'Inspection Fee (¥500+)' },
    { icon: '📋', text: 'Consolidation Fee (¥1,000+)' },
    { icon: '⏱️', text: '72-Hour Listing Delay' },
    { icon: '💳💳', text: 'Double Payment Required' },
    { icon: '🚫', text: 'No Seller Communication' },
    { icon: '📦', text: 'Generic Warehouse Packing' },
  ];

  const ourAdvantages = [
    { icon: '✓', text: 'Zero Service Fee' },
    { icon: '✓', text: 'Zero Payment Fee' },
    { icon: '✓', text: 'Free Professional Packing' },
    { icon: '✓', text: 'No Hidden Costs' },
    { icon: '✓', text: 'Instant Purchase (No Delay)' },
    { icon: '✓', text: 'Single Payment, Single Shipment' },
    { icon: '✓', text: 'Direct Communication' },
    { icon: '✓', text: 'Expert Watch Packing (10+ Years)' },
    { icon: '✓', text: 'Total Price Shown Upfront' },
  ];

  return (
    <section className="bg-[#1A1A1A] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why Skip the Proxy?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Proxy services like Buyee and ZenMarket add 20-40% to your final price. Here's how we're different.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Proxy Problems */}
          <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 rounded-2xl p-8 border border-red-900/50">
            <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
              <span className="text-2xl">❌</span> The Proxy Problem
            </h3>
            <ul className="space-y-4">
              {proxyProblems.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <span className="text-xl w-8">{item.icon}</span>
                  <span className="line-through opacity-70">{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-red-900/50">
              <div className="text-red-400 font-medium">Average extra cost:</div>
              <div className="text-3xl font-bold text-red-500">+20-40%</div>
            </div>
          </div>

          {/* Our Advantages */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-950/30 rounded-2xl p-8 border border-green-900/50">
            <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
              <span className="text-2xl">✓</span> The New Japan Deals Difference
            </h3>
            <ul className="space-y-4">
              {ourAdvantages.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <span className="text-xl w-8 text-green-500">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-green-900/50">
              <div className="text-green-400 font-medium">Your savings:</div>
              <div className="text-3xl font-bold text-green-500">¥3,000 - ¥15,000+</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Every watch we sell is personally inspected and packed by an expert with 10+ years of experience dealing in Japanese timepieces.
          </p>
          <a 
            href="/why-us" 
            className="inline-flex items-center gap-2 text-[#C9A962] hover:text-white transition-colors font-medium"
          >
            Learn more about our difference <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
