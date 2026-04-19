# On-Demand ISR Revalidation

Pages with `export const revalidate = N` are served from cache and regenerated in the background every N seconds. If you need an immediate refresh (e.g., after updating trust-stat env vars or fixing a typo), use this endpoint.

## Setup

Add `REVALIDATE_SECRET` to Vercel environment variables (Production + Preview + Development):

```
REVALIDATE_SECRET = <long random string>
```

Generate one with: `openssl rand -hex 32`

## Usage

```
GET /api/revalidate?path=<PATH>&secret=<REVALIDATE_SECRET>
```

### Examples

```bash
# Revalidate homepage (has revalidate=300)
curl "https://www.newjapandeals.com/api/revalidate?path=/&secret=YOUR_SECRET"

# Revalidate products listing
curl "https://www.newjapandeals.com/api/revalidate?path=/products&secret=YOUR_SECRET"

# Revalidate a specific product page
curl "https://www.newjapandeals.com/api/revalidate?path=/product/seiko-skx007-1234&secret=YOUR_SECRET"
```

### Success response

```json
{ "revalidated": true, "path": "/", "revalidated_at": "2026-04-19T12:00:00.000Z" }
```

### Error responses

| Status | Meaning |
|---|---|
| 401 | Wrong or missing secret |
| 400 | Missing `?path=` parameter |
| 500 | Next.js revalidatePath failed |

## When to use

| Scenario | Action |
|---|---|
| Updated trust-stat env vars in Vercel | Redeploy OR hit `/api/revalidate?path=/` |
| Added/edited a product on the backend | Webhook `/api/webhooks/product-updated` already handles Meilisearch sync; also hit `/api/revalidate?path=/product/<slug>` if you want the product page HTML to refresh immediately |
| Published a new blog post | Hit `/api/revalidate?path=/blog/<slug>` |
| Global copy edit | Redeploy is safer; on-demand only refreshes specific paths |

## Notes

- `revalidatePath` purges the server-side cache for that path. The next request re-renders the page and caches the result.
- Does **not** affect the browser or CDN cache of the previous response already received by users.
- Vercel automatically purges the CDN edge cache when revalidation is triggered.
