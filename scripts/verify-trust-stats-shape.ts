/**
 * Prebuild smoke test — validates config/trust-stats.json against the Zod schema.
 * Exits 1 if invalid so a broken fallback file fails fast at build time.
 *
 * Run:  npx ts-node --project tsconfig.json scripts/verify-trust-stats-shape.ts
 * Auto: hooked into package.json "prebuild"
 */

import path from 'path';
import fs   from 'fs';
import { TrustStatsDataSchema } from '../app/api/trust-stats/schema';

const filePath = path.join(__dirname, '..', 'config', 'trust-stats.json');

let raw: string;
try {
  raw = fs.readFileSync(filePath, 'utf-8');
} catch (err) {
  console.error(`[verify-trust-stats-shape] Cannot read ${filePath}:`, err);
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  console.error('[verify-trust-stats-shape] config/trust-stats.json is not valid JSON:', err);
  process.exit(1);
}

// Strip comment keys before validation
const data = Object.fromEntries(
  Object.entries(parsed as Record<string, unknown>).filter(([k]) => !k.startsWith('_'))
);

const result = TrustStatsDataSchema.safeParse(data);

if (!result.success) {
  console.error('[verify-trust-stats-shape] config/trust-stats.json FAILED schema validation:');
  console.error(JSON.stringify(result.error.flatten(), null, 2));
  process.exit(1);
}

console.log('[verify-trust-stats-shape] config/trust-stats.json is valid.');
