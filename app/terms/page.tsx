'use client';

import TrustBar from '@/components/TrustBar';

export default function TermsPage() {
  return (
    <main>
      <TrustBar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Terms & Conditions
          </h1>
          <p className="text-gray-400">Last updated: December 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            
            {/* Introduction */}
            <div className="bg-[#F5F5F0] p-6 rounded-xl mb-8">
              <p className="text-gray-700 m-0">
                Welcome to New Japan Deals. By accessing our website and making purchases, you agree to be bound by these Terms and Conditions. Please read them carefully before placing an order.
              </p>
            </div>

            {/* Company Information */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              1. Company Information
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <ul className="space-y-2 text-gray-700 list-none pl-0 m-0">
                <li><strong>Company Name:</strong> 合同会社山田トレード (Yamada Trade LLC)</li>
                <li><strong>Location:</strong> Chiba Prefecture, Japan</li>
                <li><strong>License:</strong> 古物商許可 第441200001622号</li>
                <li><strong>Issuing Authority:</strong> 千葉県公安委員会 (Chiba Prefectural Public Safety Commission)</li>
                <li><strong>Contact:</strong> yamadatrade11@gmail.com</li>
              </ul>
            </div>

            {/* Product Condition */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              2. Product Condition & Description
            </h2>
            <p className="text-gray-700 mb-4">
              All products sold on New Japan Deals are pre-owned, vintage, or secondhand items. Please understand the following:
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li><strong>"Junk" or "Operation Unconfirmed"</strong> items are sold as-is without guarantee of functionality. Many such watches may work with a simple battery change or light service.</li>
              <li>All photographs shown are of the <strong>actual item</strong> you will receive.</li>
              <li>Descriptions are provided in good faith based on visual inspection. We are not certified watchmakers and cannot guarantee internal condition.</li>
              <li>Please carefully review all images and descriptions before purchasing.</li>
            </ul>

            {/* How to Purchase */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              3. How to Purchase
            </h2>
            <p className="text-gray-700 mb-4">
              We offer two purchasing options:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">Option A: Direct from Mercari/Rakuma</h4>
                <p className="text-gray-600 text-sm m-0">If you can purchase directly from Japanese marketplaces, click the Mercari link on our product page to buy directly.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Option B: International Purchase</h4>
                <p className="text-gray-600 text-sm m-0">For international customers, purchase through our website with English descriptions and international shipping.</p>
              </div>
            </div>

            {/* Payment Terms */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              4. Payment Terms
            </h2>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>Full payment is required at the time of purchase.</li>
              <li>We accept major credit cards and PayPal.</li>
              <li>All prices are displayed in Japanese Yen (JPY).</li>
              <li>We <strong>cannot hold any product without payment</strong>.</li>
              <li><strong>50% Deposit Hold:</strong> We can reserve a product if you pay 50% of the total. If the remaining payment is not completed within 20 days, you forfeit the deposit and the item will be relisted.</li>
            </ul>

            {/* Cancellation Policy */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              5. Cancellation & Restocking
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-gray-700 m-0">
                <strong>Cancellation and restocking fee: 10% of total payment.</strong> This fee applies to all cancelled orders after payment. These fees exist because some buyers purchase without carefully reading descriptions or checking images, or change their minds after payment. Please be certain before ordering.
              </p>
            </div>

            {/* Product Hold */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              6. Product Hold Period
            </h2>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>After full payment, we will hold your product for up to <strong>30 days free of charge</strong> if you request delayed shipping.</li>
              <li>This is useful for buyers who want to combine multiple orders.</li>
              <li>Please contact us to arrange extended hold periods.</li>
            </ul>

            {/* Shipping Address */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              7. Shipping Address Policy
            </h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-gray-700 m-0">
                <strong>Important:</strong> We only ship to the address provided by your payment processor. We cannot ship to a different address after payment is completed. Please ensure your payment account has the correct shipping address before purchasing.
              </p>
            </div>

            {/* Battery Removal */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              8. Battery Removal Notice
            </h2>
            <p className="text-gray-700 mb-6">
              Due to international shipping regulations and airline restrictions, we may be required to remove batteries from watches before shipping. This will be done without prior notification to comply with shipping safety requirements.
            </p>

            {/* Invoice */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              9. Invoice Requirements
            </h2>
            <p className="text-gray-700 mb-6">
              If you require a formal invoice for customs or personal records, you must select the "Invoice Required" option during checkout. Invoices cannot be issued after shipment.
            </p>

            {/* Prohibited Items */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              10. International Shipping Restrictions
            </h2>
            <p className="text-gray-700 mb-4">
              Some products listed on our domestic marketplace cannot be shipped internationally due to regulations. These include but are not limited to:
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>Perfumes and fragrances</li>
              <li>Gas lighters and fuel-containing items</li>
              <li>Items prohibited by destination country</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Such items are only available for domestic Japanese customers.
            </p>

            {/* No Proxy Service */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              11. No Proxy Service
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-700 m-0">
                We do not offer proxy purchasing services. Please do not request us to purchase items on your behalf from other sellers or to bundle external purchases with your New Japan Deals order.
              </p>
            </div>

            {/* Suspicious Transactions */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              12. Suspicious Transactions
            </h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to cancel any transaction that appears suspicious or fraudulent, without providing a reason. In such cases, the buyer will receive a full refund.
            </p>

            {/* Governing Law */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              13. Governing Law
            </h2>
            <p className="text-gray-700 mb-6">
              These Terms and Conditions are governed by the laws of Japan. Any disputes arising from purchases on New Japan Deals shall be subject to the exclusive jurisdiction of the courts of Chiba Prefecture, Japan.
            </p>

            {/* Contact */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              14. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-[#1A1A1A] text-white p-6 rounded-lg">
              <p className="m-0"><strong>Email:</strong> yamadatrade11@gmail.com</p>
              <p className="m-0 mt-2"><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (Japan Time)</p>
              <p className="m-0 mt-2"><strong>Closed:</strong> Weekends and Japanese public holidays</p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
