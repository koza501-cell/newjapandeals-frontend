import { MetadataRoute } from 'next';

const API_URL = 'https://api.newjapandeals.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://newjapandeals.com';

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

  // Fetch all products for dynamic pages
  let productPages: MetadataRoute.Sitemap = [];
  
  try {
    const res = await fetch(`${API_URL}/api/products.php?status=published`, {
      cache: 'no-store',
    });
    const data = await res.json();
    
    if (data.success && data.products) {
      productPages = data.products.map((product: { slug: string; updated_at?: string }) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  return [...staticPages, ...productPages];
}
```

Push to GitHub. After deploy, your sitemap will be at:
```
https://newjapandeals.com/sitemap.xml
