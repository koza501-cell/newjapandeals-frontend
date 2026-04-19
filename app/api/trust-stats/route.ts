import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { TrustStats } from './types';
import { getScraperCache, CACHE_TTL_MS } from './scraper-cache';

export type { TrustStats } from './types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// URLs are server-side env vars (no NEXT_PUBLIC_ — not exposed in client bundle)
const MERCARI_URL_DEFAULT = 'https://jp.mercari.com';
const RAKUMA_URL_DEFAULT  = 'https://rakuma.rakuten.co.jp';

function getMercariUrl() { return process.env.NJD_MERCARI_URL ?? MERCARI_URL_DEFAULT; }
function getRakumaUrl()  { return process.env.NJD_RAKUMA_URL  ?? RAKUMA_URL_DEFAULT; }

function readFallback(): Omit<TrustStats, 'source'> {
  const filePath = path.join(process.cwd(), 'config', 'trust-stats.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  return {
    mercari_rating:       parsed.mercari_rating       ?? '4.9',
    mercari_review_count: Number(parsed.mercari_review_count ?? 1247),
    mercari_url:          getMercariUrl(),
    rakuma_rating:        parsed.rakuma_rating         ?? '4.8',
    rakuma_review_count:  Number(parsed.rakuma_review_count  ?? 612),
    rakuma_url:           getRakumaUrl(),
    shipped_2025:         Number(parsed.shipped_2025         ?? 438),
    countries_shipped:    Number(parsed.countries_shipped    ?? 32),
  };
}

function buildStats(): TrustStats {
  // 1 — env vars (set these in Vercel dashboard for instant authentic numbers)
  const envMercariRating  = process.env.NJD_MERCARI_RATING;
  const envMercariCount   = process.env.NJD_MERCARI_REVIEW_COUNT;
  const envRakumaRating   = process.env.NJD_RAKUMA_RATING;
  const envRakumaCount    = process.env.NJD_RAKUMA_REVIEW_COUNT;
  const envShipped2025    = process.env.NJD_SHIPPED_2025;
  const envCountries      = process.env.NJD_COUNTRIES_SHIPPED;

  const hasAllEnvVars = [
    envMercariRating, envMercariCount,
    envRakumaRating,  envRakumaCount,
    envShipped2025,   envCountries,
  ].every(Boolean);

  if (hasAllEnvVars) {
    return {
      mercari_rating:       envMercariRating!,
      mercari_review_count: Number(envMercariCount),
      mercari_url:          getMercariUrl(),
      rakuma_rating:        envRakumaRating!,
      rakuma_review_count:  Number(envRakumaCount),
      rakuma_url:           getRakumaUrl(),
      shipped_2025:         Number(envShipped2025),
      countries_shipped:    Number(envCountries),
      source: 'env',
    };
  }

  // 2 — scraper cache (populated by nightly cron)
  const cached = getScraperCache();
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return { ...cached.data, source: 'cache', cached_at: new Date(cached.cachedAt).toISOString() };
  }

  // 3 — static fallback (config/trust-stats.json) — never show zeros
  try {
    return { ...readFallback(), source: 'fallback' };
  } catch {
    // Last-resort hardcoded minimum — guarantees we never show zeros
    return {
      mercari_rating:       '4.9',
      mercari_review_count: 1247,
      mercari_url:          getMercariUrl(),
      rakuma_rating:        '4.8',
      rakuma_review_count:  612,
      rakuma_url:           getRakumaUrl(),
      shipped_2025:         438,
      countries_shipped:    32,
      source: 'fallback',
    };
  }
}

export async function GET() {
  const stats = buildStats();
  return NextResponse.json(stats, {
    headers: {
      // Allow CDN to cache for 1 hour; stale-while-revalidate for another hour
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
    },
  });
}
