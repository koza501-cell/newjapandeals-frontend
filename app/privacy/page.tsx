'use client';

import TrustBar from '@/components/TrustBar';

export default function PrivacyPage() {
  return (
    <main>
      <TrustBar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Privacy Policy
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
                At New Japan Deals (operated by Yamada Trade LLC), we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
              </p>
            </div>

            {/* Company Information */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              1. Data Controller
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <ul className="space-y-2 text-gray-700 list-none pl-0 m-0">
                <li><strong>Company:</strong> 合同会社山田トレード (Yamada Trade LLC)</li>
                <li><strong>Location:</strong> Chiba Prefecture, Japan</li>
                <li><strong>Email:</strong> yamadatrade11@gmail.com</li>
                <li><strong>License:</strong> 古物商許可 第441200001622号</li>
              </ul>
            </div>

            {/* Information We Collect */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              2. Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">
              We collect information necessary to process your orders and provide customer service:
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Information You Provide</h3>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li><strong>Contact Information:</strong> Name, email address, phone number</li>
              <li><strong>Shipping Information:</strong> Delivery address, postal code, country</li>
              <li><strong>Payment Information:</strong> Processed securely by third-party payment processors (PayPal, Stripe). We do not store your credit card details.</li>
              <li><strong>Communication:</strong> Messages you send us via email or contact forms</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3">Information Collected Automatically</h3>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on site, click patterns</li>
              <li><strong>IP Address:</strong> For security and fraud prevention</li>
              <li><strong>Cookies:</strong> Small files stored on your device to improve your experience</li>
            </ul>

            {/* How We Use Information */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use your information for the following purposes:
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>Processing and fulfilling your orders</li>
              <li>Shipping products to your address</li>
              <li>Sending order confirmations and tracking information</li>
              <li>Responding to your inquiries and providing customer support</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Improving our website and services</li>
              <li>Complying with legal obligations</li>
            </ul>

            {/* Information Sharing */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              4. Information Sharing
            </h2>
            <p className="text-gray-700 mb-4">
              We do not sell or rent your personal information. We share your data only with:
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li><strong>Shipping Carriers:</strong> Japan Post, EMS, and other carriers to deliver your orders</li>
              <li><strong>Payment Processors:</strong> PayPal, Stripe, or other payment services to process transactions</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>

            {/* Data Security */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              5. Data Security
            </h2>
            <div className="bg-green-50 p-6 rounded-xl mb-6">
              <p className="text-gray-700 m-0">
                We implement appropriate security measures to protect your personal information, including:
              </p>
              <ul className="text-gray-700 mt-4 space-y-2 m-0">
                <li>✓ SSL/TLS encryption for all data transmission</li>
                <li>✓ Secure payment processing through trusted providers</li>
                <li>✓ Limited access to personal data on a need-to-know basis</li>
                <li>✓ Regular security reviews and updates</li>
              </ul>
            </div>

            {/* Cookies */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              6. Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us:
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>Remember your preferences</li>
              <li>Keep you logged in</li>
              <li>Understand how you use our site</li>
              <li>Improve our services</li>
            </ul>
            <p className="text-gray-700 mb-6">
              You can control cookies through your browser settings. However, disabling cookies may affect some website functionality.
            </p>

            {/* Data Retention */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              7. Data Retention
            </h2>
            <p className="text-gray-700 mb-6">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes. Order records are kept for accounting and legal compliance purposes as required by Japanese law.
            </p>

            {/* Your Rights */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              8. Your Rights
            </h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="text-gray-700 mb-6">
              To exercise these rights, please contact us at yamadatrade11@gmail.com.
            </p>

            {/* International Transfers */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              9. International Data Transfers
            </h2>
            <p className="text-gray-700 mb-6">
              As we are based in Japan and ship worldwide, your personal information may be transferred to and processed in Japan. By making a purchase, you consent to this transfer. Japan has data protection laws that provide adequate protection for personal information.
            </p>

            {/* Children's Privacy */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              10. Children's Privacy
            </h2>
            <p className="text-gray-700 mb-6">
              Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
            </p>

            {/* Third-Party Links */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              11. Third-Party Links
            </h2>
            <p className="text-gray-700 mb-6">
              Our website may contain links to external sites (such as Mercari Japan). We are not responsible for the privacy practices of these third-party websites. We encourage you to review their privacy policies.
            </p>

            {/* Changes to Policy */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              12. Changes to This Policy
            </h2>
            <p className="text-gray-700 mb-6">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the updated policy.
            </p>

            {/* Contact */}
            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              13. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-[#1A1A1A] text-white p-6 rounded-xl">
              <p className="m-0"><strong>Email:</strong> yamadatrade11@gmail.com</p>
              <p className="m-0 mt-2"><strong>Company:</strong> 合同会社山田トレード (Yamada Trade LLC)</p>
              <p className="m-0 mt-2"><strong>Location:</strong> Chiba Prefecture, Japan</p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
