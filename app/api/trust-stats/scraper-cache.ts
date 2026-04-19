import type { TrustStats } from './types';

// Module-level cache — persists within the same Vercel Lambda instance (~15 min warm)
let scraperCache: Omit<TrustStats, 'source'> | null = null;
let scraperCachedAt: number = 0;
export const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Called by /api/cron/scrape-marketplace-ratings to populate the in-memory cache.
 */
export function setScraperCache(data: Omit<TrustStats, 'source'>) {
  scraperCache    = data;
  scraperCachedAt = Date.now();
}

export function getScraperCache(): { data: Omit<TrustStats, 'source'>; cachedAt: number } | null {
  if (!scraperCache) return null;
  return { data: scraperCache, cachedAt: scraperCachedAt };
}
