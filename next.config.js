/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for better SEO
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['api.newjapandeals.com', 'static.mercdn.net', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Trailing slashes for cleaner URLs
  trailingSlash: false,
  
  // Compression
  compress: true,
  
  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
