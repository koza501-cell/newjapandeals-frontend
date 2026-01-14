import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/wp-content/',
          '/wp-admin/',
          '/wp-includes/',
          '/wp-json/',
          '/?p=',
          '/product-category/',
          '/shop/',
          '/xmlrpc.php',
          '/wp-login.php',
          '/feed/',
          '/trackback/',
          '/comments/',
          '/api/',
          '/admin/',
          '/checkout',
          '/cart',
          '/order-success',
        ],
      },
    ],
    sitemap: 'https://www.newjapandeals.com/sitemap.xml',
  };
}
