'use client';

import { useState } from 'react';
import Link from 'next/link';
import TrustBar from '@/components/TrustBar';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  faqs: FAQItem[];
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const faqCategories: FAQCategory[] = [
    {
      title: 'About Our Products',
      icon: '⌚',
      faqs: [
        {
          question: 'What does "junk" or "operation unconfirmed" mean?',
          answer: 'In Japan, watches are often sold as "junk" (ジャンク) when they haven\'t been tested or when the battery has expired. This doesn\'t necessarily mean they\'re broken — in our experience, most of these watches work perfectly after a simple battery change or light service. We use these terms to be transparent, following Japanese marketplace conventions.'
        },
        {
          question: 'Are these watches authentic?',
          answer: 'Yes, all watches we sell are authentic. We are a licensed dealer in Japan (古物商許可 第441200001622号) and have been selling watches since 2014. We carefully inspect every item we list.'
        },
        {
          question: 'Why are Japanese watches often in better condition?',
          answer: 'Japanese people typically treat their belongings with great care. Even pre-owned watches here are often cleaner and better maintained than similar watches elsewhere. Combined with Japan\'s dry climate, this means vintage watches are often well-preserved.'
        },
        {
          question: 'Can I request additional photos?',
          answer: 'Absolutely! If you want to see specific details before purchasing, contact us and we\'ll provide additional photos of the actual item.'
        },
        {
          question: 'Do you test the watches before selling?',
          answer: 'Items marked as "working" or "operation confirmed" have been tested. Items marked as "junk" or "operation unconfirmed" have not been tested, usually because the battery is dead. We describe exactly what we know about each watch.'
        }
      ]
    },
    {
      title: 'Ordering & Payment',
      icon: '💳',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are processed securely through trusted payment providers.'
        },
        {
          question: 'Can I buy directly from Mercari/Rakuma?',
          answer: 'Yes! If you have access to Japanese marketplaces, you can click the Mercari link on our product page and purchase directly. Our website is designed to help international buyers who can\'t access these platforms easily.'
        },
        {
          question: 'What currency are prices in?',
          answer: 'All prices are displayed in Japanese Yen (JPY). USD estimates are shown for reference using approximate exchange rates.'
        },
        {
          question: 'Can you hold an item for me?',
          answer: 'We cannot hold items without payment. However, if you pay a 50% deposit, we can reserve the item for up to 20 days. If the remaining payment isn\'t completed within 20 days, the deposit is forfeited and the item will be relisted.'
        },
        {
          question: 'Can I get a discount for multiple items?',
          answer: 'Yes! Contact us about bundle deals. We can offer combined shipping discounts and sometimes item discounts for multiple purchases.'
        }
      ]
    },
    {
      title: 'Shipping & Delivery',
      icon: '📦',
      faqs: [
        {
          question: 'How long does shipping take?',
          answer: 'Shipping times vary by method: EMS (7-12 business days), ePacket (10-18 days), Airmail/Small Packet (12-20 days), Surface Mail (1.5-3 months). We ship within 48 hours of payment on business days. These are estimated delivery times - actual delivery depends on destination country and customs processing.'
        },
        {
          question: 'Do you ship worldwide?',
          answer: 'Yes, we ship to most countries via Japan Post. Shipping costs vary based on destination, weight, and chosen shipping method.'
        },
        {
          question: 'Can I change my shipping address after payment?',
          answer: 'No, we can only ship to the address provided by your payment processor (PayPal, credit card company). Please ensure your payment account has the correct address before ordering.'
        },
        {
          question: 'Will you remove batteries from watches?',
          answer: 'Due to international shipping regulations, we may need to remove batteries before shipping. This is done to comply with airline and postal safety requirements, without prior notification.'
        },
        {
          question: 'Do you offer shipping insurance?',
          answer: 'Yes, we offer optional shipping insurance to protect against loss or damage during transit. We recommend insurance for valuable items.'
        },
        {
          question: 'Can you hold my order for combined shipping?',
          answer: 'Yes! After full payment, we can hold your items for up to 30 days free of charge. This allows you to combine multiple orders into one shipment.'
        },
        {
          question: 'What about customs and import duties?',
          answer: 'Import duties, taxes, and customs fees are the buyer\'s responsibility and vary by country. These charges are not included in our prices. Check with your local customs office for information.'
        }
      ]
    },
    {
      title: 'Returns & Refunds',
      icon: '↩️',
      faqs: [
        {
          question: 'Can I return an item?',
          answer: 'All sales are final. Because we sell pre-owned items as-is with actual photos, we don\'t accept returns for change of mind. Please review all photos and descriptions carefully before purchasing.'
        },
        {
          question: 'What if I receive a damaged or wrong item?',
          answer: 'If you receive the wrong item or something significantly different from the listing, contact us within 48 hours with photos. We\'ll work to resolve the issue. For shipping damage, insurance claims will be processed if you purchased coverage.'
        },
        {
          question: 'Why don\'t you accept returns?',
          answer: 'We show actual photos of every item and describe condition honestly. "Junk" items are sold as-is — if a watch doesn\'t work and we said it was untested, that\'s expected. The cost and complexity of international returns also makes them impractical at our price points.'
        },
        {
          question: 'Can I cancel my order?',
          answer: 'Cancellations are subject to a 10% restocking fee of the total payment. Once payment is received, we immediately begin processing your order. Please be certain before purchasing.'
        }
      ]
    },
    {
      title: 'About Us',
      icon: '🏢',
      faqs: [
        {
          question: 'Are you a legitimate business?',
          answer: 'Yes! We are Yamada Trade LLC (合同会社山田トレード), a registered company in Japan. We hold an official Antique Dealer License (古物商許可 第441200001622号) issued by the Chiba Prefectural Public Safety Commission.'
        },
        {
          question: 'How long have you been in business?',
          answer: 'We\'ve been buying and selling watches on Japanese marketplaces since 2014. New Japan Deals is our international platform to serve collectors worldwide.'
        },
        {
          question: 'Do you act as a proxy service?',
          answer: 'No, we are not a proxy service. We don\'t purchase items from other sellers on your behalf. We only sell items that we own or have direct access to.'
        },
        {
          question: 'Can you source a specific watch for me?',
          answer: 'If you\'re looking for something specific, contact us! We may be able to find it through our network in Japan and provide a quote.'
        },
        {
          question: 'How can I verify your reputation?',
          answer: 'You can check our seller feedback on Mercari Japan. We have years of positive reviews from satisfied customers.'
        }
      ]
    }
  ];
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqCategories.flatMap(category => 
    category.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  )
};
  return (
    <main>
      <TrustBar />
       {/* FAQ Schema for SEO */}
       <script
        type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
       />
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400">Everything you need to know about buying from New Japan Deals</p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-[#F5F5F0]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {faqCategories.map((category) => (
              <a
                key={category.title}
                href={`#${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition"
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <div 
                key={category.title} 
                id={category.title.toLowerCase().replace(/\s+/g, '-')}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const itemId = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openItems.includes(itemId);

                    return (
                      <div 
                        key={itemId}
                        className="border rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                        >
                          <span className="font-medium pr-4">{faq.question}</span>
                          <span className={`text-[#B50012] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-gray-600 border-t bg-gray-50">
                            <p className="pt-4 m-0">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Still Have Questions */}
            <div className="mt-16 bg-[#1A1A1A] text-white p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Still Have Questions?
              </h2>
              <p className="text-gray-300 mb-6">
                Can't find what you're looking for? We're happy to help!
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#B50012] text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Contact Us
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
