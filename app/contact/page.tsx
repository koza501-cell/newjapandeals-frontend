'use client';

import { useState } from 'react';
import TrustBar from '@/components/TrustBar';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    orderNumber: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    // For now, open email client with pre-filled data
    const mailtoLink = `mailto:yamadatrade11@gmail.com?subject=${encodeURIComponent(formData.subject || 'Inquiry from New Japan Deals')}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nOrder Number: ${formData.orderNumber || 'N/A'}\n\nMessage:\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    setStatus('sent');
    
    // Reset form after delay
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', orderNumber: '', message: '' });
      setStatus('idle');
    }, 3000);
  };

  return (
    <main>
      <TrustBar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Contact Us
          </h1>
          <p className="text-gray-400">We're here to help with any questions</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Get in Touch
                </h2>
                <p className="text-gray-700 mb-8">
                  Have questions about a product, your order, or shipping? We're happy to help! Contact us using the form or email us directly.
                </p>

                {/* Contact Details */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#B50012]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <a href="mailto:yamadatrade11@gmail.com" className="text-[#B50012] hover:underline">
                        yamadatrade11@gmail.com
                      </a>
                      <p className="text-gray-500 text-sm mt-1">We respond within 24-48 business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#B50012]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🕐</span>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Business Hours</h3>
                      <p className="text-gray-700">Monday - Friday</p>
                      <p className="text-gray-700">9:00 AM - 5:00 PM (Japan Time)</p>
                      <p className="text-gray-500 text-sm mt-1">Closed weekends & Japanese holidays</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#B50012]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🇯🇵</span>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Location</h3>
                      <p className="text-gray-700">Chiba Prefecture, Japan</p>
                      <p className="text-gray-500 text-sm mt-1">Yamada Trade LLC (合同会社山田トレード)</p>
                    </div>
                  </div>
                </div>

                {/* FAQ Link */}
                <div className="bg-[#F5F5F0] p-6 rounded-xl">
                  <h3 className="font-bold mb-2">Looking for Quick Answers?</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Check our FAQ page for answers to common questions about ordering, shipping, and returns.
                  </p>
                  <a href="/faq" className="text-[#B50012] font-medium hover:underline">
                    Visit FAQ Page →
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <div className="bg-white border rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-6">Send us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B50012] focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B50012] focus:border-transparent"
                        placeholder="you@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B50012] focus:border-transparent"
                      >
                        <option value="">Select a topic...</option>
                        <option value="Product Question">Product Question</option>
                        <option value="Order Status">Order Status</option>
                        <option value="Shipping Inquiry">Shipping Inquiry</option>
                        <option value="Bundle Discount">Bundle / Discount Request</option>
                        <option value="Return/Refund">Return / Refund</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Number (if applicable)
                      </label>
                      <input
                        type="text"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B50012] focus:border-transparent"
                        placeholder="NJD-XXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B50012] focus:border-transparent resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full bg-[#B50012] text-white py-3 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {status === 'sending' ? 'Opening Email...' : status === 'sent' ? '✓ Email Client Opened' : 'Send Message'}
                    </button>
                  </form>

                  {status === 'sent' && (
                    <p className="text-green-600 text-sm text-center mt-4">
                      Your email client should open. Please send the email to complete your message.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-xl text-center">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-bold mb-2">Product Questions</h3>
                <p className="text-gray-600 text-sm">
                  Ask about condition, measurements, or request additional photos before buying.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl text-center">
                <div className="text-3xl mb-3">📦</div>
                <h3 className="font-bold mb-2">Bundle Deals</h3>
                <p className="text-gray-600 text-sm">
                  Buying multiple items? Contact us for combined shipping discounts.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-bold mb-2">Special Requests</h3>
                <p className="text-gray-600 text-sm">
                  Looking for something specific? Let us know and we'll try to help.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
