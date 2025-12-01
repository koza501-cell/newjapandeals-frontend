'use client';

import React, { useState, useEffect } from 'react';

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

interface Country {
  id: number;
  country_code: string;
  country_name: string;
  zone_id: number;
  zone_number: number;
  zone_name: string;
}

interface ProductDetail {
  id: number;
  title: string;
  weight_grams: number;
}

interface CombinedShippingCalculatorProps {
  productIds: number[];
  onSelectMethod?: (method: ShippingRate, totalWeight: number) => void;
}

const API_URL = 'https://api.newjapandeals.com/shipping.php';

export default function CombinedShippingCalculator({ 
  productIds,
  onSelectMethod
}: CombinedShippingCalculatorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [zoneInfo, setZoneInfo] = useState<string>('');

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Calculate combined rates when country or products change
  useEffect(() => {
    if (selectedCountry && productIds.length > 0) {
      calculateCombinedRates();
    }
  }, [selectedCountry, productIds]);

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${API_URL}?action=countries`);
      const data = await response.json();
      if (data.success) {
        setCountries(data.data);
      }
    } catch (err) {
      setError('Failed to load countries');
    }
  };

  const calculateCombinedRates = async () => {
    if (!selectedCountry || productIds.length === 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}?action=combined`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_ids: productIds,
          country: selectedCountry
        })
      });
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setRates([]);
        setProducts([]);
        setTotalWeight(0);
      } else {
        setRates(data.rates || []);
        setProducts(data.products || []);
        setTotalWeight(data.total_weight_grams || 0);
        setZoneInfo(`Zone ${data.zone_number}`);
      }
    } catch (err) {
      setError('Failed to calculate shipping');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRate = (rate: ShippingRate) => {
    setSelectedRate(rate);
    if (onSelectMethod) {
      onSelectMethod(rate, totalWeight);
    }
  };

  const formatPrice = (jpy: number) => {
    const usd = Math.round(jpy / 150);
    return `¥${jpy.toLocaleString()} (~$${usd})`;
  };

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)}kg`;
    }
    return `${grams}g`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Combined Shipping</h3>
      
      {/* Product Summary */}
      {products.length > 0 && (
        <div className="mb-4 bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">
            {products.length} item{products.length > 1 ? 's' : ''} in shipment:
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {products.map((product) => (
              <li key={product.id} className="flex justify-between">
                <span className="truncate mr-2">{product.title}</span>
                <span className="text-gray-500 whitespace-nowrap">
                  {formatWeight(product.weight_grams)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between font-medium">
            <span>Total Weight:</span>
            <span>{formatWeight(totalWeight)}</span>
          </div>
        </div>
      )}

      {/* Country Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ship to:
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country.country_code} value={country.country_code}>
              {country.country_name}
            </option>
          ))}
        </select>
      </div>

      {/* Zone Info */}
      {zoneInfo && (
        <div className="mb-4 text-sm text-gray-600">
          {zoneInfo}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Calculating...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Rates */}
      {!loading && rates.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Shipping Options:
          </div>
          {rates.map((rate) => (
            <label
              key={rate.method_id}
              className={`block border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedRate?.method_id === rate.method_id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  name="shipping_method"
                  checked={selectedRate?.method_id === rate.method_id}
                  onChange={() => handleSelectRate(rate)}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{rate.method_name}</span>
                      <div className="text-sm text-gray-600">
                        {rate.estimated_days_min}-{rate.estimated_days_max} days
                      </div>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {formatPrice(rate.total_price_jpy)}
                    </span>
                  </div>
                  <div className="mt-1 flex gap-2 text-xs">
                    {rate.has_tracking && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Tracking
                      </span>
                    )}
                    {rate.has_insurance && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Insured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </label>
          ))}
          
          {/* Savings Note */}
          <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm text-green-700">
            💡 Combined shipping saves money! Ship multiple items together for the best rates.
          </div>
        </div>
      )}

      {/* No products message */}
      {productIds.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Add items to your cart to calculate shipping
        </div>
      )}
    </div>
  );
}
