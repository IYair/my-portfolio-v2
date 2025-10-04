"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarIcon, TagIcon } from "@heroicons/react/24/outline";

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

export default function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts?published=true&limit=3");
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

  const truncateContent = (content: string, maxLength: number = 120) => {
    const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <section id="blog" className="relative z-20 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold">Blog</h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-xl">
              Últimos artículos sobre desarrollo web y tecnología
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="mb-4 h-48 rounded-lg bg-gray-300 dark:bg-gray-700"></div>
                <div className="mb-2 h-4 rounded bg-gray-300 dark:bg-gray-700"></div>
                <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="blog" className="relative z-20 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold">Blog</h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-xl">
              Últimos artículos sobre desarrollo web y tecnología
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Próximamente estaré compartiendo artículos interesantes sobre desarrollo web.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="relative z-20 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold">Blog</h2>
          <p className="text-foreground/80 mx-auto max-w-3xl text-xl">
            Últimos artículos sobre desarrollo web y tecnología
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map(post => (
            <article
              key={post.id}
              className="border-foreground/10 bg-background/50 hover:bg-background/80 group rounded-lg border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
            >
              {/* Post Header */}
              <div className="mb-4">
                <h3 className="mb-2 text-xl leading-tight font-bold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                {/* Date */}
                <div className="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  {formatDate(post.createdAt)}
                </div>

                {/* Excerpt */}
                <p className="text-foreground/80 mb-4 leading-relaxed">
                  {post.excerpt || truncateContent(post.content)}
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag.id}
                        className="flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        <TagIcon className="mr-1 h-3 w-3" />
                        {tag.name}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Read More Link */}
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Leer artículo →
              </Link>
            </article>
          ))}
        </div>

        {/* View All Posts Link */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Ver todos los artículos
          </Link>
        </div>
      </div>
    </section>
  );
}
