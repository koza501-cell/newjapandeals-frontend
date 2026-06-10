import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export function GET(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country') ?? '';
  return NextResponse.json({ country_code: country });
}
