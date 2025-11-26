import { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getProducts, Product } from '@/lib/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Japanese Watches | Seiko, Citizen, G-Shock & More',
  description: 'Browse our complete collection of authentic Japanese watches. Seiko, Citizen, Casio G-Shock, Orient, vintage timepieces and more. Ships worldwide from Japan.',
  alternates: {
    canonical: 'https://newjapandeals.com/products',
  },
};

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function ProductsPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || '1');
  const sort = searchParams.sort || 'newest';
  const brand = searchParams.brand;
  const condition = searchParams.condition;
  
  let products: Product[] = [];
  let pagination = { page: 1, limit: 20, total: 0, pages: 0 };
  
  try {
    const res = await getProducts({ page, sort, brand });
    products = res.data || [];
    pagination = res.pagination || pagination;
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-6">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="text-gray-900">All Watches</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">
        Japanese Watches
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b">
        <select
          className="px-4 py-2 border rounded-lg bg-white"
          defaultValue={sort}
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set('sort', e.target.value);
            window.location.href = url.toString();
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <select
          className="px-4 py-2 border rounded-lg bg-white"
          defaultValue={brand || ''}
          onChange={(e) => {
            const url = new URL(window.location.href);
            if (e.target.value) {
              url.searchParams.set('brand', e.target.value);
            } else {
              url.searchParams.delete('brand');
            }
            window.location.href = url.toString();
          }}
        >
          <option value="">All Brands</option>
          <option value="Seiko">Seiko</option>
          <option value="Citizen">Citizen</option>
          <option value="Casio">Casio</option>
          <option value="Orient">Orient</option>
        </select>

        <select
          className="px-4 py-2 border rounded-lg bg-white"
          defaultValue={condition || ''}
          onChange={(e) => {
            const url = new URL(window.location.href);
            if (e.target.value) {
              url.searchParams.set('condition', e.target.value);
            } else {
              url.searchParams.delete('condition');
            }
            window.location.href = url.toString();
          }}
        >
          <option value="">All Conditions</option>
          <option value="Brand New">Brand New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-gray-600 mb-6">
        Showing {products.length} of {pagination.total} watches
      </p>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
          <Link href="/products" className="text-primary hover:underline mt-2 inline-block">
            View all products
          </Link>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <Link
              href={`/products?page=${page - 1}&sort=${sort}`}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Link
                key={pageNum}
                href={`/products?page=${pageNum}&sort=${sort}`}
                className={`px-4 py-2 border rounded-lg ${
                  pageNum === page ? 'bg-primary text-white' : 'hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}

          {page < pagination.pages && (
            <Link
              href={`/products?page=${page + 1}&sort=${sort}`}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-16 pt-8 border-t">
        <h2 className="text-2xl font-display font-bold mb-4">
          Buy Authentic Japanese Watches Online
        </h2>
        <div className="prose text-gray-700 max-w-none">
          <p>
            Discover our extensive collection of authentic Japanese watches, sourced directly from Japan. 
            From iconic Seiko timepieces to rugged Casio G-Shocks, elegant Citizen Eco-Drives to classic Orient watches, 
            we offer the finest selection of Japanese horology at competitive prices.
          </p>
          <p>
            Every watch in our collection is carefully inspected and authenticated before shipping. 
            We provide detailed photos and descriptions so you know exactly what you're getting. 
            With worldwide shipping and secure payment options, buying Japanese watches has never been easier.
          </p>
        </div>
      </section>
    </div>
  );
}
