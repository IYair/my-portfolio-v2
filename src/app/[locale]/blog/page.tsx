"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarIcon, TagIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  tags: { id: number; name: string }[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts?published=true");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        // Error fetching posts
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-32 rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="mb-8 h-12 w-96 rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-lg bg-gray-50 p-6 shadow-sm dark:bg-gray-800">
                  <div className="mb-3 h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
                  <div className="mb-2 h-4 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
                  <div className="mb-4 h-4 w-full rounded bg-gray-300 dark:bg-gray-700"></div>
                  <div className="h-4 w-4/5 rounded bg-gray-300 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Volver al inicio
          </Link>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Artículos sobre desarrollo web, tecnología y programación
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Aún no hay artículos publicados
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Pronto estaré compartiendo contenido interesante sobre desarrollo web y tecnología.
            </p>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map(post => (
              <article
                key={post.id}
                className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
              >
                {/* Post Header */}
                <div className="mb-4">
                  <h2 className="mb-3 text-2xl font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  {/* Meta */}
                  <div className="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {formatDate(post.createdAt)}
                    {post.featured && (
                      <span className="ml-4 rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Destacado
                      </span>
                    )}
                  </div>

                  {/* Excerpt */}
                  <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                    {post.excerpt || truncateContent(post.content)}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span
                          key={tag.id}
                          className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        >
                          <TagIcon className="mr-1 h-3 w-3" />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Read More */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Leer artículo completo →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
