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

  // Calculate insurance cost (Japan Post cost x 2)
  const getInsuranceCost = () => {
    if (!selectedShipping?.has_insurance) return 0;
    const subtotal = getSubtotal();
    // Japan Post: ¥50 per ¥20,000 coverage, first ¥20,000 free for EMS
    // Simplified: estimate based on value
    const japanPostInsurance = Math.ceil(subtotal / 20000) * 50;
    return japanPostInsurance * 2; // NJD charges 2x
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

    // TODO: Implement payment processing (Stripe/PayPal)
    // For now, just show a placeholder
    alert('Payment integration coming soon! Order data collected successfully.');
    
    setIsSubmitting(false);
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
                    <h2 className="font-bold text-lg mb-4">Optional Insurance</h2>
                    <label className="flex items-start gap-4 cursor-pointer p-4 rounded-lg border-2 transition-colors hover:border-[#B50012] ${addInsurance ? 'border-[#B50012] bg-red-50' : 'border-gray-200'}">
                      <input
                        type="checkbox"
                        checked={addInsurance}
                        onChange={(e) => setAddInsurance(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-[#B50012] focus:ring-[#B50012]"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">Add Shipping Insurance</div>
                            <div className="text-sm text-gray-500 mt-1">
                              Protect your purchase against loss or damage during transit.
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#B50012]">{formatPrice(getInsuranceCost())}</div>
                            <div className="text-xs text-gray-500">{formatPriceUSD(getInsuranceCost())}</div>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500 space-y-1">
                          <div>✓ Coverage for lost packages</div>
                          <div>✓ Coverage for visible transit damage</div>
                          <div>✓ We file claims on your behalf</div>
                        </div>
                      </div>
                    </label>
                    <p className="text-xs text-gray-400 mt-3">
                      Insurance is processed through Japan Post. See <Link href="/terms#insurance" className="text-[#B50012] underline">insurance terms</Link> for details.
                    </p>
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
                        Processing...
                      </span>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>

                  {/* Payment Methods Preview */}
                  <div className="mt-4 flex justify-center gap-2">
                    <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-600">Visa</div>
                    <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-600">Mastercard</div>
                    <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-600">PayPal</div>
                  </div>

                  {/* Trust Points */}
                  <div className="mt-4 pt-4 border-t space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">🔒</span> SSL Encrypted
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Ships from Japan
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Licensed dealer
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
