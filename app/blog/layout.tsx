import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | New Japan Deals',
  description: 'Watch news, buying guides, and insights from New Japan Deals. Everything you need to know about Japanese watches.',
  alternates: { canonical: 'https://www.newjapandeals.com/blog' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
