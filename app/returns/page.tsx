'use client';

import Link from 'next/link';
import TrustBar from '@/components/TrustBar';

export default function ReturnsPage() {
  return (
    <main>
      <TrustBar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Returns & Refunds
          </h1>
          <p className="text-gray-400">Understanding our policy before you buy</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Important Notice */}
            <div className="bg-red-50 border-2 border-[#B50012] p-6 rounded-xl mb-12">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h2 className="font-bold text-xl mb-2 text-[#B50012]">Important: All Sales Are Final</h2>
                  <p className="text-gray-700 m-0">
                    Due to the nature of our products (pre-owned, vintage, and "junk/operation unconfirmed" items), all sales are final. We do not accept returns or provide refunds except in very specific circumstances outlined below.
                  </p>
                </div>
              </div>
            </div>

            {/* Why No Returns */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Why We Have This Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We understand this policy may seem strict, but there are important reasons:
            </p>
            <ul className="text-gray-700 space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-[#B50012] font-bold">1.</span>
                <span><strong>What You See Is What You Get:</strong> Every product listing includes actual photographs of the exact item you will receive. We don't use stock photos.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#B50012] font-bold">2.</span>
                <span><strong>Honest Descriptions:</strong> We describe every flaw, scratch, and issue we can identify. If a watch is "junk" or "operation unconfirmed," we say so clearly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#B50012] font-bold">3.</span>
                <span><strong>Pre-Owned Nature:</strong> These are used items with history. Vintage watches may have wear consistent with their age.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#B50012] font-bold">4.</span>
                <span><strong>International Shipping:</strong> The cost and complexity of international returns makes them impractical for items at our price points.</span>
              </li>
            </ul>

            {/* Before You Buy */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Before You Buy - Please Check
            </h2>
            <div className="bg-[#F5F5F0] p-6 rounded-xl mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Review ALL photos carefully</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Read the complete description</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Understand "junk" means untested</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Check the condition notes</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Ask questions before buying</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Verify shipping costs to your country</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-12">
              <p className="text-gray-700 m-0">
                <strong>💡 Tip:</strong> If you have any questions or concerns about an item, please contact us BEFORE purchasing. We're happy to provide additional photos or information.
              </p>
            </div>

            {/* Exceptions */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Exceptions: When We May Offer Refunds
            </h2>
            <p className="text-gray-700 mb-4">
              While all sales are generally final, we may consider refunds or replacements in these specific situations:
            </p>

            <div className="space-y-4 mb-8">
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                <h4 className="font-bold text-green-800 mb-1">Wrong Item Shipped</h4>
                <p className="text-gray-600 text-sm m-0">If we mistakenly send you the wrong item, we will arrange for the correct item to be sent at our expense.</p>
              </div>
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                <h4 className="font-bold text-green-800 mb-1">Item Significantly Different from Description</h4>
                <p className="text-gray-600 text-sm m-0">If the item is materially different from what was described and photographed (not minor variations), contact us with photos immediately upon receipt.</p>
              </div>
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                <h4 className="font-bold text-green-800 mb-1">Damaged During Shipping (with Insurance)</h4>
                <p className="text-gray-600 text-sm m-0">If you purchased shipping insurance and the item arrives damaged, we will work with you and the carrier to resolve the claim.</p>
              </div>
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                <h4 className="font-bold text-green-800 mb-1">Lost Package (with Insurance)</h4>
                <p className="text-gray-600 text-sm m-0">If your insured package is confirmed lost by the carrier, we will process a claim and provide a refund.</p>
              </div>
            </div>

            {/* NOT Covered */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              What Is NOT Covered
            </h2>
            <div className="bg-gray-100 p-6 rounded-xl mb-8">
              <ul className="text-gray-700 space-y-2 m-0">
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>Change of mind ("I don't want it anymore")</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>"Junk" items that don't work (as described)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>Normal wear consistent with vintage/used items</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>Issues visible in the listing photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>Buyer didn't read description carefully</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>Customs fees or import taxes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✗</span>
                  <span>Shipping damage without insurance</span>
                </li>
              </ul>
            </div>

            {/* Cancellation */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Order Cancellation
            </h2>
            <p className="text-gray-700 mb-4">
              We understand sometimes circumstances change. However, cancellations incur fees to cover our time and payment processing costs.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
              <p className="text-gray-700 m-0">
                <strong>Cancellation/restocking fee: 10% of total payment.</strong> This fee applies to orders cancelled after payment. Once payment is received, we immediately begin processing your order. Please be certain before purchasing.
              </p>
            </div>

            {/* Suspicious Transactions */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Suspicious Transactions
            </h2>
            <p className="text-gray-700 mb-8">
              If we identify a transaction as suspicious or potentially fraudulent, we reserve the right to cancel the order without explanation. In such cases, the buyer will receive a full refund.
            </p>

            {/* How to Request */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              How to Request a Refund (If Eligible)
            </h2>
            <div className="bg-[#1A1A1A] text-white p-6 rounded-xl mb-8">
              <ol className="space-y-3 m-0 list-decimal list-inside">
                <li>Contact us within <strong>48 hours of receiving</strong> your item</li>
                <li>Provide your order number and clear photos showing the issue</li>
                <li>Explain how the item differs from the listing</li>
                <li>Wait for our response (usually within 24-48 business hours)</li>
              </ol>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="m-0"><strong>Email:</strong> yamadatrade11@gmail.com</p>
              </div>
            </div>

            {/* Our Reputation */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Track Record
            </h2>
            <p className="text-gray-700 mb-4">
              We've been selling watches online since 2014. Our reputation matters to us, and we encourage you to check our feedback on Mercari Japan to see how satisfied our customers are.
            </p>
            <div className="bg-green-50 p-6 rounded-xl">
              <p className="text-gray-700 m-0">
                <strong>💚 Our Promise:</strong> We describe items honestly, photograph them thoroughly, and package them carefully. The vast majority of our customers are happy with their purchases because they know exactly what to expect before buying.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
