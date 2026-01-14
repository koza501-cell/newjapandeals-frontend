import { MetadataRoute } from 'next';

const API_URL = 'https://api.newjapandeals.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.newjapandeals.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/why-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Fetch products
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/products.php?status=published`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (data.success && data.products) {
      productPages = data.products.map((product: any) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Sitemap products error:', error);
  }

  // Fetch blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/blog.php`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (data.success && data.posts) {
      blogPages = data.posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.published_at ? new Date(post.published_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Sitemap blog error:', error);
  }

  return [...staticPages, ...productPages, ...blogPages];
}
