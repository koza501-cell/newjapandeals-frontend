/**
 * axe-core accessibility audit via Playwright
 *
 * Usage:
 *   node scripts/axe-audit.mjs
 *   node scripts/axe-audit.mjs https://www.newjapandeals.com /products /product/some-slug
 *
 * Requirements:
 *   npm install -D axe-playwright
 *   npx playwright install chromium
 */

import { chromium } from '@playwright/test';

const BASE_URL  = 'https://www.newjapandeals.com';
const ROUTES    = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/', '/products'];

async function auditRoute(page, route) {
  const url = route.startsWith('http') ? route : BASE_URL + route;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Inject axe-core from CDN
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js',
  });

  const results = await page.evaluate(async () => {
    // @ts-ignore
    const r = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'best-practice'] },
    });
    return {
      violations: r.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length,
        help: v.help,
      })),
      passes: r.passes.length,
      incomplete: r.incomplete.length,
    };
  });

  return { route: url, ...results };
}

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (compatible; axe-audit-bot/1.0)',
  viewport: { width: 1280, height: 800 },
});
const page = await context.newPage();

const allResults = [];

for (const route of ROUTES) {
  console.log(`\nAuditing: ${route}`);
  try {
    const r = await auditRoute(page, route);
    allResults.push(r);

    const critical = r.violations.filter(v => v.impact === 'critical');
    const serious  = r.violations.filter(v => v.impact === 'serious');
    const moderate = r.violations.filter(v => v.impact === 'moderate');
    const minor    = r.violations.filter(v => v.impact === 'minor');

    console.log(`  Violations: ${r.violations.length} (critical:${critical.length} serious:${serious.length} moderate:${moderate.length} minor:${minor.length})`);
    console.log(`  Passes:     ${r.passes}`);
    console.log(`  Incomplete: ${r.incomplete}`);

    if (r.violations.length > 0) {
      console.log('\n  Violations:');
      for (const v of r.violations) {
        console.log(`    [${(v.impact ?? '?').padEnd(8)}] ${v.id} — ${v.help} (${v.nodes} node${v.nodes !== 1 ? 's' : ''})`);
      }
    }
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
  }
}

await browser.close();

// Summary
console.log('\n' + '─'.repeat(70));
console.log('SUMMARY');
console.log('─'.repeat(70));
let totalViolations = 0;
for (const r of allResults) {
  totalViolations += r.violations?.length ?? 0;
  console.log(`${r.route.replace(BASE_URL, '').padEnd(30)} ${r.violations?.length ?? 'ERR'} violations`);
}
console.log(`${'TOTAL'.padEnd(30)} ${totalViolations} violations`);
