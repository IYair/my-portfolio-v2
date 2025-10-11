import { CalendarIcon, TagIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { PrismaClient } from "@/generated/prisma";
import { format } from "@formkit/tempo";
import type { Metadata } from "next";

const prisma = new PrismaClient();

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  tags: { id: number; name: string }[];
}

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");

  return {
    title: t("title"),
    description: t("pageDescription"),
    openGraph: {
      title: t("title"),
      description: t("pageDescription"),
      type: "website",
    },
  };
}

async function getPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return posts;
}

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const common = await getTranslations("common");
  const locale = await getLocale();
  const posts = await getPosts();

  const formatDate = (date: Date) => {
    // Use @formkit/tempo as per project rules
    const localeFormat = locale === "en" ? "MMMM D, YYYY" : "D [de] MMMM [de] YYYY";
    return format(date, localeFormat, locale);
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + "...";
  };

  if (posts.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <Link
              href="/"
              className="text-foreground/60 hover:text-foreground mb-6 inline-flex items-center transition-colors"
            >
              <ArrowLeftIcon className="mr-2 h-5 w-5" />
              {common("back") || "Volver"}
            </Link>
            <h1 className="mb-4 text-4xl font-bold">{t("title")}</h1>
            <p className="text-foreground/70 text-xl">{t("pageDescription")}</p>
          </div>
          <div className="py-16 text-center">
            <p className="text-foreground/60 text-lg">{t("noPosts")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Layout: 3 posts left + 1 featured center + 3 posts right
  const [featuredPost, ...otherPosts] = posts;
  const leftPosts = otherPosts.slice(0, 3);
  const rightPosts = otherPosts.slice(3, 6);

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-foreground/60 hover:text-foreground mb-6 inline-flex items-center transition-colors"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            {common("back") || "Volver"}
          </Link>
          <h1 className="mb-4 text-4xl font-bold">{t("title")}</h1>
          <p className="text-foreground/70 text-xl">{t("pageDescription")}</p>
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
                        className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
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
                      className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
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
                        className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
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
      </div>
    </div>
  );
}
