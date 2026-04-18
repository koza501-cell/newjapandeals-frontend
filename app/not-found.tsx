import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Page Not Found | New Japan Deals',
  description: 'This page does not exist. Browse our collection of authentic Japanese watches.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-custom py-20 text-center">
      <h1 className="text-6xl font-display font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/" className="btn-primary rounded-lg">
          Go Home
        </Link>
        <Link href="/products" className="btn-secondary rounded-lg">
          Browse Watches
        </Link>
      </div>
    </div>
  );
}
