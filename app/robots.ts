import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/checkout',
          '/cart',
          '/order-confirmation',
        ],
      },
      { userAgent: 'GPTBot',         allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'ClaudeBot',       allow: '/' },
      { userAgent: 'PerplexityBot',   allow: '/' },
      { userAgent: 'Amazonbot',       allow: '/' },
      { userAgent: 'Applebot',        allow: '/' },
    ],
    sitemap: 'https://www.newjapandeals.com/sitemap.xml',
  };
}
