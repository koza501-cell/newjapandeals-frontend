import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | New Japan Deals',
  description: 'Contact New Japan Deals — questions about Japanese watches, orders, shipping, or bundle deals. We respond promptly.',
  alternates: { canonical: 'https://www.newjapandeals.com/contact' },
  openGraph: {
    title: 'Contact New Japan Deals',
    description: 'Questions about Japanese watches, orders, or shipping? We are real people who love watches — get in touch.',
    url: 'https://www.newjapandeals.com/contact',
    siteName: 'New Japan Deals',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact New Japan Deals' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact New Japan Deals',
    description: 'Questions about Japanese watches, orders, or shipping? Get in touch.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
