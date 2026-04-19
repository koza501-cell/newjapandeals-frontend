# LiveTrustBar — Architecture & Operations

## Overview

The LiveTrustBar is a 4-card horizontal strip placed between the Hero and SavingsCalculator on the homepage. It displays live social proof from Mercari seller accounts, a seller-level badge, and shipping statistics.

---

## Data flow

```
Vercel env vars
    │
    ▼ (priority 1)
/api/trust-stats  ──────────────────────────────────────────────────────┐
    │ (priority 2: in-memory scraper cache, TTL 1 hour)                 │
    │ (priority 3: config/trust-stats.json fallback)                    │
    │                                                                    │
    ▼                                                                    │
LiveTrustBar (client)                                                   │
    └── SWR poll every 1 hour                                           │
    └── fallbackData from server prefetch in app/page.tsx  ────────────┘
```

---

## Env var schema

Set all of these in **Vercel → Settings → Environment Variables** for Production + Preview + Development.

| Variable | Example value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.newjapandeals.com` | Enables server-side prefetch in `app/page.tsx` |
| `NJD_MERCARI_1_NAME` | `yamada_shop` | Display name for account 1 |
| `NJD_MERCARI_1_RATING` | `5.0` | Star rating for account 1 |
| `NJD_MERCARI_1_REVIEW_COUNT` | `327` | Review count for account 1 |
| `NJD_MERCARI_1_URL` | `https://jp.mercari.com/user/profile/697549444` | Public profile URL for account 1 |
| `NJD_MERCARI_2_NAME` | `有くん ショップ` | Display name for account 2 |
| `NJD_MERCARI_2_RATING` | `5.0` | Star rating for account 2 |
| `NJD_MERCARI_2_REVIEW_COUNT` | `1715` | Review count for account 2 |
| `NJD_MERCARI_2_URL` | `https://jp.mercari.com/user/profile/238989929` | Public profile URL for account 2 |
| `NJD_MERCARI_SELLER_LEVEL` | `10` | Seller tier (1–10). Set to `""` to opt out (see below). |
| `NJD_MERCARI_LEVEL_ACCOUNT` | `有くん ショップ` | Which account holds the Level badge |
| `NJD_SHIPPED_2025` | `100` | Watches shipped in 2025 |
| `NJD_COUNTRIES_SHIPPED` | `15` | Distinct destination countries |

### Combined rating calculation

`combined.rating = Σ(rating_i × reviewCount_i) / Σ(reviewCount_i)`, rounded to 1 decimal.

Example: (5.0 × 327 + 5.0 × 1715) / (327 + 1715) = 5.0

---

## Response schema (`/api/trust-stats`)

```json
{
  "mercari": {
    "combined": {
      "rating": 5.0,
      "reviewCount": 2042,
      "accountCount": 2
    },
    "accounts": [
      { "name": "yamada_shop",    "rating": 5.0, "reviewCount": 327,  "url": "https://jp.mercari.com/user/profile/697549444" },
      { "name": "有くん ショップ", "rating": 5.0, "reviewCount": 1715, "url": "https://jp.mercari.com/user/profile/238989929" }
    ]
  },
  "level": {
    "seller": 10,
    "account": "有くん ショップ",
    "url": "https://jp.mercari.com/user/profile/238989929"
  },
  "shipped2025": 100,
  "countries": 15,
  "updatedAt": "2026-04-19T00:00:00.000Z",
  "source": "env"
}
```

`source` values: `"env"` (live env vars), `"cache"` (nightly scraper), `"fallback"` (config/trust-stats.json).

---

## Updating numbers at runtime (no redeploy needed)

If you update Vercel env vars, use on-demand revalidation to flush the ISR cache immediately:

```bash
curl "https://www.newjapandeals.com/api/revalidate?path=/&secret=YOUR_REVALIDATE_SECRET"
```

The client SWR cache refreshes automatically within 1 hour regardless.

See [docs/revalidation.md](./revalidation.md) for full usage.

---

## Level card opt-out

If the seller level drops or you want to show a generic trust signal instead:

1. Set `NJD_MERCARI_SELLER_LEVEL=""` (empty string) in Vercel.
2. Trigger revalidation: `GET /api/revalidate?path=/&secret=...`

The Level card will render a **"本人確認済 · Identity Verified"** fallback badge instead of the level number. No code changes needed.

To restore, set `NJD_MERCARI_SELLER_LEVEL=<number>` and revalidate again.

---

## Nightly scraper (`/api/cron/scrape-marketplace-ratings`)

- Scrapes **both** Mercari profile URLs extracted from `NJD_MERCARI_1_URL` / `NJD_MERCARI_2_URL`.
- Writes result to the in-memory scraper cache via `setScraperCache()`.
- The `/api/trust-stats` route reads from this cache when env vars are not set.
- If a scrape fails, the previous fallback value is preserved — zeros are never written.
- Triggered by Vercel Cron (see `vercel.json`) or manually:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://www.newjapandeals.com/api/cron/scrape-marketplace-ratings
```

---

## Analytics events

Every card click fires:

```js
gtag('event', 'trust_bar_click', {
  stat: 'mercari' | 'level' | 'shipped' | 'countries',
  account?: 'yamada_shop' | '有くん ショップ'  // only on popover account link clicks
})
```
