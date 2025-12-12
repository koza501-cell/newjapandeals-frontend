'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import TrustBar from '@/components/TrustBar';

interface Country {
  country_code: string;
  country_name: string;
  zone_id: number;
  zone_number: number;
}

interface ShippingRate {
  method_id: number;
  method_code: string;
  method_name: string;
  method_name_ja: string;
  weight_tier_grams: number;
  base_price_jpy: number;
  extra_charge_jpy: number;
  total_price_jpy: number;
  estimated_days_min: number;
  estimated_days_max: number;
  has_tracking: boolean;
  has_insurance: boolean;
  insurance_max_jpy: number;
}

const API_URL = 'https://api.newjapandeals.com';

export default function CartPage() {
  // Safe cart context access
  const cart = useCart();
  const items = cart?.items || [];
  const removeFromCart = cart?.removeFromCart;
  const clearCart = cart?.clearCart;
  const getItemCount = cart?.getItemCount || (() => 0);
  const getSubtotal = cart?.getSubtotal || (() => 0);
  const getHandlingFee = cart?.getHandlingFee || (() => 0);
  const selectedShipping = cart?.selectedShipping || null;
  const setSelectedShipping = cart?.setSelectedShipping;
  const selectedCountry = cart?.selectedCountry || '';
  const setSelectedCountry = cart?.setSelectedCountry;
  const getTotal = cart?.getTotal || (() => 0);

  const [countries, setCountries] = useState<Country[]>([]);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [error, setError] = useState('');

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Calculate shipping when country or items change
  useEffect(() => {
    if (selectedCountry && items.length > 0) {
      calculateCombinedShipping();
    } else {
      setShippingRates([]);
      if (setSelectedShipping) setSelectedShipping(null);
    }
  }, [selectedCountry, items.length]);

  const fetchCountries = async () => {
    try {
      const res = await fetch(`${API_URL}/shipping.php?action=countries`);
      const data = await res.json();
      if (data.success) {
        setCountries(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load countries:', err);
    }
  };

  const calculateCombinedShipping = async () => {
    if (!selectedCountry || items.length === 0) return;

    setLoadingRates(true);
    setError('');

    try {
      const productIds = items.map(item => item.id);
      const res = await fetch(`${API_URL}/shipping.php?action=combined`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: productIds,
          country: selectedCountry
        })
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setShippingRates([]);
      } else {
        setShippingRates(data.rates || []);
      }
    } catch (err) {
      setError('Failed to calculate shipping');
      setShippingRates([]);
    } finally {
      setLoadingRates(false);
    }
  };

  const formatPrice = (jpy: number) => {
    return `¥${jpy.toLocaleString()}`;
  };

  const formatPriceUSD = (jpy: number) => {
    const usd = Math.round(jpy / 150);
    return `~$${usd.toLocaleString()}`;
  };

  const handleRemoveItem = (id: number) => {
    if (removeFromCart) removeFromCart(id);
  };

  const handleClearCart = () => {
    if (clearCart) clearCart();
  };

  const handleCountryChange = (country: string) => {
    if (setSelectedCountry) setSelectedCountry(country);
  };

  const handleShippingSelect = (rate: ShippingRate) => {
    if (setSelectedShipping) setSelectedShipping(rate);
  };

  // Empty cart view
  if (items.length === 0) {
    return (
      <main>
        <TrustBar />
        <div className="bg-[#F5F5F0] min-h-screen py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-xl shadow-lg p-12">
                <div className="text-6xl mb-6">🛒</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">
                  Looks like you haven't added any watches to your cart yet.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-[#B50012] hover:bg-[#9A0010] text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse Watches
                </Link>
              </div>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shopping Cart ({getItemCount()} {getItemCount() === 1 ? 'item' : 'items'})
            </h1>
            <button
              onClick={handleClearCart}
              className="text-gray-500 hover:text-red-600 text-sm transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-4 flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                        ⌚
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          href={`/product/${item.slug}`}
                          className="font-medium text-gray-800 hover:text-[#B50012] transition-colors line-clamp-1"
                        >
                          {item.title || `${item.brand} ${item.model}`}
                        </Link>
                        <div className="text-sm text-gray-500">{item.brand}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.condition}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2 flex justify-between items-end">
                      <div className="text-xs text-gray-400">Qty: 1</div>
                      <div className="text-right">
                        <div className="font-bold text-[#B50012]">{formatPrice(item.price_jpy)}</div>
                        <div className="text-xs text-gray-500">{formatPriceUSD(item.price_jpy)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Combined Shipping Benefits */}
              {items.length > 1 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    <span>💡</span> Combined Shipping Saves Money!
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Ship {items.length} items together for one low shipping rate.
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>

                {/* Country Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ship to:
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B50012]"
                  >
                    <option value="">Select country</option>
                    {countries.map(country => (
                      <option key={country.country_code} value={country.country_code}>
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shipping Methods */}
                {selectedCountry && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Method:
                    </label>
                    
                    {loadingRates && (
                      <div className="text-center py-4">
                        <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#B50012] rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500 mt-2">Calculating...</p>
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-2">
                        {error}
                      </div>
                    )}

                    {!loadingRates && shippingRates.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {shippingRates.map(rate => (
                          <label
                            key={rate.method_id}
                            className={`block border rounded-lg p-3 cursor-pointer transition-colors ${
                              selectedShipping?.method_id === rate.method_id
                                ? 'border-[#B50012] bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start">
                              <input
                                type="radio"
                                name="shipping"
                                checked={selectedShipping?.method_id === rate.method_id}
                                onChange={() => handleShippingSelect(rate)}
                                className="mt-1 mr-2"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="font-medium text-sm">{rate.method_name}</span>
                                  <span className="font-bold text-[#B50012] text-sm">
                                    {formatPrice(rate.total_price_jpy)}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {rate.estimated_days_min}-{rate.estimated_days_max} days
                                  {rate.has_tracking && ' • Tracking'}
                                  {rate.has_insurance && ' • Insured'}
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Handling (10%)</span>
                    <span>{formatPrice(getHandlingFee())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {selectedShipping 
                        ? formatPrice(selectedShipping.total_price_jpy)
                        : selectedCountry ? 'Select method' : 'Select country'
                      }
                    </span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#B50012]">
                      {selectedShipping ? formatPrice(getTotal()) : '---'}
                    </span>
                  </div>
                  {selectedShipping && (
                    <div className="text-right text-gray-500 text-xs">
                      {formatPriceUSD(getTotal())} USD
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                {selectedShipping ? (
                  <Link
                    href="/checkout"
                    className="w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all bg-[#B50012] hover:bg-[#9A0010] text-white hover:scale-[1.02] shadow-lg block text-center"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full mt-6 py-4 rounded-xl font-bold text-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Select Shipping to Continue
                  </button>
                )}

                {/* Trust Points */}
                <div className="mt-4 pt-4 border-t space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Secure checkout
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Ships from Japan
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Expert packaging
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="text-[#B50012] hover:underline inline-flex items-center gap-2"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
