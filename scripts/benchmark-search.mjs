/**
 * Search latency benchmark — 20 representative queries
 *
 * Usage (PHP fallback, no Meilisearch keys needed):
 *   node scripts/benchmark-search.mjs
 *
 * Usage (Meilisearch):
 *   MEILI_HOST=https://xxx.meilisearch.io MEILI_KEY=<search-only-key> node scripts/benchmark-search.mjs
 *
 * Output: per-query latency table + p50/p95/p99 summary
 */

const QUERIES = [
  'seiko',
  'casio g-shock',
  'citizen',
  'orient',
  'vintage seiko',
  'skx007',
  'dw-5600',
  'promaster',
  'mechanical automatic',
  'solar titanium',
  'grand seiko',
  'hamilton khaki',
  'tudor black bay',
  'seiko diver',
  'casio edifice',
  'omega speedmaster',
  'miyota movement',
  'japan only jdm',
  'limited edition',
  'gold dial',
];

const PHP_API   = 'https://api.newjapandeals.com';
const MEILI_HOST = process.env.MEILI_HOST;
const MEILI_KEY  = process.env.MEILI_KEY;
const useMeili   = !!(MEILI_HOST && MEILI_KEY);

async function queryPhp(q) {
  const enc = encodeURIComponent(q);
  const t0 = performance.now();
  const res = await fetch(`${PHP_API}/api/products.php?search=${enc}&limit=6&status=published`);
  await res.json();
  return performance.now() - t0;
}

async function queryMeili(q) {
  const t0 = performance.now();
  const res = await fetch(
    `${MEILI_HOST}/indexes/products/search`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MEILI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q, limit: 6, filter: 'in_stock = true' }),
    }
  );
  await res.json();
  return performance.now() - t0;
}

const query = useMeili ? queryMeili : queryPhp;
const engine = useMeili ? 'Meilisearch' : 'PHP API';

console.log(`\n🔍 Search benchmark — engine: ${engine}`);
console.log('─'.repeat(60));
console.log(`${'Query'.padEnd(35)} ${'ms'.padStart(8)}  Status`);
console.log('─'.repeat(60));

const latencies = [];

for (const q of QUERIES) {
  // Warm up: 1 discard
  try { await query(q); } catch { /* ignore warm-up errors */ }

  let ms;
  try {
    ms = await query(q);
    latencies.push(ms);
    console.log(`${q.padEnd(35)} ${ms.toFixed(1).padStart(8)}ms  ✓`);
  } catch (err) {
    console.log(`${q.padEnd(35)} ${'ERROR'.padStart(8)}    ✗  ${err.message}`);
  }
}

// Stats
latencies.sort((a, b) => a - b);
const p = (pct) => latencies[Math.floor(latencies.length * pct / 100)] ?? 0;
const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;

console.log('─'.repeat(60));
console.log(`Queries:  ${latencies.length}/${QUERIES.length} succeeded`);
console.log(`Avg:      ${avg.toFixed(1)}ms`);
console.log(`p50:      ${p(50).toFixed(1)}ms`);
console.log(`p95:      ${p(95).toFixed(1)}ms`);
console.log(`p99:      ${p(99).toFixed(1)}ms`);
console.log(`Min:      ${latencies[0]?.toFixed(1)}ms`);
console.log(`Max:      ${latencies[latencies.length - 1]?.toFixed(1)}ms`);
console.log('─'.repeat(60));

const target = 150;
const passing = latencies.filter(l => l < target).length;
console.log(`< ${target}ms target: ${passing}/${latencies.length} (${((passing/latencies.length)*100).toFixed(0)}%)\n`);
