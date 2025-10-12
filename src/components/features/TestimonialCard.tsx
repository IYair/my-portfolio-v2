"use client";

import Avatar from "@/components/ui/Avatar";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

interface TestimonialCardProps {
  content: string;
  contentEn?: string | null;
  author: string;
  handle: string;
  image?: string | null;
  featured?: boolean;
}

const CHAR_LIMIT_FEATURED = 300;
const CHAR_LIMIT_NORMAL = 150;

export default function TestimonialCard({
  content,
  contentEn,
  author,
  handle,
  image,
  featured = false,
}: TestimonialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("testimonials");
  const locale = useLocale();

  // Seleccionar el contenido según el idioma actual
  const displayLocaleContent = locale === "en" && contentEn ? contentEn : content;

  const charLimit = featured ? CHAR_LIMIT_FEATURED : CHAR_LIMIT_NORMAL;
  const shouldTruncate = displayLocaleContent.length > charLimit;
  const displayContent =
    isExpanded || !shouldTruncate
      ? displayLocaleContent
      : displayLocaleContent.slice(0, charLimit) + "...";

  if (featured) {
    return (
      <figure className="bg-background ring-foreground/5 flex h-full flex-col rounded-2xl p-8 text-base/7 shadow-lg ring-1">
        <blockquote className="text-foreground flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-lg leading-relaxed font-medium">&ldquo;{displayContent}&rdquo;</p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 self-end text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isExpanded ? t("showLess") : t("showMore")}
            </button>
          )}
        </blockquote>
        <figcaption className="border-foreground/10 mt-6 flex w-full items-center gap-x-4 border-t pt-6">
          <Avatar src={image} alt={author} size={56} />
          <div className="flex-1">
            <div className="text-lg font-semibold">{author}</div>
            <div className="text-foreground/60 text-base">{handle}</div>
          </div>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="bg-background ring-foreground/5 rounded-2xl p-6 text-sm/6 shadow-lg ring-1">
      <blockquote className="text-foreground">
        <p>&ldquo;{displayContent}&rdquo;</p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isExpanded ? t("showLess") : t("showMore")}
          </button>
        )}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-x-4">
        <Avatar src={image} alt={author} size={40} />
        <div className="flex-1">
          <div className="font-semibold">{author}</div>
          <div className="text-foreground/60">{handle}</div>
        </div>
      </figcaption>
    </figure>
  );
}
