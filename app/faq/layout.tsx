import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | New Japan Deals',
  description: 'Frequently asked questions about buying Japanese watches from New Japan Deals. Shipping, payment, authenticity, returns, and more.',
  alternates: { canonical: 'https://www.newjapandeals.com/faq' },
  openGraph: {
    title: 'FAQ — Buying Japanese Watches Direct from Japan | New Japan Deals',
    description: 'Everything you need to know: shipping times, payment methods, watch condition, authenticity, returns, and more.',
    url: 'https://www.newjapandeals.com/faq',
    siteName: 'New Japan Deals',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FAQ - New Japan Deals' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ — Buying Japanese Watches Direct from Japan | New Japan Deals',
    description: 'Everything you need to know about buying Japanese watches from New Japan Deals.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
