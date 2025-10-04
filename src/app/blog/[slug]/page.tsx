"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CalendarIcon, TagIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { codeToHtml } from "shiki";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  tags: { id: number; name: string }[];
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else if (response.status === 404) {
          setError("Post no encontrado");
        } else {
          setError("Error al cargar el post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error al cargar el post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Apply Shiki syntax highlighting to code blocks after content loads
  useEffect(() => {
    if (post?.content) {
      const highlightCodeBlocks = async () => {
        const codeBlocks = document.querySelectorAll("pre.code-block-lowlight");

        for (const block of Array.from(codeBlocks)) {
          const preElement = block as HTMLElement;

          // Skip if already highlighted with Shiki
          if (preElement.classList.contains("shiki-processed")) continue;

          // Get the code element inside
          const codeElement = preElement.querySelector("code");
          if (!codeElement) continue;

          // Extract plain text (ignore HTML from lowlight)
          let code = codeElement.textContent || "";

          // Detect and remove markdown code fence if present
          let language = "javascript"; // default
          const fenceMatch = code.match(/^```(\w+)\n/);
          if (fenceMatch) {
            language = fenceMatch[1];
            // Remove the opening fence and closing fence if present
            code = code.replace(/^```\w+\n/, "").replace(/\n```$/, "");
          }

          // Trim any extra whitespace
          code = code.trim();

          try {
            const html = await codeToHtml(code, {
              lang: language,
              theme: "github-dark",
            });

            // Replace the pre element with the Shiki-highlighted version
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            const newPre = tempDiv.querySelector("pre");

            if (newPre) {
              // Preserve the prose classes and add our custom classes
              newPre.classList.add("shiki-processed");
              preElement.replaceWith(newPre);
            }
          } catch (error) {
            console.error(`Error highlighting code block (${language}):`, error);
            // Fallback: just mark as processed to prevent retry loop
            preElement.classList.add("shiki-processed");
          }
        }
      };

      highlightCodeBlocks();
    }
  }, [post]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6">
          <div className="animate-pulse">
            <div className="mb-6 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-4 h-12 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-8 h-4 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Volver al blog
          </Link>
          <div className="py-16 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {error || "Post no encontrado"}
            </h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              El artículo que buscas no existe o ha sido removido.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Ver todos los artículos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6">
        {/* Navigation */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Volver al blog
        </Link>

        {/* Article */}
        <article className="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
          {/* Header */}
          <header className="mb-8">
            <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 dark:text-white">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mb-6 flex items-center text-gray-600 dark:text-gray-400">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <time dateTime={post.createdAt}>Publicado el {formatDate(post.createdAt)}</time>
              {post.featured && (
                <span className="ml-4 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Destacado
                </span>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mb-6 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    <TagIcon className="mr-1 h-4 w-4" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-gray-900 dark:prose-code:text-white prose-img:rounded-lg prose-img:shadow-lg tiptap-content max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Footer Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            ← Ver más artículos
          </Link>
        </div>
      </div>
    </div>
  );
}
