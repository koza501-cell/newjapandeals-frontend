import { MetadataRoute } from 'next';

const BASE_URL = 'https://newjapandeals.com';
const API_URL = 'https://api.newjapandeals.com';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: ChangeFrequency;
  priority?: number;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: SitemapEntry[] = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.5,
    },
  ];

  // Fetch dynamic data
  let brandPages: SitemapEntry[] = [];
  let categoryPages: SitemapEntry[] = [];
  let productPages: SitemapEntry[] = [];

  try {
    // Fetch brands
    const brandsRes = await fetch(`${API_URL}/products/brands.php`, { next: { revalidate: 3600 } });
    if (brandsRes.ok) {
      const brandsData = await brandsRes.json();
      if (brandsData.success && brandsData.data) {
        brandPages = brandsData.data.map((brand: { slug: string }) => ({
          url: `${BASE_URL}/brands/${brand.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as ChangeFrequency,
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching brands for sitemap:', error);
  }

  try {
    // Fetch categories
    const categoriesRes = await fetch(`${API_URL}/products/categories.php`, { next: { revalidate: 3600 } });
    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json();
      if (categoriesData.success && categoriesData.data) {
        categoryPages = categoriesData.data.map((category: { slug: string }) => ({
          url: `${BASE_URL}/categories/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as ChangeFrequency,
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  try {
    // Fetch products
    const productsRes = await fetch(`${API_URL}/products/list.php?limit=1000`, { next: { revalidate: 3600 } });
    if (productsRes.ok) {
      const productsData = await productsRes.json();
      if (productsData.success && productsData.data) {
        productPages = productsData.data.map((product: { slug: string; updated_at?: string }) => ({
          url: `${BASE_URL}/products/${product.slug}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: 'weekly' as ChangeFrequency,
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  return [...staticPages, ...brandPages, ...categoryPages, ...productPages];
}
