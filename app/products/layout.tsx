import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Japanese Watches for Sale | Authentic Timepieces from Japan | New Japan Deals',
  description: 'Browse our collection of authentic Japanese watches. Seiko, Casio, Citizen, Orient & more. Direct from Japan with zero proxy fees. Ships worldwide.',
  keywords: 'Japanese watches, Seiko watches, Casio watches, Citizen watches, Orient watches, buy Japanese watches, Japan direct shipping',
  openGraph: {
    title: 'Japanese Watches for Sale | New Japan Deals',
    description: 'Authentic Japanese watches shipped directly from Japan. Zero proxy fees.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://newjapandeals.com/products',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
