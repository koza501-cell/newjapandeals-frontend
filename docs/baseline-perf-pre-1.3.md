# Performance Baseline — Pre Prompt 1.3

**Date:** 2026-04-19
**Methodology:** Playwright + system Chrome, mobile 4G throttle (20Mbps/10Mbps, 85ms RTT), 4× CPU throttle, Pixel 5 UA (412×915px). Each route measured once from local machine in Tokyo timezone.

> **Note:** Formal Lighthouse scores (0–100) require the Lighthouse CLI, which has a Node v24 compatibility issue at time of writing. The raw CWV numbers below are authoritative — the Lighthouse score is derived from these same metrics. Lighthouse CLI will be re-tested once `lighthouse@13` or a Node-v24-compatible release ships. PageSpeed Insights API quota was also exhausted during measurement.

## Results

| Metric | / (Homepage) | /products | /product/swat-supernatural-5ef8 |
|---|---|---|---|
| **TTFB** | 3,752 ms ⚠️ | 50 ms ✅ | 1,093 ms ⚠️ |
| **FCP** | 10,872 ms 🔴 | 2,664 ms 🟡 | 4,672 ms 🔴 |
| **LCP** | 10,872 ms 🔴 | 2,664 ms 🟡 | 4,672 ms 🔴 |
| **CLS** | 0.000 ✅ | 0.424 🔴 | 0.000 ✅ |
| **JS (transfer)** | 112 KB | 101 KB | 122 KB |
| **Total transfer** | 334 KB | 325 KB | 351 KB |

Legend: ✅ Good · 🟡 Needs Improvement · 🔴 Poor (based on Core Web Vitals thresholds)

## Thresholds (Google CWV)

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP | < 2.5s | 2.5–4s | > 4s |
| FCP | < 1.8s | 1.8–3s | > 3s |
| CLS | < 0.1 | 0.1–0.25 | > 0.25 |
| TTFB | < 800ms | 800ms–1.8s | > 1.8s |

## Key Findings & Recommended Fixes

### 🔴 Homepage TTFB 3,752ms (Critical)
The homepage HTML takes ~3.75s to start arriving. Likely causes:
- Vercel cold start — homepage may be dynamically rendered (not static/ISR)
- Heavy data fetch during SSR (products API, etc.)
- **Fix:** Add `export const revalidate = 3600` or `dynamic = 'force-static'` to `app/page.tsx` to use ISR. Pre-render the shell statically.

### 🔴 Homepage FCP/LCP 10,872ms (Critical)
FCP equals LCP, and both are ~11s. This means the browser received the HTML at 3.75s but then blocked for another 7 seconds. Likely causes:
- Render-blocking Google Fonts (`@import url()` in globals.css is synchronous)
- Large above-the-fold images not preloaded
- Font display: block causing invisible text
- **Fix:** Remove `@import` from CSS, use Next.js `next/font` (already loaded in layout.tsx for Playfair/Inter, but `globals.css` still has a redundant `@import` for Source Sans Pro / Noto Sans JP). Also add `<link rel="preload">` for hero image.

### 🔴 /products CLS 0.424 (Critical)
Layout shifts after initial render — likely caused by:
- Product images loading without explicit width/height (causes reflow)
- Filter pills or sort dropdown appearing after hydration
- Currency conversion text swapping
- **Fix:** Add explicit `width` and `height` props to all `<Image>` components; use `aspect-ratio` CSS for product cards; reserve space for dynamic content during SSR.

### 🟡 /products FCP/LCP 2,664ms (Needs Improvement)
Borderline — close to the 2.5s good threshold. Acceptable for now but will worsen as more sections are added.

### /product page TTFB 1,093ms (Needs Improvement)
Product pages are likely dynamically rendered per-slug. Add ISR with `revalidate = 86400`.

## Bundle Analysis

| Route | JS (transfer) | Total transfer |
|---|---|---|
| / | 112 KB | 334 KB |
| /products | 101 KB | 325 KB |
| /product/<slug> | 122 KB | 351 KB |

JS bundle sizes are healthy. The overhead is in HTML/CSS/fonts/images rather than JavaScript.

## Search Benchmark (PHP API, 20 queries)

Measured simultaneously with the above — see `scripts/benchmark-search.mjs` output:

| Stat | Value |
|---|---|
| Engine | PHP API (Meilisearch not yet configured) |
| Avg | 94.7ms |
| p50 | 93.4ms |
| p95 | 112.3ms |
| p99 | 112.3ms |
| Min | 88.9ms |
| Max | 112.3ms |
| < 150ms | 20/20 (100%) |

PHP search meets the < 150ms target. Meilisearch will target < 30ms once configured.

## Action Items Before Prompt 1.4

1. Remove `@import url(...)` from `globals.css` — replace with `next/font` or swap to `font-display: optional`
2. Add `export const revalidate = 3600` to homepage to enable ISR
3. Investigate `/products` CLS=0.424 — most likely missing image dimensions
