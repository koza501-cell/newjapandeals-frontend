import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Default SEO metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://newjapandeals.com'),
  title: {
    default: 'New Japan Deals | Authentic Japanese Watches - Seiko, Citizen, G-Shock',
    template: '%s | New Japan Deals',
  },
  description: 'Shop authentic Japanese watches direct from Japan. Seiko, Citizen, Casio G-Shock, Orient & vintage timepieces. International shipping. Best prices guaranteed.',
  keywords: [
    'Japanese watches',
    'Seiko watches',
    'Citizen watches',
    'G-Shock',
    'Casio watches',
    'Orient watches',
    'vintage Japanese watches',
    'buy watches from Japan',
    'authentic Japanese watches',
    'Japan watch store',
  ],
  authors: [{ name: 'New Japan Deals' }],
  creator: 'New Japan Deals',
  publisher: 'New Japan Deals',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://newjapandeals.com',
    siteName: 'New Japan Deals',
    title: 'New Japan Deals | Authentic Japanese Watches',
    description: 'Shop authentic Japanese watches direct from Japan. Seiko, Citizen, G-Shock & more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'New Japan Deals - Japanese Watches',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Japan Deals | Authentic Japanese Watches',
    description: 'Shop authentic Japanese watches direct from Japan.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://newjapandeals.com',
    languages: {
      'en-US': 'https://newjapandeals.com',
      'ja-JP': 'https://newjapandeals.com/ja',
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add after setting up Search Console
  },
};

// JSON-LD Organization Schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'New Japan Deals',
  url: 'https://newjapandeals.com',
  logo: 'https://newjapandeals.com/logo.png',
  description: 'Authentic Japanese watches direct from Japan',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'JP',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@newjapandeals.com',
  },
  sameAs: [
    'https://facebook.com/newjapandeals',
    'https://instagram.com/newjapandeals',
  ],
};

// JSON-LD WebSite Schema for sitelinks search
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'New Japan Deals',
  url: 'https://newjapandeals.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://newjapandeals.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://api.newjapandeals.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#B50012" />
        
        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
