import { NextResponse } from 'next/server';

export const revalidate = 21600; // 6-hour ISR cache

const FALLBACK_RATES: Record<string, number> = {
  JPY: 1, USD: 0.0067, EUR: 0.0061, GBP: 0.0053,
  AUD: 0.0102, CAD: 0.0091, SGD: 0.009, HKD: 0.052,
};

export async function GET() {
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=JPY&to=USD,EUR,GBP,AUD,CAD,SGD,HKD',
      { next: { revalidate: 21600 } },
    );
    if (!res.ok) throw new Error(`Frankfurter responded ${res.status}`);
    const data: { rates?: Record<string, number> } = await res.json();
    if (!data.rates) throw new Error('No rates in response');
    return NextResponse.json({ base: 'JPY', rates: { JPY: 1, ...data.rates } });
  } catch (err) {
    console.error('[/api/fx] fetch failed, returning fallback rates:', err);
    return NextResponse.json({ base: 'JPY', rates: FALLBACK_RATES });
  }
}
