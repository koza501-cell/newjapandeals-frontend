import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * On-demand ISR revalidation.
 *
 * Usage:
 *   GET /api/revalidate?path=/&secret=<REVALIDATE_SECRET>
 *   GET /api/revalidate?path=/products&secret=<REVALIDATE_SECRET>
 *
 * Set REVALIDATE_SECRET in Vercel environment variables.
 * See /docs/revalidation.md for full usage guide.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const secret = searchParams.get('secret');
  const pathParam = searchParams.get('path');

  // Always require secret — no dev bypass
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!pathParam) {
    return NextResponse.json({ error: 'Missing ?path= parameter' }, { status: 400 });
  }

  // Sanitise path: must start with /
  const cleanPath = pathParam.startsWith('/') ? pathParam : `/${pathParam}`;

  try {
    revalidatePath(cleanPath);
    return NextResponse.json({
      revalidated: true,
      path: cleanPath,
      revalidated_at: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
