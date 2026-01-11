'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import TrustBar from '@/components/TrustBar';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

const API_URL = 'https://api.newjapandeals.com';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  category: string;
  tags: string;
  published_at: string;
  created_at: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`${API_URL}/api/blog.php?slug=${slug}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.post) {
          setPost(data.post);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <main>
        <TrustBar />
        <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#B50012] rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">Loading article...</p>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main>
        <TrustBar />
        <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
            <p className="text-gray-600 mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 bg-[#B50012] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image || "https://newjapandeals.com/og-image.png",
    "author": {
      "@type": "Organization",
      "name": post.author || "New Japan Deals"
    },
    "publisher": {
      "@type": "Organization",
      "name": "New Japan Deals",
      "logo": {
        "@type": "ImageObject",
        "url": "https://newjapandeals.com/og-image.png"
      }
    },
    "datePublished": post.published_at,
    "dateModified": post.published_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://newjapandeals.com/blog/${post.slug}`
    }
  };

  return (
    <main>
      <TrustBar />
      
      {/* Schema */}
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://newjapandeals.com' },
          { name: 'Blog', url: 'https://newjapandeals.com/blog' },
          { name: post.title, url: `https://newjapandeals.com/blog/${post.slug}` }
        ]} 
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-300">{post.title}</span>
            </nav>

            {post.category && (
              <span className="inline-block bg-[#B50012] text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{formatDate(post.published_at)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="bg-[#F5F5F0]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto -mt-4">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-12 bg-[#F5F5F0]">
        <div className="container mx-auto px-4">
          <article className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 pb-8 border-b leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Main Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1A1A1A] prose-a:text-[#B50012] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Tags */}
            {post.tags && (
              <div className="mt-8 pt-8 border-t">
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(',').map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Back to Blog */}
          <div className="max-w-3xl mx-auto mt-8 text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-[#B50012] font-medium hover:underline"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Find Your Perfect Watch?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Browse our collection of authentic Japanese watches, all personally inspected and shipped direct from Japan.
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
