import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const API_URL   = 'https://api.newjapandeals.com';
const MEILI_HOST = process.env.MEILISEARCH_HOST;
const MEILI_KEY  = process.env.MEILISEARCH_ADMIN_KEY;

async function ensureMeilisearchRunning(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/meili-keepalive.php`, { signal: AbortSignal.timeout(8000) });
  } catch { /* non-fatal — Meilisearch may already be up */ }
}

function meiliHeaders(): HeadersInit {
  return {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${MEILI_KEY}`,
  };
}

function verifyCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.get('authorization') === `Bearer ${secret}`;
}

async function fetchAllProducts(): Promise<unknown[]> {
  const pageSize = 100;
  const products: unknown[] = [];
  let page = 1;

  for (;;) {
    const res = await fetch(
      `${API_URL}/api/products.php?status=published&limit=${pageSize}&page=${page}`,
      {
        signal: AbortSignal.timeout(15000),
        // Prevent Next.js data cache from serving stale products.
        // Without this, newly-added products would not appear until the
        // Next.js cache revalidates (potentially hours later).
        cache: 'no-store',
      }
    );
    if (!res.ok) break;
    const data = await res.json();
    const batch: unknown[] = data.products ?? data.data ?? [];
    if (batch.length === 0) break;
    products.push(...batch);
    if (batch.length < pageSize) break;
    page++;
  }

  return products;
}

async function fetchAllPosts(): Promise<unknown[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog.php?limit=200`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts ?? [];
  } catch {
    return [];
  }
}

function normalisePriceBucket(priceJpy: number): string {
  if (priceJpy < 10000)  return 'under_10k';
  if (priceJpy < 30000)  return 'under_30k';
  if (priceJpy < 60000)  return 'under_60k';
  if (priceJpy < 100000) return 'under_100k';
  return 'over_100k';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformProduct(p: any) {
  return {
    id:               String(p.id ?? p.slug),
    slug:             p.slug,
    brand:            p.brand ?? '',
    model:            p.model ?? '',
    reference_number: p.reference_number ?? p.referenceNumber ?? '',
    title:            p.title ?? p.title_en ?? `${p.brand ?? ''} ${p.model ?? ''}`.trim(),
    category:         p.category ?? p.category_slug ?? '',
    condition:        p.condition ?? '',
    movement_type:    p.movement_type ?? p.movement ?? '',
    gender:           p.gender ?? '',
    availability:     p.availability ?? 'in_stock',
    status:           p.status ?? '',
    featured:         p.featured ? 1 : 0,
    tags:             Array.isArray(p.tags) ? p.tags : [],
    price_jpy:        Number(p.price_jpy ?? p.price ?? 0),
    price_bucket:     normalisePriceBucket(Number(p.price_jpy ?? p.price ?? 0)),
    // All indexed documents are in-stock/published — SearchCommand filter 'in_stock = true' relies on this
    in_stock:         true,
    image_1:          p.image_1 ?? p.image ?? p.images?.[0] ?? null,
    created_at:       p.created_at ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformPost(p: any) {
  return {
    id:      String(p.id ?? p.slug),
    slug:    p.slug,
    title:   p.title ?? '',
    excerpt: p.excerpt ?? '',
    tags:    Array.isArray(p.tags) ? p.tags : [],
  };
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!MEILI_HOST || !MEILI_KEY) {
    return NextResponse.json({ error: 'MEILISEARCH_HOST or MEILISEARCH_ADMIN_KEY not configured' }, { status: 500 });
  }

  await ensureMeilisearchRunning();

  // Pre-flight: abort early if Meilisearch is still not reachable after keepalive.
  // This prevents a misleading 200 with products_indexed:0 masking downtime.
  try {
    const healthRes = await fetch(`${MEILI_HOST}/health`, {
      signal: AbortSignal.timeout(6000),
    });
    const health = await healthRes.json().catch(() => ({}));
    if (!healthRes.ok || (health as { status?: string }).status !== 'available') {
      console.error('[reindex-meili] pre-flight failed — Meilisearch not available', health);
      return NextResponse.json(
        { error: 'Meilisearch not available', health },
        { status: 503 },
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[reindex-meili] pre-flight error —', msg);
    return NextResponse.json({ error: 'Meilisearch health check failed', detail: msg }, { status: 503 });
  }

  const [rawProducts, rawPosts] = await Promise.all([fetchAllProducts(), fetchAllPosts()]);

  // Exclude products that are sold, archived, or explicitly unavailable.
  // Include if: status is published/active (not a sold/archived status)
  //             AND availability is not explicitly 'sold'.
  // Products with no availability field (undefined) are treated as in-stock.
  const SOLD_STATUSES = new Set(['sold_mercari', 'sold_website', 'archived']);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = (rawProducts as any[])
    .filter((p: any) => !SOLD_STATUSES.has(p.status) && p.availability !== 'sold')
    .map(transformProduct);
  console.log(`[reindex-meili] raw=${rawProducts.length} after_filter=${products.length}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts    = (rawPosts    as any[]).map(transformPost);

  const headers = meiliHeaders();

  // Update index settings (fire-and-forget — tasks are async on Meilisearch side)
  await Promise.allSettled([
    fetch(`${MEILI_HOST}/indexes/products/settings`, {
      method:  'PATCH',
      headers,
      body: JSON.stringify({
        searchableAttributes: ['brand', 'model', 'reference_number', 'title', 'condition', 'tags'],
        filterableAttributes: ['category', 'brand', 'condition', 'movement_type', 'gender', 'price_jpy', 'availability', 'status', 'in_stock', 'featured'],
        sortableAttributes:   ['price_jpy', 'created_at'],
        typoTolerance: {
          enabled: true,
          minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 },
        },
      }),
      signal: AbortSignal.timeout(8000),
    }),
    fetch(`${MEILI_HOST}/indexes/blog/settings`, {
      method:  'PATCH',
      headers,
      body: JSON.stringify({
        searchableAttributes: ['title', 'excerpt', 'tags'],
      }),
      signal: AbortSignal.timeout(8000),
    }),
  ]);

  // Clear stale documents then replace with the fresh set.
  // Using DELETE-then-POST ensures products that are no longer published
  // (e.g. status changed to draft/sold) are removed from the search index.
  await Promise.allSettled([
    fetch(`${MEILI_HOST}/indexes/products/documents`, {
      method:  'DELETE',
      headers,
      signal:  AbortSignal.timeout(8000),
    }),
    fetch(`${MEILI_HOST}/indexes/blog/documents`, {
      method:  'DELETE',
      headers,
      signal:  AbortSignal.timeout(8000),
    }),
  ]);

  // Small delay to let Meilisearch process the deletes before adding new docs
  await new Promise(resolve => setTimeout(resolve, 500));

  // Add fresh documents — returns { taskUid } from Meilisearch
  const [pRes, bRes] = await Promise.allSettled([
    products.length > 0
      ? fetch(`${MEILI_HOST}/indexes/products/documents?primaryKey=id`, {
          method:  'POST',
          headers,
          body:    JSON.stringify(products),
          signal:  AbortSignal.timeout(8000),
        })
      : Promise.resolve(null),
    posts.length > 0
      ? fetch(`${MEILI_HOST}/indexes/blog/documents?primaryKey=id`, {
          method:  'POST',
          headers,
          body:    JSON.stringify(posts),
          signal:  AbortSignal.timeout(8000),
        })
      : Promise.resolve(null),
  ]);

  let pTaskUid: number | null = null;
  let bTaskUid: number | null = null;

  if (pRes.status === 'fulfilled' && pRes.value?.ok) {
    const d = await pRes.value.json();
    pTaskUid = d.taskUid ?? null;
  }
  if (bRes.status === 'fulfilled' && bRes.value?.ok) {
    const d = await bRes.value.json();
    bTaskUid = d.taskUid ?? null;
  }

  const result = {
    products_indexed:  products.length,
    posts_indexed:     posts.length,
    products_task_uid: pTaskUid,
    blog_task_uid:     bTaskUid,
    indexed_at:        new Date().toISOString(),
  };

  console.log('[reindex-meili]', JSON.stringify(result));
  return NextResponse.json(result);
}
