import { NextRequest, NextResponse } from 'next/server';
import { setScraperCache } from '@/app/api/trust-stats/scraper-cache';

export const dynamic = 'force-dynamic';

/**
 * Nightly scraper for Mercari JP and Rakuma seller ratings.
 *
 * Both platforms aggressively block scrapers. Every fetch is wrapped in try/catch.
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
async function scrapeMercari(): Promise<{ rating: string; count: number } | null> {
  // Mercari seller ID for New Japan Deals (yamada-trade)
  const SELLER_ID = process.env.NJD_MERCARI_SELLER_ID;
  if (!SELLER_ID) return null;

  try {
    const res = await fetch(
      `https://jp.mercari.com/user/profile/${SELLER_ID}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NewJapanDeals-bot/1.0)',
          'Accept-Language': 'ja-JP,ja;q=0.9',
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return null;

    const html = await res.text();

    // Mercari renders ratings in a <span> with data-testid="rating-text" or similar.
    // Pattern: "4.9 (1,247件)" — adapt to actual DOM if Mercari updates it.
    const ratingMatch = html.match(/class="[^"]*rating[^"]*"[^>]*>\s*([\d.]+)\s*<\/span/i)
      ?? html.match(/"averageRating"\s*:\s*"?([\d.]+)"?/);
    const countMatch  = html.match(/"ratingCount"\s*:\s*(\d+)/)
      ?? html.match(/([\d,]+)\s*件/);

    if (!ratingMatch) return null;

    const rating = ratingMatch[1];
    const count  = countMatch ? parseInt(countMatch[1].replace(/,/g, ''), 10) : 0;

    return { rating, count };
  } catch (err) {
    console.error('[scrape-marketplace-ratings] Mercari scrape failed:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Rakuma — public seller profile page
// ---------------------------------------------------------------------------
async function scrapeRakuma(): Promise<{ rating: string; count: number } | null> {
  const SELLER_ID = process.env.NJD_RAKUMA_SELLER_ID;
  if (!SELLER_ID) return null;

  try {
    const res = await fetch(
      `https://rakuma.rakuten.co.jp/user/${SELLER_ID}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NewJapanDeals-bot/1.0)',
          'Accept-Language': 'ja-JP,ja;q=0.9',
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return null;

    const html = await res.text();

    const ratingMatch = html.match(/class="[^"]*evaluation[^"]*"[^>]*>\s*([\d.]+)/i)
      ?? html.match(/"rating"\s*:\s*"?([\d.]+)"?/);
    const countMatch  = html.match(/([\d,]+)\s*評価/);

    if (!ratingMatch) return null;

    const rating = ratingMatch[1];
    const count  = countMatch ? parseInt(countMatch[1].replace(/,/g, ''), 10) : 0;

    return { rating, count };
  } catch (err) {
    console.error('[scrape-marketplace-ratings] Rakuma scrape failed:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// NJD backend — total shipped orders
// ---------------------------------------------------------------------------
async function fetchShippedCount(): Promise<{ shipped_2025: number; countries_shipped: number } | null> {
  try {
    const res = await fetch(
      'https://api.newjapandeals.com/api/stats.php',
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      shipped_2025:      Number(data.shipped_2025      ?? 0) || 0,
      countries_shipped: Number(data.countries_shipped ?? 0) || 0,
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

  const [mercari, rakuma, shipped] = await Promise.all([
    scrapeMercari(),
    scrapeRakuma(),
    fetchShippedCount(),
  ]);

  // Merge scraped data with whatever the current cache/fallback holds.
  // Only override a stat if we actually got a fresh value — never zero out.
  const { default: fs }   = await import('fs');
  const { default: path } = await import('path');

  let fallback = {
    mercari_rating:       '4.9',
    mercari_review_count: 1247,
    rakuma_rating:        '4.8',
    rakuma_review_count:  612,
    shipped_2025:         438,
    countries_shipped:    32,
  };

  try {
    const raw  = fs.readFileSync(path.join(process.cwd(), 'config', 'trust-stats.json'), 'utf-8');
    const parsed = JSON.parse(raw);
    fallback = { ...fallback, ...parsed };
  } catch { /* use hardcoded fallback */ }

  const merged = {
    mercari_rating:       mercari?.rating ?? String(fallback.mercari_rating),
    mercari_review_count: (mercari?.count && mercari.count > 0) ? mercari.count : Number(fallback.mercari_review_count),
    mercari_url:          process.env.NJD_MERCARI_URL ?? 'https://jp.mercari.com',
    rakuma_rating:        rakuma?.rating  ?? String(fallback.rakuma_rating),
    rakuma_review_count:  (rakuma?.count  && rakuma.count  > 0) ? rakuma.count  : Number(fallback.rakuma_review_count),
    rakuma_url:           process.env.NJD_RAKUMA_URL  ?? 'https://rakuma.rakuten.co.jp',
    shipped_2025:         (shipped?.shipped_2025      && shipped.shipped_2025      > 0) ? shipped.shipped_2025      : Number(fallback.shipped_2025),
    countries_shipped:    (shipped?.countries_shipped && shipped.countries_shipped > 0) ? shipped.countries_shipped : Number(fallback.countries_shipped),
  };

  setScraperCache(merged);

  const result = {
    ...merged,
    scraped: {
      mercari: !!mercari,
      rakuma:  !!rakuma,
      shipped: !!shipped,
    },
    scraped_at: new Date().toISOString(),
  };

  console.log('[scrape-marketplace-ratings]', JSON.stringify(result));
  return NextResponse.json(result);
}
