# Accessibility — Post Prompt 1.2c Fixes

**Date:** 2026-04-19
**Tool:** axe-core 4.9.1 via Playwright + system Chrome
**Ruleset:** WCAG 2.0 A + AA + best-practice

---

## Before vs. After

| Route | Before total | Before critical | After (projected) critical | After (projected) total |
|---|---|---|---|---|
| / (Homepage) | 4 | 3 | **0** | 1 (contrast deferred) |
| /products | 4 | 0 | 0 | 4 (unchanged) |
| /product/<slug> | 1 | 0 | 0 | 1 (unchanged) |
| **TOTAL** | **9** | **3** | **0** | **6** |

*Projections: actual numbers must be re-confirmed by running `node scripts/axe-audit.mjs` on Vercel preview.*

---

## Fix 1 — `button-name` (3 nodes, critical) — FIXED

**Root cause:** The Hero component (`components/Hero.tsx`) renders 3 dot indicator buttons for rotating the headline carousel. These had no text content and no `aria-label`, making them invisible to screen readers.

```tsx
// Before — no accessible name
<button className="w-2 h-2 rounded-full ..." />

// After — descriptive aria-label + aria-current for current slide
<button
  aria-label={`Go to slide ${index + 1}`}
  aria-current={index === currentIndex ? 'true' : undefined}
  className="w-2 h-2 rounded-full ..."
/>
```

**Affected file:** `components/Hero.tsx`

---

## Fix 2 — `label` (2 nodes, critical) — FIXED

**Root cause:** The Savings Calculator (`components/SavingsCalculator.tsx`) used `<label>` elements visually positioned above their inputs, but the labels had no `for`/`htmlFor` attribute and the inputs had no `id`. Screen readers could not programmatically associate the label text with the control.

```tsx
// Before — floating label, no association
<label className="...">Item Price (JPY)</label>
<input type="number" ... />

// After — explicit htmlFor/id pairing
<label htmlFor="calc-price" className="...">Item Price (JPY)</label>
<input id="calc-price" type="number" ... />
```

The range slider also had no label at all — added a visually-hidden `<label htmlFor="calc-price-range">Item Price Slider</label>` using the `sr-only` Tailwind class.

**Affected file:** `components/SavingsCalculator.tsx`

---

## Fix 3 — `select-name` (1 node, critical) — FIXED

**Root cause:** The country `<select>` in `SavingsCalculator.tsx` had no `id`, so the adjacent `<label>` could not be associated with it.

```tsx
// Before
<label className="...">Your Country</label>
<select ...>

// After
<label htmlFor="calc-country" className="...">Your Country</label>
<select id="calc-country" ...>
```

**Affected file:** `components/SavingsCalculator.tsx`

---

## Remaining violations (not blocking)

| Rule | Impact | Routes | Count | Notes |
|---|---|---|---|---|
| `color-contrast` | 🟠 serious | /, /products, /product | ~28 nodes | `text-gray-400` on white. Deferred to Phase 4 accessibility pass. |
| `landmark-one-main` | 🟡 moderate | /products | 1 node | Page content not wrapped in `<main>`. Quick fix — deferred. |
| `heading-order` | 🟡 moderate | /products | 1 node | Heading level skips h2→h4. Deferred. |
| `region` | 🟡 moderate | /products | 1 node | Related to landmark issue. Deferred. |

---

## How to re-verify

```bash
node scripts/axe-audit.mjs / /products "/product/swat-supernatural-5ef8"
```

Target before launch: **0 critical + 0 serious** violations.
