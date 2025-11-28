'use client';

import { useState, useEffect } from 'react';

const shippingRates: Record<string, number> = {
  'USA': 2500,
  'UK': 2800,
  'Germany': 2800,
  'France': 2800,
  'Australia': 2200,
  'Canada': 2600,
  'Singapore': 2000,
  'Hong Kong': 2000,
  'Other': 3000,
};

export default function SavingsCalculator() {
  const [price, setPrice] = useState(15000);
  const [country, setCountry] = useState('USA');
  const [isAnimating, setIsAnimating] = useState(false);

  // Proxy fees (typical proxy service)
  const proxyServiceFee = Math.round(price * 0.08); // 8%
  const proxyPaymentFee = 500;
  const proxyPackingFee = 800;
  const proxyConsolidation = 1000;
  const proxyInspection = 500;
  const proxyShipping = shippingRates[country] + 500; // Proxies charge more
  const proxyTotal = price + proxyServiceFee + proxyPaymentFee + proxyPackingFee + proxyConsolidation + proxyInspection + proxyShipping;

  // Our fees
  const ourHandling = Math.round(price * 0.10); // 10%
  const ourShipping = shippingRates[country];
  const ourTotal = price + ourHandling + ourShipping;

  // Savings
  const savings = proxyTotal - ourTotal;
  const savingsPercent = Math.round((savings / proxyTotal) * 100);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [price, country]);

  const formatPrice = (val: number) => '¥' + val.toLocaleString();

  return (
    <section id="calculator" className="bg-[#F5F5F0] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            See How Much You'll Save
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Compare the real cost of buying through a proxy service vs. buying directly from us.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Input Section */}
          <div className="bg-[#1A1A1A] p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Item Price (JPY)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#B50012]"
                />
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full mt-3 accent-[#B50012]"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Your Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#B50012]"
                >
                  {Object.keys(shippingRates).map((c) => (
                    <option key={c} value={c} className="text-black">{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Via Proxy */}
              <div className="bg-gray-100 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MORE EXPENSIVE
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-red-500">❌</span> Via Proxy Service
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item Price</span>
                    <span>{formatPrice(price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee (8%)</span>
                    <span className="text-red-600">+{formatPrice(proxyServiceFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Fee</span>
                    <span className="text-red-600">+{formatPrice(proxyPaymentFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packing Fee</span>
                    <span className="text-red-600">+{formatPrice(proxyPackingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consolidation</span>
                    <span className="text-red-600">+{formatPrice(proxyConsolidation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inspection</span>
                    <span className="text-red-600">+{formatPrice(proxyInspection)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>+{formatPrice(proxyShipping)}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className={`text-red-600 ${isAnimating ? 'scale-110' : ''} transition-transform`}>
                      {formatPrice(proxyTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Via Us */}
              <div className="bg-green-50 rounded-xl p-6 relative overflow-hidden border-2 border-green-500">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  BEST VALUE
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-green-500">✓</span> Via New Japan Deals
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item Price</span>
                    <span>{formatPrice(price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="text-green-600 font-medium">FREE ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Fee</span>
                    <span className="text-green-600 font-medium">FREE ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packing Fee</span>
                    <span className="text-green-600 font-medium">FREE ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consolidation</span>
                    <span className="text-green-600 font-medium">N/A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Handling (10%)</span>
                    <span>+{formatPrice(ourHandling)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping (EMS)</span>
                    <span>+{formatPrice(ourShipping)}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className={`text-green-600 ${isAnimating ? 'scale-110' : ''} transition-transform`}>
                      {formatPrice(ourTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Banner */}
            <div className={`mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center ${isAnimating ? 'scale-[1.02]' : ''} transition-transform`}>
              <div className="text-sm uppercase tracking-wide mb-1">
                {savingsPercent >= 20 ? '🔥 HUGE SAVINGS!' : savingsPercent >= 10 ? '💰 Great Deal!' : '✅ You Save'}
              </div>
              <div className="text-4xl md:text-5xl font-bold">
                {formatPrice(savings)}
              </div>
              <div className="text-green-100 mt-1">
                That's {savingsPercent}% less than using a proxy!
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 text-center">
              <a 
                href="/products" 
                className="inline-flex items-center gap-2 bg-[#B50012] hover:bg-[#9A0010] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
              >
                Start Saving Now <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
