import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | New Japan Deals',
  description: 'Shipping policy for New Japan Deals. International shipping rates, delivery times, and expert packaging.',
  alternates: { canonical: 'https://www.newjapandeals.com/shipping-policy' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
