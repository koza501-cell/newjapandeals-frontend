import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | New Japan Deals',
  description: 'Learn about New Japan Deals — your direct source for authentic Japanese watches since 2014. Zero proxy fees, licensed dealer, expert packaging.',
  alternates: { canonical: 'https://www.newjapandeals.com/about' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
