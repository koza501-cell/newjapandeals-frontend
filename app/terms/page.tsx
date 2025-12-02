import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions - New Japan Deals',
  description: 'Terms and Conditions for purchasing from New Japan Deals. Read our policies on shipping, returns, insurance, and more.',
};

export default function TermsPage() {
  return (
    <main className="bg-[#F5F5F0] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Terms and Conditions
            </h1>
            <p className="text-gray-600">Last Updated: December 2, 2025</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8">
            
            {/* Important Notice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-red-800 mb-2">⚠️ Important Notice - Please Read Carefully</h2>
              <p className="text-red-700">
                By placing an order on New Japan Deals, you acknowledge that you have read, understood, and agree to these Terms and Conditions in full. 
                All sales are <strong>FINAL</strong>. We do not accept returns. Please review all product images and descriptions carefully before purchasing.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">1. Company Information</h2>
              <div className="text-gray-600 space-y-2">
                <p><strong>Company Name:</strong> 合同会社山田トレード (Yamada Trade LLC)</p>
                <p><strong>Location:</strong> Chiba Prefecture, Japan</p>
                <p><strong>License:</strong> 古物商許可 第441200001622号</p>
                <p><strong>Issuing Authority:</strong> 千葉県公安委員会 (Chiba Prefectural Public Safety Commission)</p>
                <p><strong>Contact:</strong> yamadatrade11@gmail.com</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (Japan Time)</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">2. Product Condition & Description</h2>
              <div className="text-gray-600 space-y-3">
                <p>All products sold on New Japan Deals are pre-owned, vintage, or secondhand items. Please understand the following:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>"Junk"</strong> or <strong>"Operation Unconfirmed"</strong> items are sold as-is without guarantee of functionality. Many such watches may work with a simple battery change or light service.</li>
                  <li>All photographs shown are of the <strong>actual item</strong> you will receive.</li>
                  <li>Descriptions are provided in good faith based on visual inspection. We are not certified watchmakers and cannot guarantee internal mechanical condition.</li>
                  <li>Minor scratches, wear marks, or patina consistent with age may not be individually listed but are visible in photographs.</li>
                  <li><strong>We do not verify authenticity</strong> of brand items. Buyers purchase at their own risk regarding authenticity.</li>
                </ul>
                <p className="font-semibold">Please carefully review ALL images and descriptions before purchasing. If you have questions, contact us BEFORE ordering.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">3. Pricing & Fees</h2>
              <div className="text-gray-600 space-y-3">
                <p>All prices on New Japan Deals include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Item Price:</strong> Base cost of the product (displayed in JPY)</li>
                  <li><strong>Handling Fee (10%):</strong> Covers inspection, professional packaging, and export documentation</li>
                  <li><strong>International Shipping:</strong> Based on destination country and shipping method selected</li>
                  <li><strong>Optional Insurance:</strong> Additional protection during transit (see Section 11)</li>
                </ul>
                <p><strong>NOT included in our prices:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Customs duties and import taxes in your country</li>
                  <li>VAT, GST, or other local taxes</li>
                  <li>Brokerage fees charged by carriers</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">4. Payment Terms</h2>
              <div className="text-gray-600 space-y-3">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full payment is required at the time of purchase.</li>
                  <li>We accept major credit cards (Visa, Mastercard, American Express) and PayPal.</li>
                  <li>All prices are displayed in Japanese Yen (JPY). Currency conversion is handled by your payment provider.</li>
                  <li>We cannot hold any product without full payment.</li>
                  <li><strong>50% Deposit Hold:</strong> We can reserve a product with 50% deposit. If remaining payment is not completed within 20 days, the deposit is forfeited and the item will be relisted.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 - NO RETURNS */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">5. No Returns Policy (Final Sale)</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-semibold">⚠️ ALL SALES ARE FINAL. WE DO NOT ACCEPT RETURNS.</p>
              </div>
              <div className="text-gray-600 space-y-3">
                <p>Similar to proxy purchasing services, all items sold through New Japan Deals are <strong>final sale</strong> and <strong>non-returnable</strong>. This policy exists because:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All product information, images, and condition details are transparently provided before purchase</li>
                  <li>International shipping makes returns impractical and costly</li>
                  <li>Pre-owned items may be affected by return shipping conditions</li>
                </ul>
                <p><strong>We strongly encourage you to:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Review all photographs carefully (zoom in on details)</li>
                  <li>Read the complete product description</li>
                  <li>Ask questions via email BEFORE purchasing if uncertain</li>
                  <li>Understand the condition rating (Excellent, Good, Fair, Junk, etc.)</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">6. Cancellation & Restocking Fee</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Cancellation fee: 10% of total payment</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>This fee applies to ALL cancelled orders after payment, regardless of reason.</li>
                  <li>Cancellation requests must be made via email BEFORE the item is shipped.</li>
                  <li>Once shipped, orders <strong>cannot be cancelled</strong>.</li>
                  <li>Refunds (minus 10% fee) will be processed within 7-10 business days.</li>
                </ul>
                <p className="text-sm text-gray-500">These fees exist because buyers sometimes purchase without carefully reviewing descriptions or images, or change their minds after payment. Please be certain before ordering.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">7. Shipping Terms</h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Carrier:</strong> All international shipments are handled by Japan Post.</p>
                <p><strong>Available Methods:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>EMS (Express Mail Service):</strong> 7-12 business days, tracking, insurance available up to ¥2,000,000</li>
                  <li><strong>ePacket Light:</strong> 10-18 business days, tracking, no insurance</li>
                  <li><strong>Small Packet (Air):</strong> 12-20 business days, no tracking, no insurance</li>
                  <li><strong>International Parcel (Air):</strong> 12-20 business days, tracking, insurance up to ¥11,160</li>
                  <li><strong>International Parcel (Surface):</strong> 45-90 days, tracking, insurance up to ¥11,160</li>
                </ul>
                <p><strong>Important:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery times are <strong>estimates only</strong> and are NOT guaranteed by New Japan Deals or Japan Post.</li>
                  <li>Delays due to customs clearance, weather, carrier issues, or other factors are not grounds for refund.</li>
                  <li>We ship to the address provided by your payment processor. Address changes after payment are not possible.</li>
                </ul>
              </div>
            </section>

            {/* Section 8 - Risk of Loss */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">8. Risk of Loss & Transfer of Ownership</h2>
              <div className="text-gray-600 space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="font-semibold">Risk of loss or damage transfers to the buyer when the package is handed over to Japan Post.</p>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Once we deliver the package to Japan Post and receive tracking confirmation, <strong>responsibility for the package transfers to the shipping carrier and ultimately the buyer</strong>.</li>
                  <li>For packages <strong>WITHOUT insurance</strong>: New Japan Deals is not responsible for lost or damaged packages after handover to Japan Post. <strong>No refund will be provided.</strong></li>
                  <li>For packages <strong>WITH insurance</strong>: See Section 11 for insurance claim procedures.</li>
                  <li>Title (ownership) of the item transfers to the buyer upon successful delivery.</li>
                </ul>
              </div>
            </section>

            {/* Section 9 - Customs */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">9. Customs, Duties & Import Taxes</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 font-semibold">The buyer is solely responsible for all customs duties, import taxes, VAT, GST, and brokerage fees in the destination country.</p>
              </div>
              <div className="text-gray-600 space-y-3">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Import duties and taxes vary by country and are determined by your local customs authority.</li>
                  <li>These fees are <strong>NOT included</strong> in our prices and will be collected separately by the carrier or customs.</li>
                  <li>We declare the actual purchase value on customs forms. We do not under-declare or mark items as "gifts."</li>
                  <li><strong>Refusal of delivery:</strong> If you refuse delivery due to customs fees, we will NOT provide a refund. You accepted these terms at checkout.</li>
                  <li><strong>Customs seizure:</strong> If your country's customs seizes or destroys the item (for any reason including suspected counterfeit, prohibited item, or incomplete documentation), <strong>no refund will be provided</strong>. This is the buyer's risk.</li>
                </ul>
                <p className="text-sm text-gray-500">We recommend checking your country's import regulations and duty rates before purchasing.</p>
              </div>
            </section>

            {/* Section 10 - Lost & Damaged WITHOUT Insurance */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">10. Lost or Damaged Packages (Without Insurance)</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-semibold">⚠️ Without insurance, New Japan Deals cannot provide any refund for lost or damaged packages.</p>
              </div>
              <div className="text-gray-600 space-y-3">
                <p>If you choose a shipping method without insurance or decline optional insurance:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You accept full risk of loss or damage during transit.</li>
                  <li>We will assist with Japan Post inquiries but cannot guarantee any compensation.</li>
                  <li>Japan Post's standard liability is extremely limited (often ¥0 for uninsured small packets).</li>
                </ul>
                <p className="font-semibold">We strongly recommend purchasing insurance for all orders, especially high-value watches.</p>
              </div>
            </section>

            {/* Section 11 - Insurance */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">11. Shipping Insurance</h2>
              <div className="text-gray-600 space-y-3">
                <p>Insurance is <strong>OPTIONAL</strong> and available for eligible shipping methods (EMS, International Parcel Air, International Parcel Surface).</p>
                
                <h3 className="font-bold mt-4">Insurance Cost (Paid by Buyer):</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>EMS:</strong> First ¥20,000 coverage is FREE</li>
                  <li>Additional coverage: ¥50 per ¥20,000 (Japan Post rate)</li>
                  <li>Maximum coverage: ¥2,000,000</li>
                </ul>

                <h3 className="font-bold mt-4">If You Skip Insurance:</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">
                    <strong>No claim is possible.</strong> You accept full risk for lost or damaged packages. 
                    New Japan Deals cannot provide any refund without insurance.
                  </p>
                </div>

                <h3 className="font-bold mt-4">If You Add Insurance:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your package is covered against loss and visible transit damage.</li>
                  <li>We will file the insurance claim with Japan Post on your behalf.</li>
                </ul>

                <h3 className="font-bold mt-4">Claim Processing Fee (25%):</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    If an insurance claim is successful, New Japan Deals will retain <strong>25% of the claim payout</strong> as a processing fee.
                    You will receive <strong>75% of the approved claim amount</strong>.
                  </p>
                  <p className="text-yellow-700 mt-2 text-sm">
                    This fee covers: claim filing, communication with Japan Post (in Japanese), document preparation, 
                    multiple meetings/contacts, and processing time (30-90 days).
                  </p>
                </div>

                <h3 className="font-bold mt-4">Example Claim Payouts:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Claim Amount</th>
                        <th className="border p-2 text-left">NJD Fee (25%)</th>
                        <th className="border p-2 text-left">You Receive (75%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border p-2">¥20,000</td><td className="border p-2">¥5,000</td><td className="border p-2">¥15,000</td></tr>
                      <tr><td className="border p-2">¥50,000</td><td className="border p-2">¥12,500</td><td className="border p-2">¥37,500</td></tr>
                      <tr><td className="border p-2">¥100,000</td><td className="border p-2">¥25,000</td><td className="border p-2">¥75,000</td></tr>
                      <tr><td className="border p-2">¥500,000</td><td className="border p-2">¥125,000</td><td className="border p-2">¥375,000</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-bold mt-4">Want to Keep 100%?</h3>
                <p>You may file the insurance claim directly with Japan Post yourself. This requires:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Japanese language proficiency</li>
                  <li>Direct communication with Japan Post</li>
                  <li>Completing claim documentation</li>
                  <li>Handling all correspondence yourself</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">If you choose to self-file, New Japan Deals will not be involved in the claim process.</p>

                <h3 className="font-bold mt-4">What IS Covered:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Total loss of package during transit</li>
                  <li>Visible damage to package and contents during transit</li>
                  <li>Partial loss of contents</li>
                </ul>

                <h3 className="font-bold mt-4">What is NOT Covered:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Damage with no visible evidence on outer packaging</li>
                  <li>Pre-existing defects or conditions visible in product listing</li>
                  <li>Internal mechanical failure (watches not working)</li>
                  <li>Customs seizure or destruction</li>
                  <li>Delivery delays</li>
                  <li>Buyer's remorse or dissatisfaction with product</li>
                  <li>Incorrect address provided by buyer</li>
                  <li>Customs duties, taxes, or fees</li>
                </ul>

                <h3 className="font-bold mt-4">Claim Procedure:</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Report damage/loss to us within <strong>7 days</strong> of delivery (or 30 days if package not received).</li>
                  <li>Provide photos: outer box showing damage, inner packaging, product damage, all angles.</li>
                  <li>Keep all original packaging materials until claim is resolved.</li>
                  <li>We will file the insurance claim with Japan Post on your behalf.</li>
                  <li>Japan Post investigation takes <strong>30-90 days</strong>.</li>
                  <li>Payout is issued <strong>ONLY after Japan Post approves the claim</strong>.</li>
                  <li>You receive 75% of approved amount (25% retained as processing fee).</li>
                </ol>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 text-sm">
                    <strong>Note:</strong> Insurance claims are processed and approved solely by Japan Post. 
                    New Japan Deals acts as an intermediary and cannot guarantee claim approval. 
                    Final decisions rest with Japan Post.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">12. Battery Removal Notice</h2>
              <div className="text-gray-600 space-y-3">
                <p>Due to international shipping regulations and airline safety requirements:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We may remove batteries from quartz watches before shipping.</li>
                  <li>This is done without prior notification to comply with shipping safety requirements.</li>
                  <li>Replacement batteries can typically be purchased locally in your country for minimal cost.</li>
                </ul>
              </div>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">13. Invoice Requirements</h2>
              <div className="text-gray-600 space-y-3">
                <p>If you require a formal invoice for customs clearance or personal records:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Select the <strong>"Invoice Required"</strong> option during checkout.</li>
                  <li>Specify any particular requirements (company name, tax ID, etc.) in the order notes.</li>
                  <li><strong>Invoices cannot be issued or modified after shipment.</strong></li>
                </ul>
              </div>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">14. Restricted Destinations</h2>
              <div className="text-gray-600 space-y-3">
                <p>We cannot ship to certain countries due to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Japan Post service restrictions</li>
                  <li>High fraud risk</li>
                  <li>International sanctions</li>
                  <li>Customs regulations</li>
                </ul>
                <p>Available shipping destinations are displayed during checkout. If your country is not listed, we cannot ship to that location.</p>
              </div>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">15. Product Hold Period</h2>
              <div className="text-gray-600 space-y-3">
                <ul className="list-disc pl-6 space-y-2">
                  <li>After full payment, we can hold your product for up to <strong>30 days</strong> free of charge upon request.</li>
                  <li>This is useful for buyers who want to combine multiple orders into one shipment.</li>
                  <li>Contact us to arrange extended hold periods (subject to storage availability).</li>
                  <li>Items held beyond 30 days without communication may be considered abandoned.</li>
                </ul>
              </div>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">16. No Proxy Service</h2>
              <div className="text-gray-600 space-y-3">
                <p>We do <strong>NOT</strong> offer proxy purchasing services. Please do not request:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Purchasing items from other sellers on your behalf</li>
                  <li>Bundling external purchases with your New Japan Deals order</li>
                  <li>Acting as your agent for auctions or other platforms</li>
                </ul>
              </div>
            </section>

            {/* Section 17 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">17. Fraud Prevention & Transaction Cancellation</h2>
              <div className="text-gray-600 space-y-3">
                <p>We reserve the right to cancel any transaction that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Appears suspicious or potentially fraudulent</li>
                  <li>Uses stolen payment credentials</li>
                  <li>Involves address discrepancies</li>
                  <li>Violates our terms or applicable laws</li>
                </ul>
                <p>In such cases, a full refund will be issued. We are not required to provide reasons for cancellation.</p>
              </div>
            </section>

            {/* Section 18 - Limitation of Liability */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">18. Limitation of Liability</h2>
              <div className="text-gray-600 space-y-3">
                <p>To the maximum extent permitted by law:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>New Japan Deals' total liability for any claim shall not exceed the <strong>purchase price of the item(s)</strong> in question.</li>
                  <li>We are NOT liable for: lost profits, consequential damages, incidental damages, special damages, emotional distress, or any indirect losses.</li>
                  <li>We are NOT liable for actions or failures of third parties including Japan Post, customs authorities, payment processors, or delivery services.</li>
                  <li>We are NOT liable for delays, losses, or damages caused by circumstances beyond our reasonable control.</li>
                </ul>
              </div>
            </section>

            {/* Section 19 - Force Majeure */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">19. Force Majeure</h2>
              <div className="text-gray-600 space-y-3">
                <p>We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Natural disasters (earthquakes, typhoons, floods)</li>
                  <li>Pandemics or health emergencies</li>
                  <li>War, terrorism, or civil unrest</li>
                  <li>Government actions, embargoes, or sanctions</li>
                  <li>Carrier service disruptions or suspensions</li>
                  <li>Labor disputes or strikes</li>
                </ul>
                <p>In such events, we may delay shipment or cancel orders with full refund.</p>
              </div>
            </section>

            {/* Section 20 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">20. Governing Law & Jurisdiction</h2>
              <div className="text-gray-600 space-y-3">
                <ul className="list-disc pl-6 space-y-2">
                  <li>These Terms and Conditions are governed by the laws of <strong>Japan</strong>.</li>
                  <li>Any disputes shall be subject to the exclusive jurisdiction of the courts of <strong>Chiba Prefecture, Japan</strong>.</li>
                  <li>By placing an order, you consent to the jurisdiction of Japanese courts.</li>
                </ul>
              </div>
            </section>

            {/* Section 21 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">21. Modifications to Terms</h2>
              <div className="text-gray-600 space-y-3">
                <p>We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes constitutes acceptance of the modified terms.</p>
              </div>
            </section>

            {/* Section 22 */}
            <section>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">22. Contact Us</h2>
              <div className="text-gray-600 space-y-3">
                <p>If you have questions about these Terms and Conditions:</p>
                <p><strong>Email:</strong> yamadatrade11@gmail.com</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (Japan Time)</p>
                <p><strong>Closed:</strong> Weekends and Japanese public holidays</p>
                <p className="text-sm text-gray-500 mt-4">Response time: Within 2 business days</p>
              </div>
            </section>

            {/* Agreement Box */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mt-8">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Agreement</h2>
              <p className="text-gray-600">
                By placing an order on New Japan Deals, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. 
                You acknowledge that all sales are final, returns are not accepted, and you accept full responsibility for customs duties and import taxes in your country.
              </p>
            </div>

          </div>

          {/* Related Links */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/shipping-policy" className="text-[#B50012] hover:underline">
              Shipping Policy →
            </Link>
            <Link href="/privacy" className="text-[#B50012] hover:underline">
              Privacy Policy →
            </Link>
            <Link href="/returns" className="text-[#B50012] hover:underline">
              Returns Policy →
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
