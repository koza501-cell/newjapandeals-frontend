import type { Metadata } from 'next';
import { Playfair_Display, Inter, Source_Sans_3, Noto_Sans_JP } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustRibbon from '@/components/TrustRibbon';
import { CartProvider } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { WishlistProvider } from '@/context/WishlistContext';

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

// Source Sans Pro was renamed to Source Sans 3 on Google Fonts
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-source-sans',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.newjapandeals.com'),
  title: 'New Japan Deals — Buy Authentic Japanese Watches Direct from Japan',
  description: 'Buy authentic Japanese watches direct from Japan. Seiko, Casio, G-Shock, Citizen, Orient & more. Zero proxy fees, single payment, expert packaging. Save 20–40% vs Buyee, ZenMarket, FromJapan.',
  keywords: 'Japanese watches, buy watches from Japan, Seiko, Casio, G-Shock, Orient, Citizen, JDM watches, vintage Japanese watches, Japan direct shipping, no proxy fees',
  openGraph: {
    title: 'New Japan Deals — Buy Authentic Japanese Watches Direct from Japan',
    description: 'Authentic Japanese watches shipped directly from Japan. Zero proxy fees. Save 20–40% vs Buyee & ZenMarket.',
    type: 'website',
    locale: 'en_US',
    siteName: 'New Japan Deals',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'New Japan Deals - Authentic Japanese Watches',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Japan Deals — Buy Authentic Japanese Watches Direct from Japan',
    description: 'Authentic Japanese watches shipped directly from Japan. Zero proxy fees. Save 20–40%.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.newjapandeals.com',
    languages: {
      'en': 'https://www.newjapandeals.com',
      'x-default': 'https://www.newjapandeals.com',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${sourceSans.variable} ${notoSansJP.variable}`}>
      <head>
        {/* Preconnect hints for faster loading */}
        <link rel="preconnect" href="https://api.newjapandeals.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.newjapandeals.com" />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "New Japan Deals",
              "legalName": "Yamada Trade LLC (合同会社山田トレード)",
              "url": "https://www.newjapandeals.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.newjapandeals.com/og-image.png",
                "width": 1200,
                "height": 630
              },
              "description": "Authentic Japanese watches shipped directly from Japan. Licensed antique dealer (古物商許可 第441200001622号) since 2014. Zero proxy fees.",
              "foundingDate": "2014",
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "Chiba Prefecture",
                "addressCountry": "JP"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://www.newjapandeals.com/contact",
                "availableLanguage": ["English", "Japanese"]
              },
              "knowsAbout": ["Japanese watches", "Seiko", "Casio", "G-Shock", "Citizen", "Orient", "vintage watches", "JDM watches"]
            })
          }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "New Japan Deals",
              "url": "https://www.newjapandeals.com",
              "description": "Buy authentic Japanese watches direct from Japan. Zero proxy fees.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.newjapandeals.com/products?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZB210DBEN4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZB210DBEN4');
          `}
        </Script>
        
        <CurrencyProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <TrustRibbon />
              {children}
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
