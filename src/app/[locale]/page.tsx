import { Blur } from "@/components/animate-ui/primitives/effects/blur";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Slide } from "@/components/animate-ui/primitives/effects/slide";
import ContactForm from "@/components/features/ContactForm";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { format } from "@formkit/tempo";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

// Force dynamic rendering to avoid PgBouncer prepared statement conflicts during build
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getTranslations("hero");
  const name = hero("name");
  const description = hero("description");

  return {
    title: `${name} – Full Stack Developer`,
    description,
    openGraph: {
      title: `${name} – Full Stack Developer`,
      description,
      type: "website",
      images: [{ url: "/images/me.png", width: 440, height: 660, alt: name }],
    },
    alternates: {
      canonical: "/",
      languages: {
        es: "/es",
        en: "/en",
      },
    },
  };
}

export default async function Home() {
  const hero = await getTranslations("hero");
  const about = await getTranslations("about");
  const projects = await getTranslations("projects");
  const blog = await getTranslations("blog");
  const contact = await getTranslations("contact");
  const footer = await getTranslations("footer");
  const common = await getTranslations("common");
  const locale = await getLocale();

  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      createdAt: true,
      tags: { select: { name: true } },
    },
  });

  const formatDate = (date: Date) => {
    const localeFormat = locale === "en" ? "MMMM D, YYYY" : "D de MMMM de YYYY";
    return format(date, localeFormat, locale);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* ─────────────────────────────────────────────────────────────
          HERO — Cinematic, Apple-style dark landing
      ───────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative flex min-h-screen flex-col items-center justify-end overflow-hidden pb-28"
        style={{ backgroundColor: "#000" }}
      >
        {/* Subtle radial glow behind figure */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 100%, rgba(59,130,246,0.07) 0%, transparent 100%)",
          }}
        />

        {/* Profile photo — atmospheric, bottom-anchored */}
        <Fade delay={0.2}>
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="relative" style={{ height: "88vh" }}>
              <Image
                src="/images/me.png"
                alt="Yair Chan - Desarrollador Full Stack"
                width={440}
                height={660}
                className="h-full w-auto object-contain"
                style={{ opacity: 0.5 }}
                priority
              />
              {/* Gradient fades for seamless integration */}
              <div
                className="absolute inset-x-0 bottom-0"
                style={{
                  height: "50%",
                  background:
                    "linear-gradient(to top, #000 0%, rgba(0,0,0,0.7) 50%, transparent 100%)",
                }}
              />
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: "30%",
                  background: "linear-gradient(to right, #000, transparent)",
                }}
              />
              <div
                className="absolute inset-y-0 right-0"
                style={{
                  width: "30%",
                  background: "linear-gradient(to left, #000, transparent)",
                }}
              />
            </div>
          </div>
        </Fade>

        {/* Hero text — cinematic overlay */}
        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
          {/* Eyebrow label */}
          <Fade delay={0.8}>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.65rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              Full Stack Developer
            </p>
          </Fade>

          {/* Main headline — massive */}
          <Slide direction="up" delay={1}>
            <h1
              style={{
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                marginBottom: "1.5rem",
                color: "#fff",
                fontSize: "clamp(3.5rem, 14vw, 10rem)",
              }}
            >
              {hero("name")}.
            </h1>
          </Slide>

          {/* Job title */}
          <Fade delay={1.5}>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "clamp(1.1rem, 2.5vw, 2rem)",
                fontWeight: 300,
                letterSpacing: "-0.01em",
                marginBottom: "1.5rem",
              }}
            >
              {hero("job")}
            </p>
          </Fade>

          {/* Description */}
          <Fade delay={2}>
            <p
              style={{
                color: "rgba(255,255,255,0.38)",
                fontSize: "1rem",
                maxWidth: "34rem",
                lineHeight: 1.75,
                marginBottom: "3rem",
              }}
            >
              {hero("description")}
            </p>
          </Fade>

          {/* CTA buttons — Apple pill style */}
          <Fade delay={2.4}>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="projects"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "11rem",
                  padding: "0.75rem 1.75rem",
                  borderRadius: "9999px",
                  backgroundColor: "#fff",
                  color: "#000",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                {common("viewProjects")}
              </a>
              <a
                href="#contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "11rem",
                  padding: "0.75rem 1.75rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  backdropFilter: "blur(12px)",
                  textDecoration: "none",
                  transition: "background-color 0.2s, border-color 0.2s",
                }}
              >
                {common("contactMe")}
              </a>
            </div>
          </Fade>
        </div>

        {/* Scroll indicator */}
        <Fade delay={3}>
          <div
            className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              Scroll
            </span>
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="animate-bounce"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </Fade>
      </section>

      {/* Thin divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

      {/* ─────────────────────────────────────────────────────────────
          ABOUT — Apple off-white "f5f5f7" section
      ───────────────────────────────────────────────────────────── */}
      <section id="about" style={{ backgroundColor: "#f5f5f7", padding: "8rem 0" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Fade inView inViewOnce>
            <p
              style={{
                color: "#0066cc",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              {about("title")}
            </p>
          </Fade>

          <div style={{ maxWidth: "56rem" }}>
            <Slide direction="up" inView inViewOnce delay={0.1}>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  color: "#1d1d1f",
                  marginBottom: "2rem",
                }}
              >
                {about("description1")}
              </h2>
            </Slide>
            <Slide direction="up" inView inViewOnce delay={0.2}>
              <p
                style={{
                  fontSize: "1.15rem",
                  lineHeight: 1.8,
                  color: "#6e6e73",
                  maxWidth: "40rem",
                }}
              >
                {about("description2")}
              </p>
            </Slide>
            <Fade inView inViewOnce delay={0.3}>
              <div style={{ marginTop: "2rem" }}>
                <Link
                  href="/about"
                  style={{
                    color: "#0066cc",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  {common("readMore")} →
                </Link>
              </div>
            </Fade>
          </div>

          {/* Tech stack — Apple spec grid with hairline separators */}
          <div
            className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
            style={{ gap: "1px", backgroundColor: "#d2d2d7" }}
          >
            {[
              { label: "Stack", value: "React & Next.js" },
              { label: "Language", value: "TypeScript" },
              { label: "Backend", value: "Node.js" },
              { label: "Styling", value: "Tailwind CSS" },
              { label: "Database", value: "PostgreSQL" },
              { label: "Version Control", value: "Git & GitHub" },
            ].map((item, i) => (
              <Fade key={item.label} inView inViewOnce delay={0.4 + i * 0.08}>
                <div style={{ backgroundColor: "#f5f5f7", padding: "2rem 1.5rem" }}>
                  <div
                    style={{
                      fontSize: "1.35rem",
                      fontWeight: 600,
                      color: "#1d1d1f",
                      marginBottom: "0.3rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.value}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6e6e73", letterSpacing: "0.02em" }}>
                    {item.label}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FEATURED — Dark bento cards, Apple product-feature style
      ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#000", padding: "8rem 0" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Fade inView inViewOnce>
            <p
              style={{
                textAlign: "center",
                color: "rgba(100,170,255,0.9)",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              {common("viewProjects")}
            </p>
          </Fade>
          <Slide direction="up" inView inViewOnce delay={0.1}>
            <h2
              style={{
                textAlign: "center",
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "#fff",
                marginBottom: "4rem",
                maxWidth: "36rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {projects("featured")}
            </h2>
          </Slide>

          <div className="grid gap-3 lg:grid-cols-5">
            {/* Projects — large card */}
            <div className="lg:col-span-3">
              <Fade inView inViewOnce delay={0.2}>
                <div
                  className="group relative flex min-h-96 flex-col overflow-hidden rounded-2xl p-10 transition-all duration-500 lg:min-h-[480px]"
                  style={{
                    backgroundColor: "#111",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(ellipse at top left, rgba(59,130,246,0.12) 0%, transparent 65%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-1 flex-col">
                    <span
                      className="mb-6 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(59,130,246,0.1)",
                        color: "rgba(100,170,255,1)",
                        border: "1px solid rgba(59,130,246,0.2)",
                      }}
                    >
                      {projects("title")}
                    </span>
                    <h3
                      style={{
                        fontSize: "1.85rem",
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1.2,
                        marginBottom: "0.75rem",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      Proyectos Innovadores
                    </h3>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.38)",
                        fontSize: "0.9rem",
                        lineHeight: 1.8,
                        flexGrow: 1,
                        maxWidth: "32rem",
                      }}
                    >
                      {projects("description")}
                    </p>
                    <div style={{ marginTop: "2.5rem" }}>
                      <Link
                        href="/projects"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          padding: "0.625rem 1.25rem",
                          borderRadius: "9999px",
                          backgroundColor: "rgba(255,255,255,0.08)",
                          color: "#fff",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          border: "1px solid rgba(255,255,255,0.12)",
                          transition: "background-color 0.2s",
                        }}
                      >
                        {projects("viewAll")} →
                      </Link>
                    </div>
                  </div>
                </div>
              </Fade>
            </div>

            {/* Right column — Blog + Contact */}
            <div className="flex flex-col gap-3 lg:col-span-2">
              {/* Blog card */}
              <Fade inView inViewOnce delay={0.3}>
                <div
                  className="group relative flex min-h-52 flex-col overflow-hidden rounded-2xl p-8 transition-all duration-500"
                  style={{
                    backgroundColor: "#111",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(ellipse at top left, rgba(34,197,94,0.1) 0%, transparent 65%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-1 flex-col">
                    <span
                      className="mb-4 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(34,197,94,0.1)",
                        color: "rgba(74,222,128,1)",
                        border: "1px solid rgba(34,197,94,0.2)",
                      }}
                    >
                      {blog("title")}
                    </span>
                    <p
                      style={{
                        color: "#fff",
                        fontSize: "1rem",
                        fontWeight: 600,
                        lineHeight: 1.5,
                        flexGrow: 1,
                      }}
                    >
                      {blog("description")}
                    </p>
                    <div style={{ marginTop: "1.5rem" }}>
                      <Link
                        href="/blog"
                        style={{
                          color: "rgba(74,222,128,1)",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        {blog("readArticles")} →
                      </Link>
                    </div>
                  </div>
                </div>
              </Fade>

              {/* Contact card */}
              <Fade inView inViewOnce delay={0.4}>
                <div
                  className="group relative flex min-h-52 flex-col overflow-hidden rounded-2xl p-8 transition-all duration-500"
                  style={{
                    backgroundColor: "#111",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(ellipse at top left, rgba(168,85,247,0.1) 0%, transparent 65%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-1 flex-col">
                    <span
                      className="mb-4 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(168,85,247,0.1)",
                        color: "rgba(196,141,255,1)",
                        border: "1px solid rgba(168,85,247,0.2)",
                      }}
                    >
                      {contact("title")}
                    </span>
                    <p
                      style={{
                        color: "#fff",
                        fontSize: "1rem",
                        fontWeight: 600,
                        lineHeight: 1.5,
                        flexGrow: 1,
                      }}
                    >
                      {contact("description")}
                    </p>
                    <div style={{ marginTop: "1.5rem" }}>
                      <a
                        href="#contact"
                        style={{
                          color: "rgba(196,141,255,1)",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        {common("contactMe")} →
                      </a>
                    </div>
                  </div>
                </div>
              </Fade>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          BLOG — Últimas entradas, Apple editorial style
      ───────────────────────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section style={{ backgroundColor: "#f5f5f7", padding: "8rem 0" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 flex items-end justify-between">
              <div>
                <Fade inView inViewOnce>
                  <p
                    style={{
                      color: "#0066cc",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: "1rem",
                    }}
                  >
                    {blog("title")}
                  </p>
                </Fade>
                <Slide direction="up" inView inViewOnce delay={0.1}>
                  <h2
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: "-0.025em",
                      color: "#1d1d1f",
                    }}
                  >
                    {blog("description")}
                  </h2>
                </Slide>
              </div>
              <Fade inView inViewOnce delay={0.2}>
                <Link
                  href="/blog"
                  style={{
                    color: "#0066cc",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {blog("readArticles")} →
                </Link>
              </Fade>
            </div>

            {/* Post grid — Apple editorial cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post, i) => (
                <Fade key={post.id} inView inViewOnce delay={0.2 + i * 0.1}>
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <article
                      className="group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300"
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {/* Cover image or placeholder */}
                      <div
                        className="relative overflow-hidden"
                        style={{ height: "13rem", flexShrink: 0 }}
                      >
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center"
                            style={{
                              background: "linear-gradient(135deg, #e8f0fe 0%, #f0e8fe 100%)",
                            }}
                          >
                            <svg
                              width="40"
                              height="40"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="rgba(0,0,0,0.15)"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-6">
                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag.name}
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  color: "#0066cc",
                                  backgroundColor: "rgba(0,102,204,0.08)",
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: "9999px",
                                }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3
                          className="transition-colors duration-200 group-hover:text-[#0066cc]"
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "#1d1d1f",
                            lineHeight: 1.3,
                            letterSpacing: "-0.01em",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {post.title}
                        </h3>

                        {post.excerpt && (
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "#6e6e73",
                              lineHeight: 1.6,
                              flexGrow: 1,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {post.excerpt}
                          </p>
                        )}

                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "#aeaeb2",
                            marginTop: "1rem",
                          }}
                        >
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </article>
                  </Link>
                </Fade>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TESTIMONIALS
      ───────────────────────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ─────────────────────────────────────────────────────────────
          CONTACT — Apple dark, centered, generous spacing
      ───────────────────────────────────────────────────────────── */}
      <section id="contact" style={{ backgroundColor: "#000", padding: "8rem 0" }}>
        <div className="mx-auto max-w-3xl px-6">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <Blur inView inViewOnce delay={0.1}>
              <h2
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  color: "#fff",
                  marginBottom: "1.5rem",
                }}
              >
                {contact("title")}
              </h2>
            </Blur>
            <Slide direction="up" inView inViewOnce delay={0.2}>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "rgba(255,255,255,0.42)",
                  lineHeight: 1.75,
                }}
              >
                {contact("description")}
              </p>
            </Slide>
          </div>
          <Fade inView inViewOnce delay={0.3}>
            <ContactForm />
          </Fade>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER — Apple minimal
      ───────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          backgroundColor: "#000",
          padding: "3rem 0",
        }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Yair Chan
            </div>
            <div className="flex gap-8">
              {[
                { href: "https://github.com/IYair", label: footer("github") },
                { href: "https://www.linkedin.com/in/yair-chan/", label: footer("linkedin") },
                { href: "https://x.com/EnyaDev", label: footer("twitter") },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "rgba(255,255,255,0.32)",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              textAlign: "center",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.22)",
            }}
          >
            © 2025 Yair Chan. {common("allRightsReserved")}.
          </div>
        </div>
      </footer>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Yair Chan",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://yairchancusco.me",
            image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yairchancusco.me"}/images/me.png`,
            sameAs: [
              "https://github.com/IYair",
              "https://www.linkedin.com/in/yair-chan/",
              "https://x.com/EnyaDev",
            ],
            jobTitle: "Full Stack Developer",
            knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
          }),
        }}
      />
    </div>
  );
}
