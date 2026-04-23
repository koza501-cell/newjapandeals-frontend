import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://www.newjapandeals.com';

export const metadata: Metadata = {
  title: 'Shipping to USA — No Surprise Customs Fees | New Japan Deals',
  description:
    'We ship Japanese watches to the USA with DDP (Delivered Duty Paid) via SpeedPAK. 7-14 day delivery, no surprise customs fees. All duties included in shipping price.',
  alternates: { canonical: `${SITE_URL}/shipping-to-usa` },
  openGraph: {
    title: 'Shipping to USA — No Surprise Customs Fees | New Japan Deals',
    description: 'DDP shipping from Japan to USA. 7-14 days, no customs surprises.',
    url: `${SITE_URL}/shipping-to-usa`,
  },
};

export default function ShippingToUSAPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long does shipping from Japan to the USA take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Standard delivery takes 7-14 business days via SpeedPAK. Most packages arrive within 10 days.',
        },
      },
      {
        '@type': 'Question',
        name: 'Will I have to pay customs fees or import duties?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. We ship DDP (Delivered Duty Paid), meaning all customs duties and taxes are included in the shipping price. You will never receive a surprise bill upon delivery.',
        },
      },
      {
        '@type': 'Question',
        name: 'What shipping carrier do you use for US deliveries?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We use SpeedPAK, a reliable international shipping service optimized for Japan-to-USA deliveries. Packages are trackable from Japan to your door.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my package insured during shipping?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all packages are insured for the full product value during transit. In the rare case of damage or loss, you are fully covered.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you ship to all 50 US states?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we ship to all 50 states including Alaska and Hawaii. Remote areas may take 1-2 extra days.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is the watch packaged for international shipping?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every watch is professionally packed with bubble wrap, foam inserts, and a rigid outer box. We take extra care to ensure your watch arrives in perfect condition.',
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Shipping to USA', item: `${SITE_URL}/shipping-to-usa` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-red-600">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800">Shipping to USA</span>
          </nav>

          {/* Hero */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl p-8 md:p-12 mb-10">
            <h1
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Ships to USA — No Surprise Customs Fees
            </h1>
            <p className="text-blue-200 text-lg max-w-2xl">
              We handle everything. Your Japanese watch arrives at your door with zero hidden fees.
            </p>
          </div>

          {/* Key Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">DDP Shipping</h3>
              <p className="text-sm text-gray-500">Delivered Duty Paid — all customs fees included in price</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">7-14 Day Delivery</h3>
              <p className="text-sm text-gray-500">Via SpeedPAK with full tracking from Japan to your door</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Fully Insured</h3>
              <p className="text-sm text-gray-500">Every package insured for full value during transit</p>
            </div>
          </div>

          {/* How It Works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              How Shipping to the USA Works
            </h2>
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Place Your Order</h3>
                  <p className="text-sm text-gray-500">Choose your watch and check out. Shipping cost shown at checkout includes all duties and taxes.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Professional Packaging in Japan</h3>
                  <p className="text-sm text-gray-500">We carefully package your watch with bubble wrap, foam inserts, and a rigid shipping box. Ships within 24-48 hours.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">SpeedPAK Delivery</h3>
                  <p className="text-sm text-gray-500">Your package travels via SpeedPAK, a fast and reliable Japan-to-USA logistics service. Full tracking provided.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delivered to Your Door</h3>
                  <p className="text-sm text-gray-500">Arrives in 7-14 business days. No customs bill, no surprise fees — just your watch.</p>
                </div>
              </div>
            </div>
          </section>

          {/* DDP Explainer */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              What is DDP (Delivered Duty Paid)?
            </h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-600 mb-4">
                DDP means <strong>we pay all customs duties, taxes, and import fees on your behalf</strong>. The price you see
                at checkout is the final price — nothing extra when the package arrives.
              </p>
              <p className="text-gray-600 mb-4">
                Many sellers ship DDU (Delivered Duty Unpaid), where <em>you</em> get surprised with a customs bill
                at delivery — sometimes $50-$200+ on a watch. With New Japan Deals, that never happens.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">
                  Bottom line: What you pay at checkout is what you pay. Period.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {(faqJsonLd.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>).map((faq, i) => (
                <details key={i} className="bg-white rounded-xl shadow-sm" open={i === 0}>
                  <summary className="p-5 cursor-pointer font-semibold text-gray-900 hover:text-red-600 transition-colors">
                    {faq.name}
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 text-sm">
                    {faq.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ready to Shop?
            </h2>
            <p className="text-gray-500 mb-6">Browse our collection of authentic Japanese watches with worry-free shipping.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#B50012] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#9A0010] transition-all"
            >
              Browse Watches
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
