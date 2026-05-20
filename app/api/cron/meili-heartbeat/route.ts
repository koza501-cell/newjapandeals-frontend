import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const MEILI_HOST    = process.env.MEILISEARCH_HOST;
const MEILI_KEY     = process.env.MEILISEARCH_ADMIN_KEY;
const REINDEX_URL   = 'https://api.newjapandeals.com/api/meili-reindex.php';
const REINDEX_KEY   = 'njd_moltbot_2026_secretkey';

const REQUIRED_FILTERABLE = [
  'availability', 'brand', 'categories', 'category', 'condition',
  'featured', 'gender', 'in_stock', 'movement_type', 'price_jpy', 'status',
];

function verifyCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.get('authorization') === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!MEILI_HOST || !MEILI_KEY) {
    return NextResponse.json(
      { ok: false, error: 'MEILISEARCH_HOST or MEILISEARCH_ADMIN_KEY not configured' },
      { status: 503 },
    );
  }

  const start = Date.now();

  try {
    const res = await fetch(`${MEILI_HOST}/indexes/products/search`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${MEILI_KEY}`,
      },
      body:   JSON.stringify({ q: '', limit: 1 }),
      signal: AbortSignal.timeout(8000),
    });

    const latency_ms = Date.now() - start;

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[MEILI-HEARTBEAT-DOWN]', { status: res.status, latency_ms, body: text });
      return NextResponse.json({ ok: false, error: `upstream ${res.status}`, latency_ms }, { status: 503 });
    }

    const data = await res.json();
    const hits: unknown[] = data.hits ?? [];

    if (hits.length === 0) {
      console.error('[MEILI-HEARTBEAT-DOWN]', { error: 'index empty — triggering reindex', latency_ms });
      fetch(`${REINDEX_URL}?key=${REINDEX_KEY}`, { signal: AbortSignal.timeout(8000) }).catch(() => {});
      return NextResponse.json({ ok: false, error: 'index empty — reindex triggered', latency_ms, action: 'reindex_triggered' }, { status: 503 });
    }

    // Check filterableAttributes — auto-heal if categories is missing
    let settings_healed = false;
    try {
      const settingsRes = await fetch(`${MEILI_HOST}/indexes/products/settings`, {
        headers: { 'Authorization': `Bearer ${MEILI_KEY}` },
        signal: AbortSignal.timeout(5000),
      });
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        const current: string[] = settings.filterableAttributes ?? [];
        const missing = REQUIRED_FILTERABLE.filter(a => !current.includes(a));
        if (missing.length > 0) {
          console.error('[meili-heartbeat] Missing filterableAttributes:', missing, '— triggering reindex');
          fetch(`${REINDEX_URL}?key=${REINDEX_KEY}`, { signal: AbortSignal.timeout(8000) }).catch(() => {});
          settings_healed = true;
        }
      }
    } catch {
      // non-fatal — heartbeat still reports ok
    }

    const result = { ok: true, latency_ms, hits_returned: hits.length, settings_healed };
    console.log('[meili-heartbeat]', JSON.stringify(result));

    return NextResponse.json(result);
  } catch (err) {
    const latency_ms = Date.now() - start;
    const error = err instanceof Error ? err.message : String(err);
    console.error('[MEILI-HEARTBEAT-DOWN]', { error, latency_ms });
    return NextResponse.json({ ok: false, error, latency_ms }, { status: 503 });
  }
}
