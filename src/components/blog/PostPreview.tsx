"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

interface PostPreviewProps {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  onClose: () => void;
}

export default function PostPreview({
  title,
  excerpt,
  content,
  coverImage,
  tags,
  onClose,
}: PostPreviewProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Vista Previa del Post
          </h1>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Post Header */}
        <header className="mb-8">
          {/* Cover Image */}
          {coverImage && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={coverImage}
                alt={title || "Portada del post"}
                className="h-96 w-full object-cover"
              />
            </div>
          )}
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {title || "Título del post"}
          </h1>
          {excerpt && (
            <p className="mb-6 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              {excerpt}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="text-gray-500 italic dark:text-gray-400">
              Comienza a escribir contenido para ver la vista previa...
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
