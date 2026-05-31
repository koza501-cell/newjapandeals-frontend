import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const API_URL = 'https://api.newjapandeals.com';
const REINDEX_KEY = 'njd_moltbot_2026_secretkey';

function verifyCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.get('authorization') === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Delegate all reindex work to the PHP endpoint on Hostinger.
    // It reads from MySQL and writes to Meilisearch on localhost:7700 —
    // no Cloudflare proxy, no body-size limits, no Vercel timeout issues.
    const res = await fetch(
      `${API_URL}/api/meili-reindex.php?key=${REINDEX_KEY}`,
      {
        signal: AbortSignal.timeout(25000),
        cache: 'no-store',
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('[reindex-meili] PHP endpoint returned', res.status, data);
      return NextResponse.json(
        { error: 'Reindex endpoint failed', status: res.status, detail: data },
        { status: 502 },
      );
    }

    console.log('[reindex-meili]', JSON.stringify(data));
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[reindex-meili] error —', msg);
    return NextResponse.json({ error: 'Reindex failed', detail: msg }, { status: 500 });
  }
}
