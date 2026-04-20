'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 'JPY' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'SGD' | 'HKD';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen',        flag: '🇯🇵' },
  { code: 'USD', symbol: '$',   name: 'US Dollar',            flag: '🇺🇸' },
  { code: 'EUR', symbol: '€',   name: 'Euro',                 flag: '🇪🇺' },
  { code: 'GBP', symbol: '£',   name: 'British Pound',        flag: '🇬🇧' },
  { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar',    flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$',  name: 'Canadian Dollar',      flag: '🇨🇦' },
  { code: 'SGD', symbol: 'S$',  name: 'Singapore Dollar',     flag: '🇸🇬' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar',     flag: '🇭🇰' },
];

// CF-IPCountry / ISO 3166-1 alpha-2 → default currency
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  US: 'USD', CA: 'CAD', GB: 'GBP',
  AU: 'AUD', NZ: 'AUD',
  SG: 'SGD', HK: 'HKD', JP: 'JPY',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR',
  GR: 'EUR', LU: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR',
  LV: 'EUR', LT: 'EUR', MT: 'EUR', CY: 'EUR',
};

const RATES_CACHE_KEY = 'njd_exchange_rates';
const CURRENCY_KEY    = 'njd_currency';

interface RatesCache {
  rates: Record<string, number>; // foreign-currency units per 1 JPY
  fetchedAt: number;
}

interface CurrencyContextType {
  currency:     CurrencyCode;
  setCurrency:  (code: CurrencyCode) => void;
  rates:        Record<string, number>;
  convert:      (amountJpy: number) => number;
  format:       (amountJpy: number) => string;
  currencyInfo: CurrencyInfo;
}

// Approximate fallback rates (JPY base) — replaced by live fetch on mount
const DEFAULT_RATES: Record<string, number> = {
  JPY: 1, USD: 0.0067, EUR: 0.0061, GBP: 0.0053,
  AUD: 0.0102, CAD: 0.0091, SGD: 0.009, HKD: 0.052,
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency:     'JPY',
  setCurrency:  () => {},
  rates:        DEFAULT_RATES,
  convert:      (n) => n,
  format:       (n) => `¥${n.toLocaleString()}`,
  currencyInfo: CURRENCIES[0],
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('JPY');
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);

  useEffect(() => {
    // 1. Restore previously-saved currency preference
    const saved = localStorage.getItem(CURRENCY_KEY) as CurrencyCode | null;
    if (saved && CURRENCIES.some(c => c.code === saved)) {
      setCurrencyState(saved);
    } else {
      // 2. Auto-detect from IP
      fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then((data: { country_code?: string }) => {
          const detected = data.country_code
            ? COUNTRY_TO_CURRENCY[data.country_code]
            : undefined;
          if (detected) setCurrencyState(detected);
        })
        .catch(() => {});
    }

    // 3. Load cached exchange rates (6-hour TTL, matches /api/fx ISR)
    try {
      const cached = localStorage.getItem(RATES_CACHE_KEY);
      if (cached) {
        const parsed: RatesCache = JSON.parse(cached);
        if (Date.now() - parsed.fetchedAt < 6 * 60 * 60 * 1000) {
          setRates({ JPY: 1, ...parsed.rates });
          return;
        }
      }
    } catch {}

    // 4. Fetch fresh rates via our server-side ISR endpoint (/api/fx)
    fetch('/api/fx')
      .then(r => r.json())
      .then((data: { base?: string; rates?: Record<string, number> }) => {
        if (data.rates) {
          setRates(data.rates); // already includes JPY: 1
          // Cache without JPY to match restore logic
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { JPY: _jpy, ...withoutJpy } = data.rates;
          localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({
            rates: withoutJpy,
            fetchedAt: Date.now(),
          } satisfies RatesCache));
        }
      })
      .catch(() => {}); // keep defaults on network failure
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try { localStorage.setItem(CURRENCY_KEY, code); } catch {}
  };

  const convert = (amountJpy: number): number => {
    if (currency === 'JPY') return Math.round(amountJpy);
    const rate = rates[currency] ?? DEFAULT_RATES[currency] ?? 1;
    return Math.round(amountJpy * rate * 100) / 100;
  };

  const format = (amountJpy: number): string => {
    const info = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0];
    const amount = convert(amountJpy);
    if (currency === 'JPY') return `¥${amount.toLocaleString()}`;
    return `${info.symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const currencyInfo = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0];

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, format, currencyInfo }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  return useContext(CurrencyContext);
}
