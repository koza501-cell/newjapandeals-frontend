'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CheckoutAgreementProps {
  hasInsurance: boolean;
  onAgreementChange: (allAgreed: boolean) => void;
}

export default function CheckoutAgreement({ hasInsurance, onAgreementChange }: CheckoutAgreementProps) {
  const [agreements, setAgreements] = useState({
    terms: false,
    noReturns: false,
    customs: false,
    shipping: false,
    insurance: false, // Only required if hasInsurance is true
  });

  const handleChange = (key: keyof typeof agreements) => {
    const newAgreements = { ...agreements, [key]: !agreements[key] };
    setAgreements(newAgreements);
    
    // Check if all required agreements are checked
    const requiredAgreed = 
      newAgreements.terms && 
      newAgreements.noReturns && 
      newAgreements.customs && 
      newAgreements.shipping &&
      (hasInsurance ? newAgreements.insurance : true);
    
    onAgreementChange(requiredAgreed);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="font-bold text-lg text-gray-800">Terms & Agreements</h3>
      <p className="text-sm text-gray-500">Please read and accept all terms before proceeding to payment.</p>

      {/* Terms & Conditions */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreements.terms}
          onChange={() => handleChange('terms')}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#B50012] focus:ring-[#B50012]"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          I have read and agree to the{' '}
          <Link href="/terms" target="_blank" className="text-[#B50012] underline hover:no-underline">
            Terms and Conditions
          </Link>
          , including all policies regarding shipping, liability, and governing law.
        </span>
      </label>

      {/* No Returns Policy */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreements.noReturns}
          onChange={() => handleChange('noReturns')}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#B50012] focus:ring-[#B50012]"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          <strong>I understand that ALL SALES ARE FINAL.</strong> Returns are not accepted. I have reviewed all product images and descriptions carefully before purchasing.
        </span>
      </label>

      {/* Customs & Duties */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreements.customs}
          onChange={() => handleChange('customs')}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#B50012] focus:ring-[#B50012]"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          I understand that <strong>I am responsible for all customs duties, import taxes, VAT, and brokerage fees</strong> in my country. These are NOT included in the purchase price. If I refuse delivery due to customs fees, no refund will be provided.
        </span>
      </label>

      {/* Shipping Terms - Japan Post */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreements.shipping}
          onChange={() => handleChange('shipping')}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#B50012] focus:ring-[#B50012]"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          I understand that shipments are handled by <strong>Japan Post</strong>. Delivery times are estimates only and not guaranteed. 
          Risk of loss transfers when the package is handed to Japan Post. 
          Without insurance, no refund is provided for lost or damaged packages.
          {' '}
          <Link href="https://www.post.japanpost.jp/int/service/damage_en.html" target="_blank" className="text-[#B50012] underline hover:no-underline">
            Japan Post Terms
          </Link>
        </span>
      </label>

      {/* Insurance Terms - Only shown if insurance is selected */}
      {hasInsurance && (
        <label className="flex items-start gap-3 cursor-pointer group bg-blue-50 p-3 rounded-lg border border-blue-200">
          <input
            type="checkbox"
            checked={agreements.insurance}
            onChange={() => handleChange('insurance')}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-[#B50012] focus:ring-[#B50012]"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            <strong>Insurance Agreement:</strong> I understand that insurance claims are processed by Japan Post and may take 30-90 days. 
            If the claim is approved, <strong>25% will be retained as a processing fee</strong> and I will receive 75% of the claim amount.
            Insurance does NOT cover: items with no visible package damage, customs seizure, delivery delays, buyer's remorse, or pre-existing product conditions.
            I may file claims directly with Japan Post myself to receive 100%.
            {' '}
            <Link href="/terms#insurance" target="_blank" className="text-[#B50012] underline hover:no-underline">
              Full Insurance Terms
            </Link>
          </span>
        </label>
      )}

      {/* Summary */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          {agreements.terms && agreements.noReturns && agreements.customs && agreements.shipping && (hasInsurance ? agreements.insurance : true) ? (
            <>
              <span className="text-green-500 text-lg">✓</span>
              <span className="text-green-700 font-medium">All agreements accepted</span>
            </>
          ) : (
            <>
              <span className="text-yellow-500 text-lg">⚠</span>
              <span className="text-yellow-700">Please accept all agreements to continue</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
