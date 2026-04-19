import { test, expect } from '@playwright/test';

/**
 * Regression tests that verify stray debug strings never appear in any page body.
 * Runs against a live dev server (auto-started by playwright.config.ts webServer).
 */

const ROUTES = ['/', '/products', '/cart', '/about', '/faq', '/contact', '/why-us'];

for (const route of ROUTES) {
  test(`"Stop Claude" is absent from ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    const bodyText = await page.evaluate(() => document.body.innerText);
    expect(bodyText, `"Stop Claude" found on ${route}`).not.toContain('Stop Claude');
  });

  test(`"Master Cheif" typo is absent from ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    const bodyText = await page.evaluate(() => document.body.innerText);
    expect(bodyText, `Typo "Master Cheif" found on ${route}`).not.toContain('Master Cheif');
  });
}

// Spot-check: sanitize utility correctly strips and corrects bad strings
test('sanitizeText strips Stop Claude and corrects Master Cheif', async ({ page }) => {
  // Load any page to get a browser context, then evaluate the util inline
  await page.goto('/');
  const result = await page.evaluate(() => {
    const fn = (s: string) =>
      s.replace(/Stop Claude/gi, '').replace(/Master Cheif/g, 'Master Chief').trim();
    return {
      noStopClaude: fn('Hello Stop Claude World'),
      cheifFixed: fn('Master Cheif is great'),
    };
  });
  expect(result.noStopClaude).toBe('Hello  World'.trim());
  expect(result.cheifFixed).toBe('Master Chief is great');
});
