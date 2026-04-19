# Performance — Post Prompt 1.2c Fixes

**Date:** 2026-04-19
**Changes applied:** blocking-font fix (Prompt 1.2, previous commit) + ISR + /products skeleton (Prompt 1.2c)

> **Note:** The local Next.js build fails on this machine due to an OS-level access-denied error on the `@next/swc-win32-x64-msvc` native module — a pre-existing environment issue unrelated to these changes. TypeScript compiles clean (`tsc --noEmit` = 0 errors). Vercel builds are unaffected. Re-measure on Vercel preview after deploy.

---

## Before vs. After (changes from Prompt 1.2 + 1.2c)

| Metric | / Before | / After (projected) | /products Before | /products After (projected) |
|---|---|---|---|---|
| **TTFB** | 3,752 ms 🔴 | ~150 ms ✅ | 50 ms ✅ | 50 ms ✅ |
| **FCP** | 10,872 ms 🔴 | ~1,200 ms ✅ | 2,664 ms 🟡 | 2,664 ms 🟡 |
| **LCP** | 10,872 ms 🔴 | ~1,200 ms ✅ | 2,664 ms 🟡 | 2,664 ms 🟡 |
| **CLS** | 0.000 ✅ | 0.000 ✅ | 0.424 🔴 | ~0.000 ✅ |

*Projections based on root-cause analysis; actual numbers must be confirmed on Vercel preview.*

---

## Fix 1 — Homepage blocking font import (previous commit)

**Root cause:** `globals.css` contained `@import url('https://fonts.googleapis.com/...')` for Source Sans Pro and Noto Sans JP. CSS `@import` is synchronous — the browser parses the stylesheet, encounters the import, opens a new HTTP connection to fonts.googleapis.com, waits for the full CSS response, then resumes rendering. On 4G this blocks paint for ~7 seconds.

**Fix:** Removed the `@import` from `globals.css`. Added `Source_Sans_3` and `Noto_Sans_JP` as `next/font/google` instances in `app/layout.tsx`. Next.js resolves these at build time, self-hosts the font files in `/_next/static/media/`, and emits `<link rel="preload">` headers in the initial HTML — eliminating the blocking fetch entirely.

**Expected improvement:** FCP on / from 10,872 ms → ~1,200 ms (matching /products level).

---

## Fix 2 — Homepage ISR (`app/page.tsx`)

**Root cause:** Homepage was dynamically SSR'd on every request (Next.js default for server components with no `revalidate`). On Vercel, cold-start adds ~3.5 s to TTFB on the first request after idle.

**Fix:** Added `export const revalidate = 300` to `app/page.tsx`. Next.js now pre-renders the homepage HTML at build time and serves it from the Vercel edge CDN. After 5 minutes it regenerates in the background (ISR) — cold starts are eliminated for all cached requests.

**Expected improvement:** Homepage TTFB from 3,752 ms → ~150 ms (CDN edge cache hit).

**Note:** The homepage's `<FeaturedProducts>` and `<SavingsCalculator>` are client components that fetch data on mount — they are unaffected by ISR and continue to hydrate after the initial HTML is served.

---

## Fix 3 — /products CLS skeleton loader (`app/products/page.tsx`)

**Root cause:** The products page is a `'use client'` component. During SSR and initial hydration, `loading === true`, so the server rendered a centered spinner inside `min-h-screen flex items-center justify-center`. When the API fetch resolved, React replaced this with a full `grid grid-cols-4` layout. The entire DOM sub-tree was swapped, causing the browser to recalculate layout and report a large CLS score (0.424 🔴).

**Fix:** Replaced the spinner-in-centred-div with a skeleton grid that uses the **identical outer container and grid classes** as the loaded state:

- Same `min-h-screen bg-gray-50` wrapper
- Same `max-w-7xl mx-auto px-4 py-8` inner container
- Same `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6` grid
- 8 skeleton cards, each with `aspect-square bg-gray-200 animate-pulse` image placeholder (same dimensions as loaded cards)
- `h-9 w-32` skeleton for the `<h1>` heading

Because the skeleton occupies the exact same bounding box as the loaded state, no layout shift occurs during hydration.

**Expected improvement:** /products CLS from 0.424 → ~0.000.

---

## Remaining items

| Issue | Route | Status |
|---|---|---|
| /product/<slug> TTFB 1,093 ms | /product/[slug] | Deferred — add `revalidate = 86400` to product page |
| color-contrast (28 nodes) | all routes | Deferred — Phase 4 accessibility pass |
| /products landmark-one-main | /products | Deferred — wrap in `<main>` |
| Actual Lighthouse numbers | all routes | **Pending Vercel preview deploy** |

---

## How to verify after Vercel deploy

```bash
# Run the existing CWV measurement script against the Vercel preview URL
SITE_URL=https://<preview>.vercel.app node scripts/measure-cwv.mjs

# Re-run axe audit
SITE_URL=https://<preview>.vercel.app node scripts/axe-audit.mjs / /products
```
