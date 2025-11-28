'use client';

export default function TrustBar() {
  const trustItems = [
    { icon: '🇯🇵', text: 'Direct from Japan', mobileText: 'Direct' },
    { icon: '📦', text: 'Ships in 48 Hours', mobileText: '48h Ship' },
    { icon: '💰', text: 'No Proxy Fees', mobileText: 'No Fees' },
    { icon: '⭐', text: '10+ Years Trusted', mobileText: '10+ Years' },
    { icon: '🔒', text: 'Secure Payment', mobileText: 'Secure' },
  ];

  return (
    <div className="bg-[#1A1A1A] text-white py-3 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-4 md:gap-8 text-sm">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span className="text-base">{item.icon}</span>
              <span className="hidden md:inline text-gray-300">{item.text}</span>
              <span className="md:hidden text-gray-300 text-xs">{item.mobileText}</span>
              {index < trustItems.length - 1 && (
                <span className="hidden md:inline text-gray-600 ml-4">│</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
