'use client';

import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import useSWR from 'swr';
import * as Popover from '@radix-ui/react-popover';
import type { TrustStats } from '@/app/api/trust-stats/route';

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
  fallbackData?: TrustStats;
}

// ── Analytics ────────────────────────────────────────────────────────────────

function trackClick(stat: 'mercari' | 'level' | 'shipped' | 'countries', account?: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'trust_bar_click', { stat, ...(account ? { account } : {}) });
    }
  } catch { /* analytics must never throw */ }
}

// ── Fetcher ───────────────────────────────────────────────────────────────────

const fetcher = (url: string) =>
  fetch(url).then(r => {
    if (!r.ok) throw new Error('trust-stats fetch failed');
    return r.json();
  });

// ── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBar() {
  return (
    <section className="py-10 bg-[#FAFAF8]" aria-hidden="true">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white px-4 py-6 flex flex-col items-center gap-2">
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

// ── Shared card shell ─────────────────────────────────────────────────────────

const cardClass =
  'flex flex-col items-center text-center bg-white px-4 py-6 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B50012] focus-visible:ring-inset w-full';

// ── Animated number ───────────────────────────────────────────────────────────

function AnimatedNumber({ value, decimals, reduced }: { value: number; decimals: number; reduced: boolean }) {
  return (
    <div className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-none mb-1 tabular-nums" aria-hidden="true">
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
  );
}

// ── Card 1 — Mercari (with popover) ──────────────────────────────────────────

function MercariCard({ stats, reduced }: { stats: TrustStats; reduced: boolean }) {
  const combined = stats?.mercari?.combined ?? { rating: 0, reviewCount: 0, accountCount: 0 };
  const accounts = stats?.mercari?.accounts ?? [];

  if (!combined.reviewCount) return <SkeletonCard />;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={cardClass}
          onClick={() => trackClick('mercari')}
          aria-label={`Mercari Japan — ${combined.rating} stars across ${combined.reviewCount.toLocaleString()} reviews — click for account details`}
        >
          <span className="text-2xl mb-2 leading-none" role="img" aria-label="Star rating">⭐</span>
          <AnimatedNumber value={combined.rating} decimals={1} reduced={reduced} />
          <div className="text-xs text-gray-400 mb-1.5" aria-hidden="true">
            {combined.reviewCount.toLocaleString()} reviews
          </div>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
            Mercari Japan
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">across 2 verified seller accounts</div>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-80 rounded-xl bg-white shadow-xl border border-gray-100 p-4 text-sm"
          sideOffset={8}
          align="center"
        >
          <Popover.Arrow className="fill-white" />

          <p className="text-gray-600 text-xs leading-relaxed mb-3">
            We operate two verified Mercari seller accounts. Both are owned by Yamada Trade LLC
            (合同会社山田トレード). Click an account to view its public Mercari profile and reviews.
          </p>

          <div className="space-y-2">
            {accounts.map(acc => (
              <a
                key={acc.name}
                href={acc.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('mercari', acc.name)}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 hover:bg-gray-50 transition-colors"
                aria-label={`${acc.name} — ${acc.rating} stars, ${acc.reviewCount.toLocaleString()} reviews`}
              >
                <span className="font-medium text-[#1A1A1A] truncate max-w-[140px]">{acc.name}</span>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  ★ {acc.rating.toFixed(1)} · {acc.reviewCount.toLocaleString()} reviews ↗
                </span>
              </a>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ── Card 2 — Level badge ──────────────────────────────────────────────────────

function LevelCard({ stats, reduced }: { stats: TrustStats; reduced: boolean }) {
  const seller = stats?.level?.seller ?? 0;
  const url    = stats?.level?.url    ?? 'https://jp.mercari.com';
  const isLevel = seller > 0;

  if (isLevel) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick('level')}
        className={cardClass}
        aria-label={`Level ${seller} Seller on Mercari — Top 1%`}
      >
        <span className="text-2xl mb-2 leading-none" role="img" aria-label="Trophy">🏆</span>
        <AnimatedNumber value={seller} decimals={0} reduced={reduced} />
        <div className="text-xs text-gray-400 mb-1.5" aria-hidden="true">Top 1% on Mercari</div>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
          Level {seller} Seller
        </div>
        <div className="text-[10px] text-gray-400 mt-0.5">Mercari's top seller tier</div>
      </a>
    );
  }

  // Opt-out fallback: identity-verified badge
  return (
    <a
      href={url || 'https://jp.mercari.com'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick('level')}
      className={cardClass}
      aria-label="Identity Verified Seller on Mercari"
    >
      <span className="text-2xl mb-2 leading-none" role="img" aria-label="Verified badge">✅</span>
      <div className="text-xl font-bold text-[#1A1A1A] leading-none mb-1">本人確認済</div>
      <div className="text-xs text-gray-400 mb-1.5" aria-hidden="true">Identity Verified</div>
      <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
        Verified Seller
      </div>
    </a>
  );
}

// ── Cards 3 & 4 — simple link cards ──────────────────────────────────────────

interface SimplCardProps {
  stat:      'shipped' | 'countries';
  icon:      string;
  iconLabel: string;
  value:     number;
  label:     string;
  subtext?:  string;
  href:      string;
  reduced:   boolean;
}

function SimpleCard({ stat, icon, iconLabel, value, label, subtext, href, reduced }: SimplCardProps) {
  if (!value) return <SkeletonCard />;
  return (
    <a
      href={href}
      onClick={() => trackClick(stat)}
      className={cardClass}
      aria-label={`${label}${subtext ? ` — ${subtext}` : ''}`}
    >
      <span className="text-2xl mb-2 leading-none" role="img" aria-label={iconLabel}>{icon}</span>
      <AnimatedNumber value={value} decimals={0} reduced={reduced} />
      {subtext && (
        <div className="text-xs text-gray-400 mb-1.5" aria-hidden="true">{subtext}</div>
      )}
      <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">{label}</div>
    </a>
  );
}

// ── Inline skeleton card (used when individual card data is missing) ───────────

function SkeletonCard() {
  return (
    <div className="bg-white px-4 py-6 flex flex-col items-center gap-2">
      <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
      <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
      <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

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

  if (isLoading && !fallbackData) return <SkeletonBar />;
  const stats = data ?? fallbackData;
  if (!stats) return <SkeletonBar />;

  return (
    <section
      className="relative overflow-hidden py-10 bg-[#FAFAF8]"
      aria-label="Trust statistics"
    >
      {/* Asanoha pattern background — very low opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:  'url(/patterns/asanoha.svg)',
          backgroundSize:   '60px 60px',
          backgroundRepeat: 'repeat',
          opacity:          0.035,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4">
        {/* gap-px on bg-gray-200 creates 1px dividers between cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <MercariCard stats={stats} reduced={reduced} />
          <LevelCard   stats={stats} reduced={reduced} />
          <SimpleCard
            stat="shipped"
            icon="🚚"
            iconLabel="Delivery truck"
            value={stats?.shipped2025 ?? 0}
            label="Watches Shipped in 2025"
            href="/about"
            reduced={reduced}
          />
          <SimpleCard
            stat="countries"
            icon="🌍"
            iconLabel="Globe"
            value={stats?.countries ?? 0}
            label="Countries Shipped To"
            href="/shipping-policy"
            reduced={reduced}
          />
        </div>
      </div>
    </section>
  );
}
