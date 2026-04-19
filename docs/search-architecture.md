# Search Architecture

**Decision: Option A — Meilisearch Cloud (with PHP API fallback)**
**Date: 2026-04-19**

## Rationale

| Criterion | Option A (Meili Cloud) | Option B (Self-hosted) | Option C (PHP harden) |
|---|---|---|---|
| Typo tolerance | Built-in | Built-in | Approximate via SOUNDEX |
| Ranking quality | Excellent | Excellent | Coarse |
| Latency (warm) | ~15–30ms | ~15–30ms | ~80–200ms |
| Ops burden | Zero | Low (Fly.io) | None |
| Monthly cost | Free → €30/mo at 100k | ~$5/mo | $0 |
| Indexing | Webhook + nightly cron | Same | Full query each time |

Option A was chosen. The free tier covers current volume. €30/mo is acceptable once 100k searches/month are exceeded. No server to maintain. The PHP endpoint remains as a hard fallback when Meilisearch env vars are absent (development, local, emergency).

## Activation

Add these to Vercel environment variables:

```
NEXT_PUBLIC_MEILISEARCH_HOST=https://your-instance.meilisearch.io
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=<search-only public key>   # starts with "meilisearch-..."
MEILISEARCH_ADMIN_KEY=<master or default admin key>            # server-side only, never NEXT_PUBLIC_
```

When `NEXT_PUBLIC_MEILISEARCH_HOST` is not set, `SearchCommand` automatically falls back to `api.newjapandeals.com/api/products.php?search=`.

## Index: `products`

```json
{
  "uid": "products",
  "searchableAttributes": ["brand", "model", "reference_number", "title", "condition", "tags"],
  "filterableAttributes": ["brand", "condition", "price_bucket", "in_stock"],
  "sortableAttributes": ["price_jpy", "created_at"],
  "typoTolerance": {
    "enabled": true,
    "minWordSizeForTypos": { "oneTypo": 4, "twoTypos": 8 }
  },
  "pagination": { "maxTotalHits": 200 }
}
```

## Index: `blog`

```json
{
  "uid": "blog",
  "searchableAttributes": ["title", "excerpt", "content", "tags"]
}
```

## Sync Strategy

| Event | Action |
|---|---|
| Nightly 02:00 UTC | `/api/cron/reindex-meili` — full reindex from PHP API |
| Product created/updated | `/api/webhooks/product-updated` — single document upsert |
| Product deleted | Webhook sends `deleted: true` → route calls `deleteDocument` |

## Security

- `NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY` — read/search only. Safe to expose in client bundle.
- `MEILISEARCH_ADMIN_KEY` — write access. Server-side only (API routes, cron, webhook).
- Webhook endpoint protected by `X-NJD-Webhook-Secret` header matched against `NJD_WEBHOOK_SECRET` env var.
- Cron endpoints protected by `Authorization: Bearer $CRON_SECRET`.

## Latency Targets

| Path | Target | Mechanism |
|---|---|---|
| Meilisearch warm | < 50ms | Direct index query |
| PHP fallback warm | < 200ms | MySQL LIKE + indexed columns |
| First result displayed | < 150ms | 300ms debounce; results arrive before debounce fires on fast connections |
