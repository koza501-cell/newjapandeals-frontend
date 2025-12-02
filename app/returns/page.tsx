import Link from 'next/link';

export const metadata = {
  title: 'Returns & Refunds Policy - New Japan Deals',
  description: 'Returns and refunds policy for New Japan Deals. All sales are final. Read our policies on cancellations and insurance claims.',
};

export default function ReturnsPage() {
  return (
    <main className="bg-[#F5F5F0] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Returns & Refunds Policy
            </h1>
            <p className="text-gray-600">Last Updated: December 2, 2025</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8">

            {/* Main Notice */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-red-800 mb-4">⚠️ All Sales Are Final</h2>
              <p className="text-red-700 text-lg">
                New Japan Deals operates on a <strong>NO RETURNS</strong> policy. Similar to proxy purchasing services, 
                all items are final sale and non-returnable once purchased.
              </p>
            </div>

            {/* Why No Returns */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Why We Don't Accept Returns</h2>
              <div className="text-gray-600 space-y-3">
                <p>Our no-return policy exists for several important reasons:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Full Transparency:</strong> We provide detailed photos of actual items, honest condition descriptions, and respond to questions before purchase.</li>
                  <li><strong>International Shipping:</strong> Shipping items back to Japan is expensive and time-consuming, often costing more than the item itself.</li>
                  <li><strong>Pre-Owned Items:</strong> Vintage and pre-owned watches can be affected by the return shipping process, changing their condition.</li>
                  <li><strong>Consistent with Industry:</strong> This policy is standard among Japanese sellers and proxy services worldwide.</li>
                </ul>
              </div>
            </section>

            {/* Before You Buy */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Before You Buy</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800 font-semibold mb-3">Please do the following BEFORE placing an order:</p>
                <ul className="list-disc pl-6 space-y-2 text-yellow-700">
                  <li>Review ALL product photographs (zoom in on details)</li>
                  <li>Read the complete product description</li>
                  <li>Understand condition ratings (Excellent, Good, Fair, Junk, etc.)</li>
                  <li>Note any mentioned defects or issues</li>
                  <li>Email us with ANY questions before purchasing</li>
                  <li>Verify the watch model/brand meets your expectations</li>
                </ul>
              </div>
            </section>

            {/* Cancellation Policy */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Order Cancellation</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Before Shipping:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may request cancellation via email before the item is shipped.</li>
                  <li>A <strong>10% cancellation fee</strong> will be deducted from your refund.</li>
                  <li>Refund (minus fee) processed within 7-10 business days.</li>
                </ul>
                <p className="mt-4"><strong>After Shipping:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Orders <strong>CANNOT</strong> be cancelled once shipped.</li>
                  <li>Refusing delivery does NOT qualify for refund.</li>
                </ul>
              </div>
            </section>

            {/* Deposit Policy */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">50% Deposit Hold</h2>
              <div className="text-gray-600 space-y-3">
                <ul className="list-disc pl-6 space-y-2">
                  <li>We can reserve an item with 50% deposit.</li>
                  <li>Remaining 50% must be paid within <strong>20 days</strong>.</li>
                  <li>If not paid within 20 days, <strong>deposit is forfeited</strong> and item is relisted.</li>
                  <li>No exceptions or extensions.</li>
                </ul>
              </div>
            </section>

            {/* Lost/Damaged - No Insurance */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Lost or Damaged Package (Without Insurance)</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-700">
                  <strong>If you did NOT purchase insurance:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-red-700 mt-2">
                  <li>We <strong>CANNOT</strong> provide any refund for lost or damaged packages.</li>
                  <li>Risk transfers to buyer when package is handed to Japan Post.</li>
                  <li>We will assist with inquiries but cannot guarantee any compensation from Japan Post.</li>
                </ul>
                <p className="mt-4 font-semibold text-red-800">
                  We strongly recommend purchasing insurance for all orders.
                </p>
              </div>
            </section>

            {/* Lost/Damaged - With Insurance */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Lost or Damaged Package (With Insurance)</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-800 font-semibold mb-3">If you purchased insurance:</p>
                
                <h3 className="font-bold mt-4 text-green-800">Claim Process:</h3>
                <ol className="list-decimal pl-6 space-y-2 text-green-700">
                  <li>Report damage/loss within <strong>7 days</strong> of delivery (or 30 days if not received)</li>
                  <li>Email us with:
                    <ul className="list-disc pl-6 mt-1">
                      <li>Photos of outer box showing damage</li>
                      <li>Photos of inner packaging</li>
                      <li>Photos of product damage (multiple angles)</li>
                      <li>Keep ALL original packaging</li>
                    </ul>
                  </li>
                  <li>We file the claim with Japan Post on your behalf</li>
                  <li>Japan Post investigates (takes <strong>30-90 days</strong>)</li>
                  <li>Payout issued <strong>ONLY after</strong> Japan Post approves claim</li>
                </ol>

                <h3 className="font-bold mt-4 text-yellow-800">25% Processing Fee:</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                  <p className="text-yellow-800 text-sm">
                    If claim is successful, we retain <strong>25%</strong> as processing fee. You receive <strong>75%</strong> of the claim amount.
                  </p>
                  <div className="mt-2 text-xs text-yellow-700">
                    <p>Example: ¥100,000 claim → You receive ¥75,000</p>
                  </div>
                </div>

                <h3 className="font-bold mt-4 text-green-800">Want to Keep 100%?</h3>
                <p className="text-green-700 text-sm">
                  You may file the claim directly with Japan Post yourself (requires Japanese language, documentation, and handling all correspondence).
                </p>

                <h3 className="font-bold mt-4 text-green-800">What's Covered:</h3>
                <ul className="list-disc pl-6 space-y-1 text-green-700">
                  <li>Total loss during transit</li>
                  <li>Visible damage during transit</li>
                </ul>

                <h3 className="font-bold mt-4 text-red-800">What's NOT Covered:</h3>
                <ul className="list-disc pl-6 space-y-1 text-red-700">
                  <li>No visible damage on outer package</li>
                  <li>Pre-existing conditions shown in listing</li>
                  <li>Internal mechanical issues</li>
                  <li>Customs seizure</li>
                  <li>Delivery delays</li>
                  <li>Buyer's remorse</li>
                </ul>
              </div>
            </section>

            {/* Customs Refusal */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Customs & Delivery Refusal</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>No refund is provided if:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You refuse delivery due to customs duties or taxes</li>
                  <li>Customs seizes or destroys the item</li>
                  <li>Package is returned because of incorrect address</li>
                  <li>You fail to collect the package</li>
                </ul>
                <p className="mt-3 text-sm text-gray-500">
                  Customs duties, taxes, and fees are the buyer's responsibility and are NOT refundable.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Contact Us</h2>
              <div className="text-gray-600">
                <p>For questions about orders, cancellations, or claims:</p>
                <p className="mt-2"><strong>Email:</strong> yamadatrade11@gmail.com</p>
                <p><strong>Response Time:</strong> Within 2 business days</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (Japan Time)</p>
              </div>
            </section>

            {/* Summary Box */}
            <div className="bg-gray-100 rounded-xl p-6 mt-8">
              <h3 className="font-bold text-lg mb-4">Quick Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>No returns accepted</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500">⚠</span>
                  <span>10% cancellation fee (before shipping)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>No refund without insurance for lost packages</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Insurance claims processed through Japan Post</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>No refund for customs refusal</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>30-90 days for insurance claim resolution</span>
                </div>
              </div>
            </div>

          </div>

          {/* Related Links */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/terms" className="text-[#B50012] hover:underline">
              Terms & Conditions →
            </Link>
            <Link href="/shipping-policy" className="text-[#B50012] hover:underline">
              Shipping Policy →
            </Link>
            <Link href="/faq" className="text-[#B50012] hover:underline">
              FAQ →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
