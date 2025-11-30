'use client';

import TrustBar from '@/components/TrustBar';

export default function ShippingPolicyPage() {
  const shippingMethods = [
    {
      name: 'EMS (Express Mail Service)',
      speed: '3-7 business days',
      tracking: 'Full tracking',
      insurance: 'Available',
      best: 'Fastest option with full tracking'
    },
    {
      name: 'Airmail',
      speed: '7-14 business days',
      tracking: 'Limited tracking',
      insurance: 'Available',
      best: 'Balance of speed and cost'
    },
    {
      name: 'Surface Mail (SAL/Sea)',
      speed: '1-2 months',
      tracking: 'Basic tracking',
      insurance: 'Available',
      best: 'Most economical option'
    }
  ];

  return (
    <main>
      <TrustBar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shipping Policy
          </h1>
          <p className="text-gray-400">Worldwide delivery direct from Japan</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Quick Facts */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <div className="bg-green-50 p-6 rounded-xl text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="font-bold text-lg mb-1">Ships Within</h3>
                <p className="text-2xl font-bold text-green-600">48 Hours</p>
                <p className="text-sm text-gray-500">On business days</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl text-center">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-bold text-lg mb-1">We Ship To</h3>
                <p className="text-2xl font-bold text-blue-600">Worldwide</p>
                <p className="text-sm text-gray-500">Most countries</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-bold text-lg mb-1">Insurance</h3>
                <p className="text-2xl font-bold text-purple-600">Available</p>
                <p className="text-sm text-gray-500">Optional coverage</p>
              </div>
            </div>

            {/* Shipping Methods */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shipping Methods
            </h2>
            <p className="text-gray-700 mb-6">
              We offer multiple shipping options to accommodate different budgets and timeframes. The best option depends on your location, the size and weight of your order, and how quickly you need delivery.
            </p>

            <div className="space-y-4 mb-12">
              {shippingMethods.map((method, index) => (
                <div key={index} className="border rounded-xl p-6 hover:shadow-lg transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{method.name}</h3>
                      <p className="text-gray-500 text-sm">{method.best}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="bg-gray-100 px-3 py-1 rounded">
                        <span className="text-gray-500">Speed:</span> <strong>{method.speed}</strong>
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded">
                        <span className="text-gray-500">Tracking:</span> <strong>{method.tracking}</strong>
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded">
                        <span className="text-gray-500">Insurance:</span> <strong>{method.insurance}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Processing Time */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Processing & Dispatch
            </h2>
            <div className="bg-[#F5F5F0] p-6 rounded-xl mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">Business Hours</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>Monday - Friday: 9:00 AM - 5:00 PM (JST)</li>
                    <li>Saturday & Sunday: Closed</li>
                    <li>Japanese Public Holidays: Closed</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Dispatch Schedule</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>Orders ship within 48 hours (business days)</li>
                    <li>Last dispatch: 11:00 AM JST</li>
                    <li>Orders after 11 AM ship next business day</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
              <p className="text-gray-700 m-0">
                <strong>Example:</strong> If you order on Friday at 2:00 PM JST, your order will ship on Monday (the next business day).
              </p>
            </div>

            {/* Shipping Address */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shipping Address
            </h2>
            <div className="bg-red-50 border-l-4 border-[#B50012] p-4 mb-8">
              <p className="text-gray-700 m-0">
                <strong>Important:</strong> We ship only to the address provided by your payment processor (PayPal, credit card, etc.). We cannot change the shipping address after payment is completed. Please verify your address is correct before placing your order.
              </p>
            </div>

            {/* Insurance */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shipping Insurance
            </h2>
            <p className="text-gray-700 mb-4">
              We offer optional shipping insurance on all orders. This protects your purchase in case of loss or damage during transit.
            </p>
            <div className="bg-green-50 p-6 rounded-xl mb-8">
              <h4 className="font-bold text-green-800 mb-2">✓ Insurance Covers:</h4>
              <ul className="text-gray-700 space-y-1">
                <li>Lost packages</li>
                <li>Damaged items during shipping</li>
                <li>Stolen packages (with carrier confirmation)</li>
              </ul>
            </div>

            {/* Battery Notice */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Battery Removal Notice
            </h2>
            <p className="text-gray-700 mb-8">
              Due to international shipping regulations and airline safety requirements, we may need to remove batteries from watches before shipping. This is done without prior notification to comply with shipping carrier and country-specific regulations.
            </p>

            {/* Delays */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Possible Delays
            </h2>
            <p className="text-gray-700 mb-4">
              While we strive to ship as quickly as possible, delays may occur due to:
            </p>
            <ul className="text-gray-700 space-y-2 mb-8">
              <li>Severe weather conditions (typhoons, heavy snow)</li>
              <li>Natural disasters (earthquakes, etc.)</li>
              <li>Customs inspection in destination country</li>
              <li>National holidays in Japan or destination country</li>
              <li>Carrier delays beyond our control</li>
            </ul>

            {/* Product Hold */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Product Hold Service
            </h2>
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h4 className="font-bold text-blue-800 mb-2">Free 30-Day Hold</h4>
              <p className="text-gray-700 mb-0">
                After payment, we can hold your product for up to 30 days free of charge. This is perfect if you're planning to combine multiple purchases into one shipment to save on shipping costs. Simply contact us to arrange.
              </p>
            </div>

            {/* Tracking */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Order Tracking
            </h2>
            <p className="text-gray-700 mb-8">
              Once your order ships, you will receive a tracking number via email. You can use this number to track your package through Japan Post or the relevant carrier's website.
            </p>

            {/* Customs */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Customs & Import Duties
            </h2>
            <div className="bg-gray-100 p-6 rounded-xl mb-8">
              <p className="text-gray-700 m-0">
                International orders may be subject to customs duties, taxes, or import fees imposed by your country. These charges are the responsibility of the buyer and are not included in our prices. Please check with your local customs office for information about potential fees before ordering.
              </p>
            </div>

            {/* Invoice */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Invoice Requirements
            </h2>
            <p className="text-gray-700 mb-8">
              If you need a formal invoice for customs clearance or personal records, please select the "Invoice Required" option during checkout. We cannot issue invoices after the order has shipped.
            </p>

            {/* Contact */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Questions?
            </h2>
            <div className="bg-[#1A1A1A] text-white p-6 rounded-xl">
              <p className="mb-2">Have questions about shipping? Contact us:</p>
              <p className="m-0"><strong>Email:</strong> yamadatrade11@gmail.com</p>
              <p className="m-0 mt-2 text-gray-400 text-sm">We typically respond within 24-48 business hours.</p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
