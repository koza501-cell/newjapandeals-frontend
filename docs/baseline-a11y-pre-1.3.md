# Accessibility Baseline — Pre Prompt 1.3

**Date:** 2026-04-19
**Tool:** axe-core 4.9.1 via Playwright + system Chrome
**Ruleset:** WCAG 2.0 A + AA + best-practice

## Summary

| Route | Total violations | Critical | Serious | Moderate | Minor |
|---|---|---|---|---|---|
| / (Homepage) | 4 | 3 | 1 | 0 | 0 |
| /products | 4 | 0 | 1 | 3 | 0 |
| /product/<slug> | 1 | 0 | 1 | 0 | 0 |
| **TOTAL** | **9** | **3** | **3** | **3** | **0** |

## Violations Detail

### / (Homepage) — 4 violations

| ID | Impact | Rule | Affected nodes |
|---|---|---|---|
| `button-name` | 🔴 critical | Buttons must have discernible text | 3 |
| `color-contrast` | 🟠 serious | Elements must meet minimum color contrast ratio thresholds | 17 |
| `label` | 🔴 critical | Form elements must have labels | 2 |
| `select-name` | 🔴 critical | Select element must have an accessible name | 1 |

**`button-name` (3 nodes):** Likely icon-only buttons in the header (mobile search, cart, hamburger). These need `aria-label` attributes.

**`label` (2 nodes) + `select-name` (1 node):** Form inputs without associated labels — likely the search input and/or currency selector dropdown on mobile. The `<input type="search" aria-label="...">` in SearchCommand.tsx should cover the search input; the select element in CurrencyPicker may be the issue.

**`color-contrast` (17 nodes):** Text with insufficient contrast — likely gray text (text-gray-400, text-gray-500) on white backgrounds. The micro-badge "Licensed Dealer · 古物商 #441200001622" in text-gray-400 is a likely culprit.

### /products — 4 violations

| ID | Impact | Rule | Affected nodes |
|---|---|---|---|
| `color-contrast` | 🟠 serious | Color contrast threshold not met | 4 |
| `heading-order` | 🟡 moderate | Heading levels should only increase by one | 1 |
| `landmark-one-main` | 🟡 moderate | Document should have one main landmark | 1 |
| `region` | 🟡 moderate | Page content not contained in landmark | 1 |

**`landmark-one-main`:** The products page HTML doesn't wrap content in a `<main>` element. Wrap page content with `<main>` tag.

**`heading-order`:** An `<h3>` or `<h4>` appears without a preceding `<h2>`. Audit heading hierarchy.

### /product/<slug> — 1 violation

| ID | Impact | Rule | Affected nodes |
|---|---|---|---|
| `color-contrast` | 🟠 serious | Color contrast threshold not met | 7 |

## Priority Fix Order

1. 🔴 **`button-name`** (Homepage, 3 nodes) — mobile header icon buttons missing `aria-label`. These are already in the Header.tsx code — verify the svg buttons inside the mobile menu have `aria-label`.
2. 🔴 **`label` / `select-name`** (Homepage, 3 nodes) — likely the CurrencyPicker `<select>` or a hidden form element.
3. 🟠 **`color-contrast`** (all routes, 28 total nodes) — audit gray text usage. Minimum contrast: 4.5:1 for normal text, 3:1 for large text. Replace `text-gray-400` with `text-gray-500` or `text-gray-600` where it's used for informational content.
4. 🟡 **`landmark-one-main`** (/products) — wrap product listing in `<main>`.
5. 🟡 **`heading-order`** (/products) — fix heading hierarchy.

## Notes
- `button-name` on `/` but not `/products` suggests the issue is in the `<Header>` or `<TrustRibbon>` component, not the page content.
- All violations are fixable in < 1 day of work. None are blockers for shipping.
- Run `node scripts/axe-audit.mjs` to re-audit after fixes. Target: 0 critical + 0 serious violations before launch.
