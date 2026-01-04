const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.newjapandeals.com';

export interface Product {
  id: number;
  sku: string;
  slug: string;
  title_en: string;
  title_jp?: string;
  description_en?: string;
  description_jp?: string;
  brand?: string;
  model?: string;
  reference_number?: string;
  condition: string;
  price_jpy: number;
  price_usd: number;
  price_eur: number;
  price_gbp: number;
  weight_g: number;
  image_1?: string;
  image?: string;
  images?: string[];
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  image_6?: string;
  image_7?: string;
  image_8?: string;
  image_9?: string;
  image_10?: string;
  status: string;
  featured: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
}

export interface Category {
  id: number;
  name_en: string;
  name_jp?: string;
  slug: string;
  parent_id?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Fetch wrapper with error handling
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  
  return res.json();
}

// Products API
export async function getProducts(params?: {
  page?: number;
  limit?: number;
  brand?: string;
  category?: string;
  sort?: string;
  search?: string;
}): Promise<ApiResponse<Product[]>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.brand) searchParams.set('brand', params.brand);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.search) searchParams.set('search', params.search);
  
  const query = searchParams.toString();
  return fetchApi(`/api/products${query ? `?${query}` : ''}`);
}

export async function getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
  return fetchApi(`/api/products/slug/${slug}`);
}

export async function getProductById(id: number): Promise<ApiResponse<Product>> {
  return fetchApi(`/api/products/${id}`);
}

export async function getFeaturedProducts(limit = 8): Promise<ApiResponse<Product[]>> {
  return fetchApi(`/api/products/featured?limit=${limit}`);
}

export async function getNewArrivals(limit = 8): Promise<ApiResponse<Product[]>> {
  return fetchApi(`/api/products/new-arrivals?limit=${limit}`);
}

// Categories API
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return fetchApi('/api/categories');
}

export async function getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
  return fetchApi(`/api/categories/${slug}`);
}

export async function getCategoryProducts(slug: string, page = 1): Promise<ApiResponse<Product[]> & { category: Category }> {
  return fetchApi(`/api/categories/${slug}/products?page=${page}`);
}

// Brands API
export async function getBrands(): Promise<ApiResponse<{ brand: string; product_count: number }[]>> {
  return fetchApi('/api/brands');
}

export async function getBrandProducts(brand: string, page = 1): Promise<ApiResponse<Product[]>> {
  return fetchApi(`/api/brands/${encodeURIComponent(brand)}/products?page=${page}`);
}

// Shipping API
export async function calculateShipping(countryCode: string, weightG: number): Promise<{
  success: boolean;
  zone_name: string;
  options: Record<string, {
    service_name: string;
    price_jpy: number;
    estimated_days_min: number;
    estimated_days_max: number;
  }>;
}> {
  return fetchApi('/api/shipping/calculate', {
    method: 'POST',
    body: JSON.stringify({ country_code: countryCode, weight_g: weightG }),
  });
}

// Orders API
export async function createOrder(orderData: {
  product_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipping_method: string;
}): Promise<{ success: boolean; order: any }> {
  return fetchApi('/api/orders/create', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function trackOrder(orderNumber: string, email: string): Promise<{ success: boolean; data: any }> {
  return fetchApi(`/api/orders/track?order_number=${orderNumber}&email=${email}`);
}

// Helper: Get all product images as array
export function getProductImages(product: Product): string[] {
  const images: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const img = product[`image_${i}` as keyof Product] as string;
    if (img) images.push(img);
  }
  return images;
}

// Helper: Format price
export function formatPrice(amount: number, currency: string = 'JPY'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount);
}
