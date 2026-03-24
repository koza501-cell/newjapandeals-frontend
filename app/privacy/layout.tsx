import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | New Japan Deals',
  description: 'Privacy policy for New Japan Deals. How we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://www.newjapandeals.com/privacy' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
