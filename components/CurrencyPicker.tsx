'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/context/CurrencyContext';

export default function CurrencyPicker() {
  const { currency, setCurrency, currencyInfo } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
        aria-label={`Currency: ${currencyInfo.name}. Click to change.`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span aria-hidden="true">{currencyInfo.flag}</span>
        <span>{currency}</span>
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select currency"
          className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50"
        >
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              role="option"
              aria-selected={currency === c.code}
              onClick={() => handleSelect(c.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors
                ${currency === c.code
                  ? 'text-[#B50012] font-semibold bg-red-50'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span aria-hidden="true">{c.flag}</span>
              <span className="flex-1">{c.code}</span>
              <span className="text-gray-400 text-xs">{c.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
