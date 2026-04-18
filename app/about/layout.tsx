import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | New Japan Deals',
  description: 'New Japan Deals is Yamada Trade LLC (合同会社山田トレード) — a licensed antique dealer in Japan (古物商許可 第441200001622号) selling authentic Japanese watches since 2014. Zero proxy fees.',
  alternates: { canonical: 'https://www.newjapandeals.com/about' },
  openGraph: {
    title: 'About New Japan Deals | Licensed Watch Dealer in Japan Since 2014',
    description: 'Yamada Trade LLC — licensed antique dealer in Chiba, Japan. Selling authentic Seiko, Casio, Citizen, Orient watches worldwide since 2014.',
    url: 'https://www.newjapandeals.com/about',
    siteName: 'New Japan Deals',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About New Japan Deals' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About New Japan Deals | Licensed Watch Dealer in Japan Since 2014',
    description: 'Licensed antique dealer in Japan selling authentic Japanese watches worldwide since 2014.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
