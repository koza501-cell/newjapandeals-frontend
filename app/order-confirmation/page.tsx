'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface OrderDetails {
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_jpy: number;
  status: string;
  items: Array<{
    product_title: string;
    price_jpy: number;
  }>;
  shipping_method: string;
  shipping_address: {
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');
  const orderNumber = searchParams.get('order');

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
      // Clear cart after successful order
      localStorage.removeItem('njd_cart');
      localStorage.removeItem('njd_shipping');
    } else {
      setError('Order not found');
      setLoading(false);
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`https://api.newjapandeals.com/api/orders.php?order_number=${orderNumber}`);
      const data = await res.json();
      
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError('Could not load order details');
      }
    } catch (err) {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#B50012] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">Your order has been placed.</p>
          {orderNumber && (
            <p className="text-gray-800 font-mono font-bold mb-4">{orderNumber}</p>
          )}
          <p className="text-gray-500 text-sm mb-6">A confirmation email will be sent shortly.</p>
          <Link href="/products" className="bg-[#B50012] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="bg-white p-8 rounded-xl shadow-lg text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">Thank you for your purchase from New Japan Deals</p>
          <div className="bg-gray-100 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-bold font-mono">{order?.order_number}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          
          {/* Items */}
          <div className="border-b pb-4 mb-4">
            <h3 className="font-medium text-gray-500 mb-2">Items</h3>
            {order?.items?.map((item, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>{item.product_title}</span>
                <span className="font-medium">¥{parseInt(String(item.price_jpy)).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg font-bold">
            <span>Total Paid</span>
            <span className="text-[#B50012]">¥{parseInt(String(order?.total_jpy || 0)).toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-500 mb-2">Ship To</h3>
              <p className="font-medium">{order?.customer_name}</p>
              {order?.shipping_address && (
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
              <p className="font-medium">{order?.shipping_method || 'Japan Post'}</p>
              <p className="text-sm text-gray-500 mt-2">
                Tracking number will be sent to <strong>{order?.customer_email}</strong> once shipped.
              </p>
            </div>
          </div>
        </div>

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

        {/* Contact & Continue */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="bg-[#B50012] text-white px-8 py-3 rounded-lg hover:bg-red-700 transition text-center font-medium">
            Continue Shopping
          </Link>
          <a href="mailto:yamadatrade11@gmail.com" className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition text-center font-medium">
            Contact Support
          </a>
        </div>

        {/* Confirmation Email Notice */}
        <p className="text-center text-gray-500 text-sm mt-8">
          A confirmation email has been sent to <strong>{order?.customer_email}</strong>
        </p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#B50012] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
