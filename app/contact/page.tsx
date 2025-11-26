import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | New Japan Deals',
  description: 'Get in touch with New Japan Deals. Questions about Japanese watches, orders, or shipping? We\'re here to help.',
  alternates: {
    canonical: 'https://newjapandeals.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="container-custom py-12">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-6">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Contact</span>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8 text-center">Contact Us</h1>

        <p className="text-center text-gray-600 mb-8">
          Have questions about our watches or your order? We're here to help!
        </p>

        <div className="bg-cream p-8 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div>
              <strong>Email:</strong>{' '}
              <a href="mailto:support@newjapandeals.com" className="text-primary hover:underline">
                support@newjapandeals.com
              </a>
            </div>
            <div>
              <strong>Response Time:</strong> We typically respond within 24-48 hours
            </div>
            <div>
              <strong>Business Hours:</strong> Monday - Friday, 9:00 - 18:00 JST
            </div>
          </div>
        </div>

        <div className="bg-white border p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <Link href="/track-order" className="text-primary hover:underline">
                → Track Your Order
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="text-primary hover:underline">
                → Shipping Information
              </Link>
            </li>
            <li>
              <Link href="/returns" className="text-primary hover:underline">
                → Returns & Refunds Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-primary hover:underline">
                → Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
