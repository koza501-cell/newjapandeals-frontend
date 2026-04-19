import { NextRequest, NextResponse } from 'next/server';
import { setScraperCache } from '@/app/api/trust-stats/scraper-cache';
import type { MercariAccount } from '@/app/api/trust-stats/types';

export const dynamic = 'force-dynamic';

/**
 * Nightly scraper for both Mercari JP seller accounts.
 *
 * Mercari aggressively blocks scrapers. Every fetch is wrapped in try/catch.
 * If a scrape fails we SILENTLY fall through — never zero out a displayed stat.
 *
 * Triggered by Vercel Cron (see vercel.json) or manually:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://www.newjapandeals.com/api/cron/scrape-marketplace-ratings
 */

function verifyCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // No secret configured → allow (dev mode)
  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${secret}`;
}

// ---------------------------------------------------------------------------
// Mercari JP — public seller profile page
// ---------------------------------------------------------------------------

interface ScrapedAccount {
  rating: number;
  reviewCount: number;
}

async function scrapeMercariProfile(profileUrl: string): Promise<ScrapedAccount | null> {
  try {
    const res = await fetch(profileUrl, {
      headers: {
        'User-Agent':      'Mozilla/5.0 (compatible; NewJapanDeals-bot/1.0)',
        'Accept-Language': 'ja-JP,ja;q=0.9',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const html = await res.text();

    // Mercari renders ratings in a <span> with data-testid="rating-text" or similar.
    // Pattern: "4.9 (1,247件)" — adapt to actual DOM if Mercari updates it.
    const ratingMatch = html.match(/class="[^"]*rating[^"]*"[^>]*>\s*([\d.]+)\s*<\/span/i)
      ?? html.match(/"averageRating"\s*:\s*"?([\d.]+)"?/);
    const countMatch  = html.match(/"ratingCount"\s*:\s*(\d+)/)
      ?? html.match(/([\d,]+)\s*件/);

    if (!ratingMatch) return null;

    return {
      rating:      parseFloat(ratingMatch[1]),
      reviewCount: countMatch ? parseInt(countMatch[1].replace(/,/g, ''), 10) : 0,
    };
  } catch (err) {
    console.error('[scrape-marketplace-ratings] Mercari profile scrape failed:', profileUrl, err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// NJD backend — total shipped orders
// ---------------------------------------------------------------------------

async function fetchShippedCount(): Promise<{ shipped2025: number; countries: number } | null> {
  try {
    const res = await fetch('https://api.newjapandeals.com/api/stats.php', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      shipped2025: Number(data.shipped_2025      ?? 0) || 0,
      countries:   Number(data.countries_shipped ?? 0) || 0,
    };
  } catch (err) {
    console.error('[scrape-marketplace-ratings] NJD stats fetch failed:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Read account config from env vars
  const accountConfig = [
    {
      name: process.env.NJD_MERCARI_1_NAME ?? 'yamada_shop',
      url:  process.env.NJD_MERCARI_1_URL  ?? '',
      ratingFallback:      5.0,
      reviewCountFallback: 327,
    },
    {
      name: process.env.NJD_MERCARI_2_NAME ?? '有くん ショップ',
      url:  process.env.NJD_MERCARI_2_URL  ?? '',
      ratingFallback:      5.0,
      reviewCountFallback: 1715,
    },
  ];

  // Read fallback JSON for "never zero out" guarantee
  const { default: fs }   = await import('fs');
  const { default: path } = await import('path');

  let jsonFallback: { accounts: { rating: number; reviewCount: number }[]; shipped2025: number; countries: number } = {
    accounts:    [{ rating: 5.0, reviewCount: 327 }, { rating: 5.0, reviewCount: 1715 }],
    shipped2025: 100,
    countries:   15,
  };

  try {
    const raw    = fs.readFileSync(path.join(process.cwd(), 'config', 'trust-stats.json'), 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.mercari?.accounts)) {
      jsonFallback.accounts = parsed.mercari.accounts;
    }
    if (parsed.shipped2025) jsonFallback.shipped2025 = Number(parsed.shipped2025);
    if (parsed.countries)   jsonFallback.countries   = Number(parsed.countries);
  } catch { /* use hardcoded fallback */ }

  // Scrape both accounts + shipped count in parallel
  const [scraped1, scraped2, shipped] = await Promise.all([
    accountConfig[0].url ? scrapeMercariProfile(accountConfig[0].url) : Promise.resolve(null),
    accountConfig[1].url ? scrapeMercariProfile(accountConfig[1].url) : Promise.resolve(null),
    fetchShippedCount(),
  ]);

  const accounts: MercariAccount[] = accountConfig.map((cfg, i) => {
    const scraped = i === 0 ? scraped1 : scraped2;
    return {
      name:        cfg.name,
      rating:      (scraped?.rating      && scraped.rating      > 0) ? scraped.rating      : (jsonFallback.accounts[i]?.rating      ?? cfg.ratingFallback),
      reviewCount: (scraped?.reviewCount && scraped.reviewCount > 0) ? scraped.reviewCount : (jsonFallback.accounts[i]?.reviewCount ?? cfg.reviewCountFallback),
      url:         cfg.url || `https://jp.mercari.com`,
    };
  });

  const totalCount  = accounts.reduce((s, a) => s + a.reviewCount, 0);
  const combinedRating = totalCount > 0
    ? Math.round((accounts.reduce((s, a) => s + a.rating * a.reviewCount, 0) / totalCount) * 10) / 10
    : 0;

  const levelAccount = process.env.NJD_MERCARI_LEVEL_ACCOUNT ?? accounts[1].name;
  const levelUrl     = accounts.find(a => a.name === levelAccount)?.url ?? accounts[0].url;
  const sellerLevel  = process.env.NJD_MERCARI_SELLER_LEVEL;

  const merged = {
    mercari: {
      combined: { rating: combinedRating, reviewCount: totalCount, accountCount: accounts.length },
      accounts,
    },
    level: {
      seller:  sellerLevel !== '' && sellerLevel != null ? Number(sellerLevel) : 0,
      account: levelAccount,
      url:     levelUrl,
    },
    shipped2025: (shipped?.shipped2025 && shipped.shipped2025 > 0) ? shipped.shipped2025 : jsonFallback.shipped2025,
    countries:   (shipped?.countries   && shipped.countries   > 0) ? shipped.countries   : jsonFallback.countries,
    updatedAt:   new Date().toISOString(),
  };

  setScraperCache(merged);

  const result = {
    ...merged,
    scraped: {
      mercari1: !!scraped1,
      mercari2: !!scraped2,
      shipped:  !!shipped,
    },
    scraped_at: merged.updatedAt,
  };

  console.log('[scrape-marketplace-ratings]', JSON.stringify(result));
  return NextResponse.json(result);
}
