import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.newjapandeals.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://newjapandeals.com';
  
  // Static pages
  const staticPages = [
    '',
    '/products',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/shipping-policy',
    '/returns',
    '/track-order',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Brand pages
  const brands = ['seiko', 'citizen', 'casio', 'g-shock', 'orient', 'vintage'];
  const brandPages = brands.map((brand) => ({
    url: `${baseUrl}/brand/${brand}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Fetch products for dynamic pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/products?limit=1000`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    const data = await res.json();
    
    if (data.success && data.data) {
      productPages = data.data.map((product: any) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: new Date(product.updated_at || product.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Fetch categories
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    
    if (data.success && data.data) {
      categoryPages = data.data.map((category: any) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  return [...staticPages, ...brandPages, ...categoryPages, ...productPages];
}
