import { NextRequest, NextResponse } from 'next/server';
import { Meilisearch } from 'meilisearch';

export const dynamic = 'force-dynamic';
// Vercel max timeout for Pro plan; on Hobby plan set to 10
export const maxDuration = 60;

const API_URL = 'https://api.newjapandeals.com';

function getClient(): Meilisearch {
  const host   = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_ADMIN_KEY;
  if (!host || !apiKey) throw new Error('MEILISEARCH_HOST or MEILISEARCH_ADMIN_KEY not configured');
  return new Meilisearch({ host, apiKey });
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
      { signal: AbortSignal.timeout(15000) }
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
    title:            p.title ?? `${p.brand ?? ''} ${p.model ?? ''}`.trim(),
    condition:        p.condition ?? '',
    tags:             Array.isArray(p.tags) ? p.tags : [],
    price_jpy:        Number(p.price_jpy ?? p.price ?? 0),
    price_bucket:     normalisePriceBucket(Number(p.price_jpy ?? p.price ?? 0)),
    in_stock:         p.status === 'published' && !p.sold,
    image_1:          p.image_1 ?? p.images?.[0] ?? null,
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

  let client: Meilisearch;
  try {
    client = getClient();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const [rawProducts, rawPosts] = await Promise.all([fetchAllProducts(), fetchAllPosts()]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = (rawProducts as any[]).map(transformProduct);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts    = (rawPosts    as any[]).map(transformPost);

  // Ensure index settings are correct before adding documents
  const productsIndex = client.index('products');
  const blogIndex     = client.index('blog');

  await Promise.all([
    productsIndex.updateSettings({
      searchableAttributes: ['brand', 'model', 'reference_number', 'title', 'condition', 'tags'],
      filterableAttributes: ['brand', 'condition', 'price_bucket', 'in_stock'],
      sortableAttributes:   ['price_jpy', 'created_at'],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 },
      },
    }),
    blogIndex.updateSettings({
      searchableAttributes: ['title', 'excerpt', 'tags'],
    }),
  ]);

  // Full reindex: replace all documents
  const [pTask, bTask] = await Promise.all([
    products.length > 0 ? productsIndex.addDocuments(products, { primaryKey: 'id' }) : Promise.resolve(null),
    posts.length    > 0 ? blogIndex.addDocuments(posts, { primaryKey: 'id' })        : Promise.resolve(null),
  ]);

  const result = {
    products_indexed: products.length,
    posts_indexed:    posts.length,
    products_task_uid: pTask?.taskUid ?? null,
    blog_task_uid:     bTask?.taskUid ?? null,
    indexed_at: new Date().toISOString(),
  };

  console.log('[reindex-meili]', JSON.stringify(result));
  return NextResponse.json(result);
}
