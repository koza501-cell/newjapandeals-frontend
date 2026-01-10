import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Frequently Asked Questions | New Japan Deals',
  description: 'Get answers about buying Japanese watches: shipping times, payment methods, returns policy, authenticity verification, and more. Everything you need to know.',
  keywords: 'FAQ Japanese watches, shipping from Japan, buy watches Japan, proxy service alternative, Japanese watch questions',
  openGraph: {
    title: 'Frequently Asked Questions | New Japan Deals',
    description: 'Everything you need to know about buying authentic Japanese watches from New Japan Deals.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://newjapandeals.com/faq',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
