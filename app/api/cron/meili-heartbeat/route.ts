import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const MEILI_HOST = process.env.MEILISEARCH_HOST;
const MEILI_KEY  = process.env.MEILISEARCH_ADMIN_KEY;

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
      console.error('[MEILI-HEARTBEAT-DOWN]', { error: 'index empty or corrupted', latency_ms });
      return NextResponse.json({ ok: false, error: 'index returned 0 hits — may be empty or corrupted', latency_ms }, { status: 503 });
    }

    const result = { ok: true, latency_ms, hits_returned: hits.length };
    console.log('[meili-heartbeat]', JSON.stringify(result));

    // TODO: on 503 above, add a notification channel — pick one:
    //   - Discord webhook: POST to DISCORD_WEBHOOK_URL env var (free, instant)
    //   - Slack webhook:   POST to SLACK_WEBHOOK_URL env var (free, instant)
    //   - Healthchecks.io: GET  to HEALTHCHECKS_PING_URL env var (free, ping-based)
    //   - Better Uptime:   free tier — add external HTTP monitor pointing at this route
    //   - UptimeRobot:     free tier — 50 monitors, HTTP(s) type, 5-min interval

    return NextResponse.json(result);
  } catch (err) {
    const latency_ms = Date.now() - start;
    const error = err instanceof Error ? err.message : String(err);
    console.error('[MEILI-HEARTBEAT-DOWN]', { error, latency_ms });
    return NextResponse.json({ ok: false, error, latency_ms }, { status: 503 });
  }
}
