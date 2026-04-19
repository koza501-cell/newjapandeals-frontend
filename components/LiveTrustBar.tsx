'use client';

import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import useSWR from 'swr';
import type { TrustStats } from '@/app/api/trust-stats/route';

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
  fallbackData?: TrustStats;
}

// ── Constants ────────────────────────────────────────────────────────────────

const MERCARI_URL = 'https://jp.mercari.com';
const RAKUMA_URL  = 'https://rakuma.rakuten.co.jp';

// ── Helpers ──────────────────────────────────────────────────────────────────

const fetcher = (url: string) => fetch(url).then(r => { if (!r.ok) throw new Error('trust-stats fetch failed'); return r.json(); });

function trackClick(stat: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'trust_bar_click', { stat });
    }
  } catch { /* analytics must never throw */ }
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBar() {
  return (
    <section className="py-10 bg-[#FAFAF8]" aria-hidden="true">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 flex flex-col items-center gap-2">
              <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  stat:       string;
  icon:       string;
  iconLabel:  string;
  value:      number;
  decimals:   number;
  subtext?:   string;
  label:      string;
  href:       string;
  external?:  boolean;
  reduced:    boolean;
}

function StatCard({ stat, icon, iconLabel, value, decimals, subtext, label, href, external, reduced }: CardProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={() => trackClick(stat)}
      className="flex flex-col items-center text-center bg-white px-4 py-6 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B50012] focus-visible:ring-inset"
      aria-label={`${label}${subtext ? ` — ${subtext}` : ''}`}
    >
      {/* Icon */}
      <span
        className="text-2xl mb-2 leading-none"
        role="img"
        aria-label={iconLabel}
      >
        {icon}
      </span>

      {/* Big animated number */}
      <div
        className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-none mb-1 tabular-nums"
        aria-hidden="true"
      >
        {reduced ? (
          decimals > 0 ? value.toFixed(decimals) : value.toLocaleString()
        ) : (
          <CountUp
            end={value}
            decimals={decimals}
            duration={1.5}
            separator=","
            enableScrollSpy
            scrollSpyDelay={0}
            scrollSpyOnce
          />
        )}
      </div>

      {/* Sub-text (e.g. review count) */}
      {subtext && (
        <div className="text-xs text-gray-400 mb-1.5" aria-hidden="true">
          {subtext}
        </div>
      )}

      {/* Label */}
      <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
        {label}
      </div>
    </a>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function LiveTrustBar({ fallbackData }: Props) {
  const { data, isLoading } = useSWR<TrustStats>(
    '/api/trust-stats',
    fetcher,
    {
      fallbackData,
      revalidateOnFocus: false,
      refreshInterval:   3_600_000, // 1 hour
      onErrorRetry:      () => {},   // silent fail — never show zeros
    }
  );

  // Detect prefers-reduced-motion client-side (SSR-safe default: false → show anim)
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Show skeleton when loading and no fallback data available
  if (isLoading && !fallbackData) return <SkeletonBar />;

  const stats = data ?? fallbackData;
  if (!stats) return <SkeletonBar />;

  const cards: CardProps[] = [
    {
      stat:      'mercari',
      icon:      '⭐',
      iconLabel: 'Star rating',
      value:     parseFloat(stats.mercari_rating),
      decimals:  1,
      subtext:   `${stats.mercari_review_count.toLocaleString()} reviews`,
      label:     'Mercari Japan',
      href:      MERCARI_URL,
      external:  true,
      reduced,
    },
    {
      stat:      'rakuma',
      icon:      '⭐',
      iconLabel: 'Star rating',
      value:     parseFloat(stats.rakuma_rating),
      decimals:  1,
      subtext:   `${stats.rakuma_review_count.toLocaleString()} reviews`,
      label:     'Rakuma',
      href:      RAKUMA_URL,
      external:  true,
      reduced,
    },
    {
      stat:      'shipped',
      icon:      '🚚',
      iconLabel: 'Delivery truck',
      value:     stats.shipped_2025,
      decimals:  0,
      label:     'Watches Shipped in 2025',
      href:      '/about',
      external:  false,
      reduced,
    },
    {
      stat:      'countries',
      icon:      '🌍',
      iconLabel: 'Globe',
      value:     stats.countries_shipped,
      decimals:  0,
      label:     'Countries Shipped To',
      href:      '/shipping-policy',
      external:  false,
      reduced,
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-10 bg-[#FAFAF8]"
      aria-label="Trust statistics"
    >
      {/* Asanoha pattern background — very low opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:    'url(/patterns/asanoha.svg)',
          backgroundSize:     '60px 60px',
          backgroundRepeat:   'repeat',
          opacity:            0.035,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4">
        {/* Divider grid: gap-px on bg-gray-200 creates 1px dividers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {cards.map(card => (
            <StatCard key={card.stat} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
