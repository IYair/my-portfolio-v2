"use client";

import { CalendarIcon, TagIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
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
        const response = await fetch("/api/posts?published=true&limit=7");
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

  // Layout: 3 posts left + 1 featured center + 3 posts right
  const [featuredPost, ...otherPosts] = posts;
  const leftPosts = otherPosts.slice(0, 3);
  const rightPosts = otherPosts.slice(3, 6);

  return (
    <section id="blog" className="relative z-20 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold">Blog</h2>
          <p className="text-foreground/80 mx-auto max-w-3xl text-xl">
            Últimos artículos sobre desarrollo web y tecnología
          </p>
        </div>

        {/* Magazine Layout: 3 Left + 1 Featured Center + 3 Right */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - 3 Small Posts */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            {leftPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="border-foreground/10 bg-background/50 hover:bg-background/80 overflow-hidden rounded-lg border backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                  {post.coverImage && (
                    <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover !transition-transform !duration-[800ms] !ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        style={{ transition: "transform 800ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm leading-tight font-bold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Center Column - 1 Large Featured Post */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className="group lg:col-span-6">
              <article className="border-foreground/10 bg-background/50 hover:bg-background/80 h-full overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-1000 hover:shadow-xl">
                {featuredPost.coverImage && (
                  <div className="relative h-[400px] overflow-hidden bg-gray-200 dark:bg-gray-800">
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover !transition-transform !duration-[800ms] !ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      style={{ transition: "transform 800ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                    />
                  </div>
                )}
                <div className="p-8">
                  <h3 className="mb-4 text-3xl leading-tight font-bold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {featuredPost.title}
                  </h3>
                  <div className="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {formatDate(featuredPost.createdAt)}
                  </div>
                  <p className="text-foreground/80 mb-6 line-clamp-3 text-lg leading-relaxed">
                    {featuredPost.excerpt || truncateContent(featuredPost.content, 200)}
                  </p>
                  {featuredPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag.id}
                          className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        >
                          <TagIcon className="mr-1 h-4 w-4" />
                          {tag.name}
                        </span>
                      ))}
                      {featuredPost.tags.length > 3 && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          +{featuredPost.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          )}

          {/* Right Column - 3 Small Posts */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            {rightPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="border-foreground/10 bg-background/50 hover:bg-background/80 overflow-hidden rounded-lg border backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                  {post.coverImage && (
                    <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover !transition-transform !duration-[800ms] !ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        style={{ transition: "transform 800ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm leading-tight font-bold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
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
