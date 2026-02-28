"use client";

import { ArrowLeftIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";

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
  updatedAt: string;
  tags: { id: number; name: string }[];
}

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Reading Progress Bar ───────────────────────────────────────────────────
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-50 h-[2px] transition-all duration-75"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
        boxShadow: "0 0 8px rgba(139,92,246,0.6)",
      }}
    />
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function PostSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* Hero skeleton */}
      <div className="relative h-[55vh] animate-pulse" style={{ backgroundColor: "#111" }} />

      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="space-y-4">
          <div className="h-3 w-24 rounded-full" style={{ backgroundColor: "#1a1a1a" }} />
          <div className="h-10 w-5/6 rounded" style={{ backgroundColor: "#1a1a1a" }} />
          <div className="h-10 w-3/4 rounded" style={{ backgroundColor: "#1a1a1a" }} />
          <div className="h-4 w-40 rounded" style={{ backgroundColor: "#1a1a1a" }} />
          <div className="mt-8 space-y-3 pt-8">
            {[100, 92, 96, 84, 100, 88, 90, 72].map((w, i) => (
              <div
                key={i}
                className="h-4 rounded"
                style={{ backgroundColor: "#111", width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────────────────────────
function PostError({ message }: { message: string }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ backgroundColor: "#000", color: "#fff" }}
    >
      <p
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          marginBottom: "1.5rem",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "clamp(1.75rem, 5vw, 3rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          marginBottom: "1rem",
        }}
      >
        {message}
      </h1>
      <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "2.5rem" }}>
        El artículo que buscas no existe o ha sido removido.
      </p>
      <Link
        href="/blog"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.7rem 1.5rem",
          borderRadius: "9999px",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          fontSize: "0.875rem",
          fontWeight: 500,
          textDecoration: "none",
          transition: "border-color 0.2s",
        }}
      >
        <ArrowLeftIcon style={{ width: "1rem", height: "1rem" }} />
        Ver todos los artículos
      </Link>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/posts/${slug}`)
      .then(r => {
        if (!r.ok)
          throw new Error(r.status === 404 ? "Post no encontrado" : "Error al cargar el post");
        return r.json();
      })
      .then(setPost)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Shiki syntax highlighting
  useEffect(() => {
    if (!post?.content) return;

    const highlight = async () => {
      const blocks = document.querySelectorAll<HTMLElement>("pre.code-block-lowlight");
      for (const pre of Array.from(blocks)) {
        if (pre.classList.contains("shiki-processed")) continue;
        const code = pre.querySelector("code");
        if (!code) continue;

        let text = code.textContent ?? "";
        let lang = "javascript";
        const fence = text.match(/^```(\w+)\n/);
        if (fence) {
          lang = fence[1];
          text = text.replace(/^```\w+\n/, "").replace(/\n```$/, "");
        }
        text = text.trim();

        try {
          const html = await codeToHtml(text, { lang, theme: "github-dark" });
          const tmp = document.createElement("div");
          tmp.innerHTML = html;
          const newPre = tmp.querySelector("pre");
          if (newPre) {
            newPre.classList.add("shiki-processed");
            pre.replaceWith(newPre);
          }
        } catch {
          pre.classList.add("shiki-processed");
        }
      }
    };

    highlight();
  }, [post]);

  if (loading) return <PostSkeleton />;
  if (error || !post) return <PostError message={error ?? "Post no encontrado"} />;

  const minutes = readingTime(post.content);

  return (
    <>
      <ReadingProgressBar />

      <div className="min-h-screen" style={{ backgroundColor: "#000", color: "#fff" }}>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div
          className="relative"
          style={{ height: post.coverImage ? "60vh" : "32vh", minHeight: "280px" }}
        >
          {post.coverImage ? (
            <>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                style={{ opacity: 0.55 }}
                priority
                unoptimized
              />
              {/* Multi-layer gradient for cinematic look */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 80%, #000 100%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(59,130,246,0.06) 0%, transparent 70%)",
                }}
              />
            </>
          ) : (
            /* No cover — subtle gradient atmosphere */
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%)",
              }}
            />
          )}

          {/* Back link — positioned over hero */}
          <div className="absolute top-8 right-0 left-0 px-6">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/blog"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  fontFamily: "var(--font-geist-mono)",
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                className="hover:!text-white"
              >
                <ArrowLeftIcon style={{ width: "0.9rem", height: "0.9rem" }} />
                blog
              </Link>
            </div>
          </div>

          {/* Title block — bottom of hero */}
          <div
            className="absolute right-0 bottom-0 left-0 px-6 pb-12"
            style={{ paddingTop: "4rem" }}
          >
            <div className="mx-auto max-w-3xl">
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(147,197,253,0.85)",
                        backgroundColor: "rgba(59,130,246,0.12)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        padding: "0.25rem 0.7rem",
                        borderRadius: "9999px",
                      }}
                    >
                      <TagIcon style={{ width: "0.6rem", height: "0.6rem" }} />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <h1
                style={{
                  fontSize: "clamp(1.9rem, 5vw, 3.5rem)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  marginBottom: "1.25rem",
                }}
              >
                {post.title}
              </h1>

              {/* Meta row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <ClockIcon style={{ width: "0.75rem", height: "0.75rem" }} />
                  {minutes} min de lectura
                </span>
                {post.featured && (
                  <span
                    style={{
                      color: "rgba(250,204,21,0.8)",
                      backgroundColor: "rgba(250,204,21,0.08)",
                      border: "1px solid rgba(250,204,21,0.2)",
                      padding: "0.15rem 0.6rem",
                      borderRadius: "9999px",
                    }}
                  >
                    ★ Destacado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Article body ─────────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl px-6 pb-24">
          {/* Excerpt / lead */}
          {post.excerpt && (
            <p
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.55)",
                fontWeight: 400,
                letterSpacing: "-0.005em",
                marginTop: "3rem",
                marginBottom: "3rem",
                paddingBottom: "3rem",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            ref={contentRef}
            className="blog-post-content tiptap-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ marginTop: post.excerpt ? "0" : "3rem" }}
          />

          {/* ── Footer ───────────────────────────────────────────────── */}
          <div
            style={{
              marginTop: "5rem",
              paddingTop: "3rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <Link
              href="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.85rem",
                fontWeight: 500,
                fontFamily: "var(--font-geist-mono)",
                letterSpacing: "0.03em",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              className="hover:!text-white"
            >
              <ArrowLeftIcon style={{ width: "0.9rem", height: "0.9rem" }} />
              Todos los artículos
            </Link>

            {post.tags.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {post.tags.map(tag => (
                  <span
                    key={tag.id}
                    style={{
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.25)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Blog post prose typography ──────────────────────────────── */
        .blog-post-content {
          color: rgba(255,255,255,0.82);
          font-size: clamp(1rem, 1.8vw, 1.0625rem);
          line-height: 1.9;
          letter-spacing: -0.003em;
        }

        .blog-post-content h1,
        .blog-post-content h2,
        .blog-post-content h3,
        .blog-post-content h4 {
          color: #fff;
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.2;
          margin-top: 3rem;
          margin-bottom: 0.875rem;
        }

        .blog-post-content h1 { font-size: clamp(1.6rem, 3vw, 2.25rem); }
        .blog-post-content h2 { font-size: clamp(1.3rem, 2.5vw, 1.75rem); }
        .blog-post-content h3 { font-size: clamp(1.1rem, 2vw, 1.35rem); }
        .blog-post-content h4 { font-size: 1.1rem; }

        .blog-post-content p {
          margin-bottom: 1.6rem;
        }

        .blog-post-content a {
          color: rgba(147,197,253,0.9);
          text-decoration: underline;
          text-decoration-color: rgba(147,197,253,0.3);
          text-underline-offset: 3px;
          transition: color 0.15s, text-decoration-color 0.15s;
        }
        .blog-post-content a:hover {
          color: #93c5fd;
          text-decoration-color: rgba(147,197,253,0.7);
        }

        .blog-post-content strong {
          color: #fff;
          font-weight: 650;
        }

        .blog-post-content em {
          color: rgba(255,255,255,0.65);
          font-style: italic;
        }

        /* Inline code */
        .blog-post-content code:not(pre code) {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.875em;
          color: rgba(196,181,253,0.9);
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.2);
          padding: 0.15em 0.45em;
          border-radius: 4px;
          letter-spacing: 0;
        }

        /* Code blocks */
        .blog-post-content pre,
        .blog-post-content .shiki {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.855rem;
          line-height: 1.65;
          border-radius: 10px;
          padding: 1.5rem 1.75rem;
          margin: 2rem 0;
          overflow-x: auto;
          border: 1px solid rgba(255,255,255,0.07);
          background: #0d0d0d !important;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        /* Blockquote */
        .blog-post-content blockquote {
          margin: 2.5rem 0;
          padding: 1.25rem 1.75rem;
          border-left: 3px solid rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.04);
          border-radius: 0 8px 8px 0;
          color: rgba(255,255,255,0.6);
          font-style: italic;
          font-size: 1.05em;
          line-height: 1.75;
        }

        .blog-post-content blockquote p {
          margin: 0;
        }

        /* Lists */
        .blog-post-content ul,
        .blog-post-content ol {
          margin: 1.25rem 0 1.75rem 0;
          padding-left: 1.5rem;
        }

        .blog-post-content ul { list-style: none; }
        .blog-post-content ul li {
          position: relative;
          padding-left: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .blog-post-content ul li::before {
          content: "–";
          position: absolute;
          left: 0;
          color: rgba(99,102,241,0.7);
          font-weight: 700;
        }

        .blog-post-content ol { list-style: decimal; }
        .blog-post-content ol li {
          padding-left: 0.25rem;
          margin-bottom: 0.5rem;
        }
        .blog-post-content ol ::marker {
          color: rgba(99,102,241,0.7);
          font-family: var(--font-geist-mono);
          font-size: 0.85em;
        }

        /* Images */
        .blog-post-content img {
          border-radius: 10px;
          margin: 2rem auto;
          max-width: 100%;
          border: 1px solid rgba(255,255,255,0.07);
          display: block;
        }

        /* Horizontal rule */
        .blog-post-content hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 3rem 0;
        }

        /* Tables */
        .blog-post-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 0.9em;
        }
        .blog-post-content th {
          text-align: left;
          font-family: var(--font-geist-mono);
          font-size: 0.7em;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding: 0.6rem 1rem;
        }
        .blog-post-content td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
        }
        .blog-post-content tr:hover td {
          background: rgba(255,255,255,0.02);
        }
      `}</style>
    </>
  );
}
