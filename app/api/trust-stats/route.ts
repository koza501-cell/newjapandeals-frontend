import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface TrustStats {
  mercari_rating:       string;
  mercari_review_count: number;
  rakuma_rating:        string;
  rakuma_review_count:  number;
  shipped_2025:         number;
  countries_shipped:    number;
  source:               'env' | 'cache' | 'fallback';
  cached_at?:           string;
}

// Module-level cache — persists within the same Vercel Lambda instance (~15 min warm)
let scraperCache: Omit<TrustStats, 'source'> | null = null;
let scraperCachedAt: number = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Called by /api/cron/scrape-marketplace-ratings to populate the in-memory cache.
 * This function is exported so the cron route can import it directly.
 */
export function setScraperCache(data: Omit<TrustStats, 'source'>) {
  scraperCache  = data;
  scraperCachedAt = Date.now();
}

function readFallback(): Omit<TrustStats, 'source'> {
  const filePath = path.join(process.cwd(), 'config', 'trust-stats.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  return {
    mercari_rating:       parsed.mercari_rating       ?? '4.9',
    mercari_review_count: Number(parsed.mercari_review_count ?? 1247),
    rakuma_rating:        parsed.rakuma_rating         ?? '4.8',
    rakuma_review_count:  Number(parsed.rakuma_review_count  ?? 612),
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
      rakuma_rating:        envRakumaRating!,
      rakuma_review_count:  Number(envRakumaCount),
      shipped_2025:         Number(envShipped2025),
      countries_shipped:    Number(envCountries),
      source: 'env',
    };
  }

  // 2 — scraper cache (populated by nightly cron)
  if (scraperCache && Date.now() - scraperCachedAt < CACHE_TTL_MS) {
    return { ...scraperCache, source: 'cache', cached_at: new Date(scraperCachedAt).toISOString() };
  }

  // 3 — static fallback (config/trust-stats.json) — never show zeros
  try {
    return { ...readFallback(), source: 'fallback' };
  } catch {
    // Last-resort hardcoded minimum — guarantees we never show zeros
    return {
      mercari_rating:       '4.9',
      mercari_review_count: 1247,
      rakuma_rating:        '4.8',
      rakuma_review_count:  612,
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
