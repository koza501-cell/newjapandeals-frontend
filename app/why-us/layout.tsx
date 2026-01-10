import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Buy Direct from Japan | Save 20-40% vs Proxy Services | New Japan Deals',
  description: 'Compare New Japan Deals vs proxy services like Buyee, ZenMarket, FromJapan. Save 20-40% with zero service fees, single payment, expert watch packing.',
  keywords: 'proxy service alternative, Buyee alternative, ZenMarket alternative, buy Japanese watches direct, save on proxy fees',
  openGraph: {
    title: 'Why Buy Direct from Japan | New Japan Deals',
    description: 'Skip proxy services and save 20-40%. Direct from a trusted 10-year Japanese watch dealer.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://newjapandeals.com/why-us',
  },
};

export default function WhyUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
