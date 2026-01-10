import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Our Story | New Japan Deals',
  description: 'Learn about New Japan Deals - a licensed Japanese watch dealer since 2014. Yamada Trade LLC, officially registered in Chiba, Japan. Antique Dealer License #441200001622.',
  keywords: 'New Japan Deals, Yamada Trade, Japanese watch dealer, licensed dealer Japan, about us',
  openGraph: {
    title: 'About New Japan Deals | Licensed Japanese Watch Dealer',
    description: 'From a childhood passion to connecting watch lovers worldwide with Japan\'s hidden treasures.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://newjapandeals.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
