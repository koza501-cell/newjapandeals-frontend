import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Buy From New Japan Deals? | Save 20–40% vs Proxy Services',
  description: 'Why New Japan Deals? Zero proxy fees, single transparent payment, licensed dealer since 2014, worldwide shipping. Save 20–40% compared to Buyee, ZenMarket, FromJapan.',
  alternates: { canonical: 'https://www.newjapandeals.com/why-us' },
  openGraph: {
    title: 'Why Buy From New Japan Deals? Save 20–40% vs Proxy Services',
    description: 'Zero proxy fees. Single payment. Licensed Japanese dealer since 2014. Save vs Buyee, ZenMarket, FromJapan.',
    url: 'https://www.newjapandeals.com/why-us',
    siteName: 'New Japan Deals',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Why New Japan Deals' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why Buy From New Japan Deals? Save 20–40% vs Proxy Services',
    description: 'Zero proxy fees. Single payment. Licensed Japanese dealer since 2014.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
