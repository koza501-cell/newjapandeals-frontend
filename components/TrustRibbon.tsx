// Server component — no 'use client' needed

const PILLS = [
  { emoji: '🇯🇵', text: 'Direct from Japan' },
  { emoji: '📦', text: 'Ships in 48h' },
  { emoji: '💰', text: 'Zero Proxy Fees' },
  { emoji: '⭐', text: '10+ Years Trusted' },
  { emoji: '🔒', text: 'Secure Payment' },
  { emoji: '🌍', text: 'Ships to 32 Countries' },
  { emoji: '✅', text: 'Expert Inspected' },
  { emoji: '📜', text: 'Licensed Dealer Since 2014' },
];

export default function TrustRibbon() {
  return (
    <div
      className="bg-[#1A1A1A] overflow-hidden"
      style={{ height: '28px' }}
    >
      {/* aria-hidden: purely decorative, info duplicated in footer/header badge */}
      <div className="trust-marquee flex items-center h-full" aria-hidden="true">
        {/* Duplicate for seamless infinite scroll */}
        {[...PILLS, ...PILLS].map((pill, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 whitespace-nowrap px-4 text-[11px] font-medium text-gray-300"
          >
            <span>{pill.emoji}</span>
            <span>{pill.text}</span>
            <span className="text-gray-600 pl-3">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
