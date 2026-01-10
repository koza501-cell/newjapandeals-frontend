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
  title: 'New Japan Deals - Premium Japanese Watches',
  description: 'Authentic Japanese watches shipped directly from Japan. Zero proxy fees, single payment, expert packaging.',
  keywords: 'Japanese watches, Seiko, Casio, G-Shock, Orient, Citizen, Japan direct shipping',
  openGraph: {
    title: 'New Japan Deals - Premium Japanese Watches',
    description: 'Authentic Japanese watches shipped directly from Japan.',
    type: 'website',
    locale: 'en_US',
    siteName: 'New Japan Deals',
  },
    twitter: {
          card: 'summary_large_image',
          title: 'New Japan Deals - Premium Japanese Watches',
          description: 'Authentic Japanese watches shipped directly from Japan.',
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
