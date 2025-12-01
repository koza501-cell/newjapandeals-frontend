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

interface ShippingCalculatorProps {
  productId?: number;
  productWeight?: number;
  onSelectMethod?: (method: ShippingRate) => void;
  showTitle?: boolean;
}

const API_URL = 'https://api.newjapandeals.com/shipping.php';

export default function ShippingCalculator({ 
  productId, 
  productWeight,
  onSelectMethod,
  showTitle = true 
}: ShippingCalculatorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [weightGrams, setWeightGrams] = useState<number>(productWeight || 0);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [zoneInfo, setZoneInfo] = useState<string>('');

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Calculate rates when country or weight changes
  useEffect(() => {
    if (selectedCountry) {
      if (productId) {
        fetchProductRates();
      } else if (weightGrams > 0) {
        calculateRates();
      }
    }
  }, [selectedCountry, weightGrams, productId]);

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

  const fetchProductRates = async () => {
    if (!productId || !selectedCountry) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${API_URL}?action=product&product_id=${productId}&country=${selectedCountry}`
      );
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setRates([]);
      } else {
        setRates(data.rates || []);
        setZoneInfo(`Zone ${data.zone_number}`);
        if (data.product) {
          setWeightGrams(data.product.weight_grams);
        }
      }
    } catch (err) {
      setError('Failed to calculate shipping');
    } finally {
      setLoading(false);
    }
  };

  const calculateRates = async () => {
    if (!selectedCountry || weightGrams <= 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${API_URL}?action=calculate&weight=${weightGrams}&country=${selectedCountry}`
      );
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setRates([]);
      } else {
        setRates(data.rates || []);
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
      onSelectMethod(rate);
    }
  };

  const formatPrice = (jpy: number) => {
    const usd = Math.round(jpy / 150);
    return `¥${jpy.toLocaleString()} (~$${usd})`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {showTitle && (
        <h3 className="text-lg font-semibold mb-4">Shipping Calculator</h3>
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

      {/* Weight Input (only if no productId) */}
      {!productId && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (grams):
          </label>
          <input
            type="number"
            value={weightGrams || ''}
            onChange={(e) => setWeightGrams(parseInt(e.target.value) || 0)}
            min="1"
            max="30000"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter weight in grams"
          />
        </div>
      )}

      {/* Zone Info */}
      {zoneInfo && (
        <div className="mb-4 text-sm text-gray-600">
          {zoneInfo} • {weightGrams}g
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
        </div>
      )}

      {/* No rates message */}
      {!loading && !error && selectedCountry && rates.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Select a country to see shipping options
        </div>
      )}
    </div>
  );
}
