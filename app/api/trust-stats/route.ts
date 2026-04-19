import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { MercariAccount, TrustStats } from './types';
import { getScraperCache, CACHE_TTL_MS } from './scraper-cache';
import { TrustStatsDataSchema } from './schema';

export type { TrustStats } from './types';

export const dynamic  = 'force-dynamic';
export const revalidate = 0;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function weightedRating(accounts: MercariAccount[]): number {
  const totalCount = accounts.reduce((s, a) => s + a.reviewCount, 0);
  if (totalCount === 0) return 0;
  const weighted = accounts.reduce((s, a) => s + a.rating * a.reviewCount, 0);
  return Math.round((weighted / totalCount) * 10) / 10;
}

function levelUrl(accounts: MercariAccount[], levelAccount: string): string {
  return accounts.find(a => a.name === levelAccount)?.url ?? accounts[0]?.url ?? 'https://jp.mercari.com';
}

function validateOrWarn(data: unknown, label: string): ReturnType<typeof TrustStatsDataSchema.safeParse> {
  const result = TrustStatsDataSchema.safeParse(data);
  if (!result.success) {
    console.warn(`[trust-stats] Schema validation failed (${label}):`, JSON.stringify(result.error.flatten()));
  }
  return result;
}

// ---------------------------------------------------------------------------
// Fallback file  (config/trust-stats.json)
// ---------------------------------------------------------------------------

const HARDCODED_FALLBACK: Omit<TrustStats, 'source' | 'cached_at'> = {
  mercari: {
    combined: { rating: 5.0, reviewCount: 2042, accountCount: 2 },
    accounts: [
      { name: 'yamada_shop',    rating: 5.0, reviewCount: 327,  url: 'https://jp.mercari.com/user/profile/697549444' },
      { name: '有くん ショップ', rating: 5.0, reviewCount: 1715, url: 'https://jp.mercari.com/user/profile/238989929' },
    ],
  },
  level:      { seller: 10, account: '有くん ショップ', url: 'https://jp.mercari.com/user/profile/238989929' },
  shipped2025: 100,
  countries:   15,
  updatedAt:   new Date().toISOString(),
};

function readFallback(): Omit<TrustStats, 'source' | 'cached_at'> {
  const filePath = path.join(process.cwd(), 'config', 'trust-stats.json');
  const raw    = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);

  // Merge deeply so a partially-updated file still works
  const accounts: MercariAccount[] = Array.isArray(parsed.mercari?.accounts)
    ? parsed.mercari.accounts.map((a: Partial<MercariAccount>, i: number) => ({
        name:        a.name        ?? HARDCODED_FALLBACK.mercari.accounts[i]?.name        ?? '',
        rating:      Number(a.rating      ?? HARDCODED_FALLBACK.mercari.accounts[i]?.rating      ?? 5.0),
        reviewCount: Number(a.reviewCount ?? HARDCODED_FALLBACK.mercari.accounts[i]?.reviewCount ?? 0),
        url:         a.url         ?? HARDCODED_FALLBACK.mercari.accounts[i]?.url         ?? 'https://jp.mercari.com',
      }))
    : HARDCODED_FALLBACK.mercari.accounts;

  const combined = {
    rating:       weightedRating(accounts),
    reviewCount:  accounts.reduce((s, a) => s + a.reviewCount, 0),
    accountCount: accounts.length,
  };

  const levelAccName = parsed.level?.account ?? HARDCODED_FALLBACK.level.account;

  const result = {
    mercari: { combined, accounts },
    level: {
      seller:  Number(parsed.level?.seller  ?? HARDCODED_FALLBACK.level.seller),
      account: levelAccName,
      url:     parsed.level?.url ?? levelUrl(accounts, levelAccName),
    },
    shipped2025: Number(parsed.shipped2025 ?? HARDCODED_FALLBACK.shipped2025),
    countries:   Number(parsed.countries   ?? HARDCODED_FALLBACK.countries),
    updatedAt:   parsed.updatedAt ?? new Date().toISOString(),
  };

  const validation = validateOrWarn(result, 'json-fallback');
  if (!validation.success) {
    console.warn('[trust-stats] JSON fallback failed validation — using hardcoded fallback');
    return HARDCODED_FALLBACK;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Build from env vars
// ---------------------------------------------------------------------------

function buildFromEnv(): Omit<TrustStats, 'source' | 'cached_at'> | null {
  const m1Name  = process.env.NJD_MERCARI_1_NAME;
  const m1Rat   = process.env.NJD_MERCARI_1_RATING;
  const m1Count = process.env.NJD_MERCARI_1_REVIEW_COUNT;
  const m1Url   = process.env.NJD_MERCARI_1_URL;

  const m2Name  = process.env.NJD_MERCARI_2_NAME;
  const m2Rat   = process.env.NJD_MERCARI_2_RATING;
  const m2Count = process.env.NJD_MERCARI_2_REVIEW_COUNT;
  const m2Url   = process.env.NJD_MERCARI_2_URL;

  const sellerLevel  = process.env.NJD_MERCARI_SELLER_LEVEL;
  const levelAccount = process.env.NJD_MERCARI_LEVEL_ACCOUNT ?? '';
  const shipped2025  = process.env.NJD_SHIPPED_2025;
  const countries    = process.env.NJD_COUNTRIES_SHIPPED;

  const required = [m1Name, m1Rat, m1Count, m1Url, m2Name, m2Rat, m2Count, m2Url, shipped2025, countries];
  const missing  = ['NJD_MERCARI_1_NAME','NJD_MERCARI_1_RATING','NJD_MERCARI_1_REVIEW_COUNT','NJD_MERCARI_1_URL',
                    'NJD_MERCARI_2_NAME','NJD_MERCARI_2_RATING','NJD_MERCARI_2_REVIEW_COUNT','NJD_MERCARI_2_URL',
                    'NJD_SHIPPED_2025','NJD_COUNTRIES_SHIPPED']
                   .filter((_, i) => !required[i]);

  if (missing.length > 0) {
    console.warn('[trust-stats] Missing env vars, skipping env source:', missing.join(', '));
    return null;
  }

  const accounts: MercariAccount[] = [
    { name: m1Name!, rating: parseFloat(m1Rat!), reviewCount: Number(m1Count), url: m1Url! },
    { name: m2Name!, rating: parseFloat(m2Rat!), reviewCount: Number(m2Count), url: m2Url! },
  ];

  const result = {
    mercari: {
      combined: {
        rating:       weightedRating(accounts),
        reviewCount:  accounts.reduce((s, a) => s + a.reviewCount, 0),
        accountCount: accounts.length,
      },
      accounts,
    },
    level: {
      seller:  sellerLevel !== '' && sellerLevel != null ? Number(sellerLevel) : 0,
      account: levelAccount,
      url:     levelUrl(accounts, levelAccount),
    },
    shipped2025: Number(shipped2025),
    countries:   Number(countries),
    updatedAt:   new Date().toISOString(),
  };

  const validation = validateOrWarn(result, 'env-vars');
  if (!validation.success) {
    console.warn('[trust-stats] Env-var build failed validation — falling through to cache/fallback');
    return null;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function buildStats(): TrustStats {
  // 1 — env vars
  const fromEnv = buildFromEnv();
  if (fromEnv) return { ...fromEnv, source: 'env' };

  // 2 — scraper cache (populated by nightly cron)
  const cached = getScraperCache();
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    const validation = validateOrWarn(cached.data, 'scraper-cache');
    if (validation.success) {
      return { ...cached.data, source: 'cache', cached_at: new Date(cached.cachedAt).toISOString() };
    }
    console.warn('[trust-stats] Scraper cache failed validation — falling through to fallback');
  }

  // 3 — static fallback JSON — never show zeros
  try {
    return { ...readFallback(), source: 'fallback' };
  } catch {
    return { ...HARDCODED_FALLBACK, updatedAt: new Date().toISOString(), source: 'fallback' };
  }
}

export async function GET() {
  const stats = buildStats();
  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
    },
  });
}
