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
          '/*?add-to-cart=',
          '/*?min_price=',
          '/*?max_price=',
          '/*?orderby=',
          '/*?per_page=',
          '/*?stock_status=',
          '/*?shop_view=',
          '/*?taxonomy=',
          '/*?remove_item=',
          '/*?wpnonce=',
          '/product-tag/',
          '/product-brands/',
          '/new-arrival/',
        ],
      },
    ],
    sitemap: 'https://www.newjapandeals.com/sitemap.xml',
  };
}
