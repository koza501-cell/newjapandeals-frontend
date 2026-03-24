import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | New Japan Deals',
  description: 'Frequently asked questions about buying Japanese watches from New Japan Deals. Shipping, payment, authenticity, and more.',
  alternates: { canonical: 'https://www.newjapandeals.com/faq' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
