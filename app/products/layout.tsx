import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Japanese Watches | New Japan Deals',
  description: 'Browse authentic Japanese watches — Seiko, Casio, G-Shock, Citizen, Orient and more. Direct from Japan with zero proxy fees.',
  alternates: { canonical: 'https://www.newjapandeals.com/products' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
