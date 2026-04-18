import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Japanese Watches | New Japan Deals',
  description: 'Browse authentic Japanese watches — Seiko, Casio, G-Shock, Citizen, Orient and more. Direct from Japan with zero proxy fees. Save 20–40% vs proxy services.',
  alternates: { canonical: 'https://www.newjapandeals.com/products' },
  openGraph: {
    title: 'Shop Authentic Japanese Watches | New Japan Deals',
    description: 'Seiko, Casio, G-Shock, Citizen, Orient and more. Direct from Japan. Zero proxy fees.',
    url: 'https://www.newjapandeals.com/products',
    siteName: 'New Japan Deals',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Japanese Watches - New Japan Deals' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Authentic Japanese Watches | New Japan Deals',
    description: 'Seiko, Casio, G-Shock, Citizen, Orient and more. Direct from Japan.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
