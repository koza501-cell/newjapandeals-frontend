'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe' | null>(null);
  const [stripeSession, setStripeSession] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNum = params.get('order');
    const sessionId = params.get('session_id');

    localStorage.removeItem('njd_cart');
    localStorage.removeItem('njd_shipping');

    if (sessionId) {
      setPaymentMethod('stripe');
      fetchStripeSession(sessionId);
    } else if (orderNum) {
      setPaymentMethod('paypal');
      setOrderNumber(orderNum);
      fetchOrderDetails(orderNum);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStripeSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/checkout/stripe?session_id=${sessionId}`);
      const data = await res.json();
      if (data.success && data.session) {
        setStripeSession(data.session);
        setOrderNumber(data.session.id);
      }
    } catch (err) {
      console.error('Failed to fetch Stripe session:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderNum: string) => {
    try {
      const res = await fetch(`https://api.newjapandeals.com/api/orders.php?order_number=${orderNum}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#B50012] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F5F0] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="bg-white p-8 rounded-xl shadow-lg text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl text-green-600">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">Thank you for your purchase from New Japan Deals</p>
          <div className="bg-gray-100 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-bold font-mono">{orderNumber || 'N/A'}</p>
          </div>
        </div>

        {/* Stripe Order Details */}
        {paymentMethod === 'stripe' && stripeSession && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span>{stripeSession.customer_email}</span>
              </div>
              {stripeSession.metadata?.shipping_method && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Method</span>
                  <span>{stripeSession.metadata.shipping_method}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-[#B50012]">
                  ${((stripeSession.amount_total || 0) / 100).toFixed(2)} USD
                </span>
              </div>
              {stripeSession.metadata?.total_jpy && (
                <div className="text-right text-gray-500 text-xs">
                  ~¥{parseInt(stripeSession.metadata.total_jpy).toLocaleString()}
                </div>
              )}
            </div>

            {stripeSession.metadata?.shipping_address && (() => {
              try {
                const addr = JSON.parse(stripeSession.metadata.shipping_address);
                return (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium text-gray-500 mb-2">Ship To</h3>
                    <p className="font-medium">{stripeSession.metadata.customer_name}</p>
                    <p>{addr.address1}</p>
                    {addr.address2 && <p>{addr.address2}</p>}
                    <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode}</p>
                    <p>{addr.country}</p>
                  </div>
                );
              } catch { return null; }
            })()}
          </div>
        )}

        {/* PayPal Order Details */}
        {order && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            
            {/* Items */}
            <div className="border-b pb-4 mb-4">
              <h3 className="font-medium text-gray-500 mb-2">Items</h3>
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between py-2">
                  <span>{item.product_title}</span>
                  <span className="font-medium">¥{parseInt(item.price_jpy).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>¥{parseInt(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Handling</span>
                <span>¥{parseInt(order.handling_fee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>¥{parseInt(order.shipping_cost).toLocaleString()}</span>
              </div>
              {parseInt(order.insurance_fee) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance</span>
                  <span>¥{parseInt(order.insurance_fee).toLocaleString()}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-[#B50012]">¥{parseInt(order.total_jpy).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Info */}
        {order && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-500 mb-2">Ship To</h3>
                <p className="font-medium">{order.customer_name}</p>
                {order.shipping_address && (
                  <>
                    <p>{order.shipping_address.address1}</p>
                    {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</p>
                    <p>{order.shipping_address.country}</p>
                  </>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-500 mb-2">Shipping Method</h3>
                <p className="font-medium">{order.shipping_method || 'Japan Post'}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Tracking number will be sent to <strong>{order.customer_email}</strong> once shipped.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4">What Happens Next?</h2>
          <ol className="space-y-3 text-blue-700">
            <li className="flex gap-3">
              <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
              <span>We will inspect and prepare your item(s) for shipping</span>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
              <span>Your order will be shipped via Japan Post within 1-3 business days</span>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
              <span>You will receive an email with tracking information</span>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
              <span>Delivery typically takes 5-14 business days depending on your location</span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="bg-[#B50012] text-white px-8 py-3 rounded-lg hover:bg-red-700 transition text-center font-medium">
            Continue Shopping
          </Link>
          <a href="mailto:yamadatrade11@gmail.com" className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition text-center font-medium">
            Contact Support
          </a>
        </div>

        {order && (
          <p className="text-center text-gray-500 text-sm mt-8">
            A confirmation email has been sent to <strong>{order.customer_email}</strong>
          </p>
        )}
        {paymentMethod === 'stripe' && stripeSession?.customer_email && (
          <p className="text-center text-gray-500 text-sm mt-8">
            A confirmation email has been sent to <strong>{stripeSession.customer_email}</strong>
          </p>
        )}
      </div>
    </main>
  );
}
