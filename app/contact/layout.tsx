import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | New Japan Deals',
  description: 'Get in touch with New Japan Deals. Questions about orders, shipping, or products? We are here to help.',
  alternates: { canonical: 'https://www.newjapandeals.com/contact' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
