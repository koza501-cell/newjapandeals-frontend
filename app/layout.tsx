import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://newjapandeals.com'),
  title: 'New Japan Deals - Premium Japanese Watches | Direct from Japan',
  description: 'Buy authentic Japanese watches direct from Japan. Seiko, Casio, Citizen, Orient & more. Zero proxy fees, single payment, expert packaging. Save 20-40% vs proxy services.',
  keywords: 'Japanese watches, Seiko, Casio, G-Shock, Orient, Citizen, Japan direct shipping, buy watches from Japan',
  openGraph: {
    title: 'New Japan Deals - Premium Japanese Watches',
    description: 'Authentic Japanese watches shipped directly from Japan. Zero proxy fees.',
    type: 'website',
    locale: 'en_US',
    siteName: 'New Japan Deals',
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
    title: 'New Japan Deals - Premium Japanese Watches',
    description: 'Authentic Japanese watches shipped directly from Japan.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect hints for faster loading */}
        <link rel="preconnect" href="https://api.newjapandeals.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.newjapandeals.com" />
      </head>
      <body className="font-sans antialiased">
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
