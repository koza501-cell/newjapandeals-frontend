'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CheckoutAgreement from '@/components/CheckoutAgreement';
import TrustBar from '@/components/TrustBar';

interface Country {
  country_code: string;
  country_name: string;
}

const API_URL = 'https://api.newjapandeals.com';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Sa5rbRkmKfqHOdmuUOdCIkUKXrFxMORpYybirfNhDz9N44EsbMeZSJ77e545vZJ7xrVPIbrE9HURscAXhT580WB00NxaJ1Vs3';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    getSubtotal,
    getHandlingFee,
    selectedShipping,
    selectedCountry,
    getTotal,
  } = useCart();

  const [countries, setCountries] = useState<Country[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Shipping address
  const [shippingAddress, setShippingAddress] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch countries for dropdown
  useEffect(() => {
    fetchCountries();
  }, []);

  // Set country from cart selection
  useEffect(() => {
    if (selectedCountry) {
      setShippingAddress(prev => ({ ...prev, country: selectedCountry }));
    }
  }, [selectedCountry]);

  // Redirect if cart is empty or no shipping selected
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const fetchCountries = async () => {
    try {
      const res = await fetch(`${API_URL}/shipping.php?action=countries`);
      const data = await res.json();
      if (data.success) {
        setCountries(data.data);
      }
    } catch (err) {
      console.error('Failed to load countries:', err);
    }
  };

  // Calculate insurance cost (Actual Japan Post cost only)
  const getInsuranceCost = () => {
    if (!selectedShipping?.has_insurance) return 0;
    const subtotal = getSubtotal();
    
    // Japan Post EMS: First ¥20,000 FREE, then ¥50 per additional ¥20,000
    if (subtotal <= 20000) {
      return 0; // Free coverage for first ¥20,000
    }
    
    // Calculate for amount above ¥20,000
    const amountAboveFree = subtotal - 20000;
    const japanPostCost = Math.ceil(amountAboveFree / 20000) * 50;
    return japanPostCost;
  };

  const insuranceCost = addInsurance ? getInsuranceCost() : 0;
  const finalTotal = getTotal() + insuranceCost;

  const formatPrice = (jpy: number) => `¥${jpy.toLocaleString()}`;
  const formatPriceUSD = (jpy: number) => `~$${Math.round(jpy / 150).toLocaleString()}`;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Customer info validation
    if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone number is required';

    // Shipping address validation
    if (!shippingAddress.address1.trim()) newErrors.address1 = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!shippingAddress.country) newErrors.country = 'Country is required';

    // Terms agreement
    if (!agreedToTerms) newErrors.terms = 'You must agree to all terms';

    // Shipping method
    if (!selectedShipping) newErrors.shipping = 'Please select a shipping method in cart';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.text-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setPaymentError('');

    try {
      // Prepare order data for Stripe
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          brand: item.brand,
          model: item.model,
          price_jpy: item.price_jpy,
          image: item.image
        })),
        customer: customerInfo,
        shipping: shippingAddress,
        shipping_method: {
          name: selectedShipping?.method_name,
          id: selectedShipping?.method_id
        },
        totals: {
          subtotal: getSubtotal(),
          handling: getHandlingFee(),
          shipping: selectedShipping?.total_price_jpy || 0,
          insurance: insuranceCost,
          total: finalTotal
        }
      };

      // Create Stripe Checkout Session
      const response = await fetch(`${API_URL}/api/create-checkout-session.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setPaymentError(data.error || 'Failed to create checkout session. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentError('Connection error. Please check your internet and try again.');
      setIsSubmitting(false);
    }
  };

  // If no items or no shipping, show message
  if (items.length === 0 || !selectedShipping) {
    return (
      <main>
        <TrustBar />
        <div className="bg-[#F5F5F0] min-h-screen py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-lg p-8">
              <div className="text-5xl mb-4">🛒</div>
              <h1 className="text-xl font-bold mb-4">Cannot Proceed to Checkout</h1>
              <p className="text-gray-600 mb-6">
                {items.length === 0 
                  ? 'Your cart is empty.' 
                  : 'Please select a shipping method in your cart first.'}
              </p>
              <Link
                href="/cart"
                className="inline-block bg-[#B50012] hover:bg-[#9A0010] text-white px-6 py-3 rounded-lg font-medium"
              >
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <TrustBar />
      <div className="bg-[#F5F5F0] min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/cart" className="text-[#B50012] hover:underline text-sm">
              ← Back to Cart
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Checkout
            </h1>
          </div>

          {/* Payment Error Alert */}
          {paymentError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-700">
                <span className="text-xl">⚠️</span>
                <span className="font-medium">{paymentError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Forms */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Customer Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="font-bold text-lg mb-4">Customer Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012] ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012] ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012] ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012] ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012] ${
                          errors.country ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select country</option>
                        {countries.map(country => (
                          <option key={country.country_code} value={country.country_code}>
                            {country.country_name}
                          </option>
                        ))}
                      </select>
                      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                      {shippingAddress.country && shippingAddress.country !== selectedCountry && (
                        <p className="text-yellow-600 text-xs mt-1">
                          ⚠️ This differs from shipping country selected in cart. Shipping cost may change.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.address1}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address1: e.target.value })}
                        placeholder="Street address, P.O. box"
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012] ${
                          errors.address1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.address1 && <p className="text-red-500 text-xs mt-1">{errors.address1}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.address2}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012]"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012] ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State / Province
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012] ${
                            errors.postalCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Insurance */}
                {selectedShipping?.has_insurance && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="font-bold text-lg mb-4">Shipping Insurance</h2>
                    
                    {getInsuranceCost() === 0 ? (
                      // Free insurance for items under ¥20,000
                      <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
                        <div className="flex items-center gap-2 text-green-700 font-medium">
                          <span>✓</span> Basic Insurance Included FREE
                        </div>
                        <p className="text-sm text-green-600 mt-2">
                          Japan Post EMS includes free coverage up to ¥20,000.
                        </p>
                      </div>
                    ) : (
                      // Paid insurance for items over ¥20,000
                      <label className={`flex items-start gap-4 cursor-pointer p-4 rounded-lg border-2 transition-colors hover:border-[#B50012] ${addInsurance ? 'border-[#B50012] bg-red-50' : 'border-gray-200'}`}>
                        <input
                          type="checkbox"
                          checked={addInsurance}
                          onChange={(e) => setAddInsurance(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#B50012] focus:ring-[#B50012]"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">Add Full Insurance Coverage</div>
                              <div className="text-sm text-gray-500 mt-1">
                                Protect your purchase against loss or damage during transit.
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-[#B50012]">{formatPrice(getInsuranceCost())}</div>
                              <div className="text-xs text-gray-500">Japan Post fee</div>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-gray-500 space-y-1">
                            <div>✓ Coverage for lost packages</div>
                            <div>✓ Coverage for visible transit damage</div>
                            <div>✓ We file claims on your behalf</div>
                          </div>
                        </div>
                      </label>
                    )}
                    
                    {/* Important Notice */}
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>Important:</strong> If a claim is successful, a <strong>25% processing fee</strong> will be deducted from the claim payout. 
                        This covers claim filing, communication with Japan Post, and paperwork handling.
                        <br /><br />
                        <strong>Want to keep 100%?</strong> You may file the claim directly with Japan Post yourself (requires Japanese language and documentation).
                      </p>
                    </div>
                    
                    {!addInsurance && getInsuranceCost() > 0 && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-700">
                          <strong>⚠️ Without insurance:</strong> No refund is possible for lost or damaged packages. You accept full risk.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Terms & Agreements */}
                <CheckoutAgreement 
                  hasInsurance={addInsurance}
                  onAgreementChange={setAgreedToTerms}
                />
                {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                  <h2 className="font-bold text-lg mb-4">Order Summary</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">⌚</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.brand} {item.model}</div>
                          <div className="text-sm text-gray-500">{formatPrice(item.price_jpy)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Method */}
                  <div className="border-t pt-4 mb-4">
                    <div className="text-sm text-gray-500">Shipping Method</div>
                    <div className="font-medium">{selectedShipping.method_name}</div>
                    <div className="text-xs text-gray-400">
                      {selectedShipping.estimated_days_min}-{selectedShipping.estimated_days_max} business days
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({items.length} items)</span>
                      <span>{formatPrice(getSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Handling (10%)</span>
                      <span>{formatPrice(getHandlingFee())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{formatPrice(selectedShipping.total_price_jpy)}</span>
                    </div>
                    {addInsurance && (
                      <div className="flex justify-between text-green-600">
                        <span>Insurance</span>
                        <span>{formatPrice(insuranceCost)}</span>
                      </div>
                    )}
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#B50012]">{formatPrice(finalTotal)}</span>
                    </div>
                    <div className="text-right text-gray-500 text-xs">
                      {formatPriceUSD(finalTotal)} USD
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!agreedToTerms || isSubmitting}
                    className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
                      agreedToTerms && !isSubmitting
                        ? 'bg-[#B50012] hover:bg-[#9A0010] text-white shadow-lg hover:scale-[1.02]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Redirecting to Payment...
                      </span>
                    ) : (
                      'Pay with Card'
                    )}
                  </button>

                  {/* Stripe Badge */}
                  <div className="mt-4 flex justify-center items-center gap-2">
                    <span className="text-xs text-gray-400">Powered by</span>
                    <svg className="h-6" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#635BFF" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.2 10.2 0 0 1-4.56 1.02c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.56zm-6-5.73c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zm-9.93-.34v12h-4.08V8.21h4.08zm0-4.5v3.04h-4.08V3.71h4.08zm-6.77 4.5L32.65 14l4.36 6.21H32.4l-2.94-4.5-2.94 4.5h-4.6l4.36-6.21-4.18-5.79h4.6l2.74 4.1 2.72-4.1h4.59zM18.54 20.21h-4.08V8.21h4.08v12zm0-13.5h-4.08V3.71h4.08v3zm-6.77-3v16.5h-4.1v-1.4c-.78.94-2.1 1.64-3.87 1.64-3.67 0-6.2-2.99-6.2-6.81 0-3.87 2.51-6.81 6.24-6.81 1.71 0 2.99.66 3.83 1.56V3.71h4.1zm-6.24 13.3c1.6 0 2.74-1.26 2.74-3.17 0-1.93-1.15-3.14-2.74-3.14-1.6 0-2.72 1.21-2.72 3.14 0 1.91 1.12 3.17 2.72 3.17z"/>
                    </svg>
                  </div>

                  {/* Payment Methods Preview */}
                  <div className="mt-3 flex justify-center gap-2">
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">Visa</div>
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">Mastercard</div>
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">Amex</div>
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">JCB</div>
                  </div>

                  {/* Trust Points */}
                  <div className="mt-4 pt-4 border-t space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">🔒</span> SSL Encrypted & Secure
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Ships from Japan
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Licensed dealer (古物商許可)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
