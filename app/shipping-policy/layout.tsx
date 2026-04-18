import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | New Japan Deals',
  description: 'International shipping policy for New Japan Deals. EMS, ePacket, Airmail options. Delivery times, insurance, and expert watch packaging from Japan.',
  alternates: { canonical: 'https://www.newjapandeals.com/shipping-policy' },
  openGraph: {
    title: 'Shipping Policy | New Japan Deals',
    description: 'International shipping options, delivery times, and watch packaging details.',
    url: 'https://www.newjapandeals.com/shipping-policy',
    siteName: 'New Japan Deals',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Shipping Policy - New Japan Deals' }],
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
