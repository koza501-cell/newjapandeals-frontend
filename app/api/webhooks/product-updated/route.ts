import { NextRequest, NextResponse } from 'next/server';
import { Meilisearch } from 'meilisearch';

export const dynamic = 'force-dynamic';

/**
 * Incremental Meilisearch sync webhook.
 *
 * Called by the NJD backend (PHP) when a product is created, updated, or deleted.
 * Payload: { event: 'created'|'updated'|'deleted', product: { id, slug, ... } }
 *
 * Secure with X-NJD-Webhook-Secret header matched against NJD_WEBHOOK_SECRET env var.
 *
 * PHP call example (add to products.php save logic):
 *   $payload = json_encode(['event' => 'updated', 'product' => $product]);
 *   $ch = curl_init('https://www.newjapandeals.com/api/webhooks/product-updated');
 *   curl_setopt_array($ch, [
 *     CURLOPT_POST => true,
 *     CURLOPT_POSTFIELDS => $payload,
 *     CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'X-NJD-Webhook-Secret: ' . NJD_WEBHOOK_SECRET],
 *   ]);
 *   curl_exec($ch);
 */

function getClient(): Meilisearch | null {
  const host   = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_ADMIN_KEY;
  if (!host || !apiKey) return null;
  return new Meilisearch({ host, apiKey });
}

function verifyWebhookSecret(req: NextRequest): boolean {
  const secret = process.env.NJD_WEBHOOK_SECRET;
  if (!secret) return false; // Always require a secret for webhooks
  return req.headers.get('x-njd-webhook-secret') === secret;
}

function normalisePriceBucket(priceJpy: number): string {
  if (priceJpy < 10000)  return 'under_10k';
  if (priceJpy < 30000)  return 'under_30k';
  if (priceJpy < 60000)  return 'under_60k';
  if (priceJpy < 100000) return 'under_100k';
  return 'over_100k';
}

export async function POST(req: NextRequest) {
  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = getClient();
  if (!client) {
    // Meilisearch not configured — acknowledge the webhook silently
    return NextResponse.json({ ok: true, skipped: 'meilisearch_not_configured' });
  }

  let body: { event: string; product: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { event, product } = body;
  if (!event || !product) {
    return NextResponse.json({ error: 'Missing event or product' }, { status: 400 });
  }

  const index = client.index('products');
  const docId = String(product.id ?? product.slug);

  if (event === 'deleted') {
    const task = await index.deleteDocument(docId);
    return NextResponse.json({ ok: true, event, task_uid: task.taskUid });
  }

  if (event === 'created' || event === 'updated') {
    const priceJpy = Number(product.price_jpy ?? product.price ?? 0);
    const doc = {
      id:               docId,
      slug:             product.slug,
      brand:            product.brand            ?? '',
      model:            product.model            ?? '',
      reference_number: product.reference_number ?? '',
      title:            product.title            ?? `${product.brand ?? ''} ${product.model ?? ''}`.toString().trim(),
      condition:        product.condition        ?? '',
      tags:             Array.isArray(product.tags) ? product.tags : [],
      price_jpy:        priceJpy,
      price_bucket:     normalisePriceBucket(priceJpy),
      in_stock:         product.status === 'published' && !product.sold,
      image_1:          product.image_1 ?? null,
      created_at:       product.created_at ?? null,
    };
    const task = await index.addDocuments([doc], { primaryKey: 'id' });
    return NextResponse.json({ ok: true, event, task_uid: task.taskUid });
  }

  return NextResponse.json({ error: `Unknown event: ${event}` }, { status: 400 });
}
