import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newjapandeals.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, shipping, shipping_method, totals } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lineItems: any[] = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.brand} ${item.model}`.trim() || item.title,
          description: item.title,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round((item.price_jpy / 150) * 100),
      },
      quantity: item.quantity || 1,
    }));

    if (totals.handling > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Handling Fee (10%)' },
          unit_amount: Math.round((totals.handling / 150) * 100),
        },
        quantity: 1,
      });
    }

    if (totals.shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: `Shipping — ${shipping_method.name || 'Japan Post'}` },
          unit_amount: Math.round((totals.shipping / 150) * 100),
        },
        quantity: 1,
      });
    }

    if (totals.insurance > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping Insurance' },
          unit_amount: Math.round((totals.insurance / 150) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      success_url: `${SITE_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout`,
      metadata: {
        customer_name: `${customer.firstName} ${customer.lastName}`,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: JSON.stringify(shipping),
        shipping_method: shipping_method.name || '',
        shipping_method_id: String(shipping_method.id || ''),
        item_count: String(items.length),
        total_jpy: String(totals.total),
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error('Stripe session error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ success: false, error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email,
        amount_total: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
