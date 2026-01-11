'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TrustBar from '@/components/TrustBar';

const API_URL = 'https://api.newjapandeals.com';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string;
  author: string;
  category: string;
  tags: string;
  published_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const url = selectedCategory 
          ? `${API_URL}/api/blog.php?category=${encodeURIComponent(selectedCategory)}`
          : `${API_URL}/api/blog.php`;
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts || []);
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <main>
      <TrustBar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Expert guides, collecting tips, and news from Japan's watch market
          </p>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="py-6 bg-[#F5F5F0] border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <span className="text-gray-600 font-medium">Filter:</span>
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedCategory === '' 
                    ? 'bg-[#B50012] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Posts
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    selectedCategory === cat 
                      ? 'bg-[#B50012] text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts */}
      <section className="py-12 bg-[#F5F5F0]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#B50012] rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
              <p className="text-gray-600 mb-6">
                We're working on expert guides about Japanese watches, collecting tips, and market insights.
              </p>
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 bg-[#B50012] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Browse Watches
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  {/* Featured Image */}
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A]">
                        <span className="text-4xl">📖</span>
                      </div>
                    )}
                    {post.category && (
                      <span className="absolute top-3 left-3 bg-[#B50012] text-white text-xs font-medium px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="font-bold text-lg mb-2 text-[#1A1A1A] group-hover:text-[#B50012] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Looking for a Japanese Watch?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Browse our curated collection of authentic Japanese timepieces, all personally inspected and shipped direct from Japan.
          </p>
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 bg-[#B50012] text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Browse Watches
          </Link>
        </div>
      </section>
    </main>
  );
}
