import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Japanese Watch Guides & News | New Japan Deals',
  description: 'Expert guides on buying Japanese watches, Seiko history, G-Shock collecting tips, and news from Japan\'s watch market. Learn from 10+ years of experience.',
  keywords: 'Japanese watch blog, Seiko guide, G-Shock collecting, vintage watch tips, Japan watch market',
  openGraph: {
    title: 'Blog | New Japan Deals',
    description: 'Expert guides and news about Japanese watches.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://newjapandeals.com/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
