import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Japanese Watch News & Buying Guides | New Japan Deals',
  description: 'Watch news, buying guides, and insights about Japanese watches. Seiko, Casio, G-Shock, Citizen, Orient — everything you need to know.',
  alternates: { canonical: 'https://www.newjapandeals.com/blog' },
  openGraph: {
    title: 'Blog — Japanese Watch News & Buying Guides | New Japan Deals',
    description: 'Watch news, buying guides, and insights about Japanese watches from our team in Japan.',
    url: 'https://www.newjapandeals.com/blog',
    siteName: 'New Japan Deals',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'New Japan Deals Blog' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Japanese Watch News & Buying Guides | New Japan Deals',
    description: 'Watch news, buying guides, and insights about Japanese watches.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
