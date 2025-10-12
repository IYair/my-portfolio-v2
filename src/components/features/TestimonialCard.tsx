"use client";

import Image from "next/image";
import { useState } from "react";

interface TestimonialCardProps {
  content: string;
  author: string;
  handle: string;
  image: string;
  featured?: boolean;
}

const CHAR_LIMIT_FEATURED = 300;
const CHAR_LIMIT_NORMAL = 150;

export default function TestimonialCard({
  content,
  author,
  handle,
  image,
  featured = false,
}: TestimonialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const charLimit = featured ? CHAR_LIMIT_FEATURED : CHAR_LIMIT_NORMAL;
  const shouldTruncate = content.length > charLimit;
  const displayContent =
    isExpanded || !shouldTruncate ? content : content.slice(0, charLimit) + "...";

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
              {isExpanded ? "Ver menos" : "Ver más"}
            </button>
          )}
        </blockquote>
        <figcaption className="border-foreground/10 mt-6 flex w-full items-center gap-x-4 border-t pt-6">
          <Image
            src={image}
            alt={author}
            width={56}
            height={56}
            className="h-14 w-14 flex-shrink-0 rounded-full bg-gray-50"
          />
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
            {isExpanded ? "Ver menos" : "Ver más"}
          </button>
        )}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-x-4">
        <Image
          src={image}
          alt={author}
          width={40}
          height={40}
          className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-50"
        />
        <div className="flex-1">
          <div className="font-semibold">{author}</div>
          <div className="text-foreground/60">{handle}</div>
        </div>
      </figcaption>
    </figure>
  );
}
