import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Buy From Us | New Japan Deals',
  description: 'Why New Japan Deals? Zero proxy fees, single payment, licensed dealer, expert packaging. Save 20-40% vs proxy services.',
  alternates: { canonical: 'https://www.newjapandeals.com/why-us' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
