import Image from "next/image";

interface TestimonialCardProps {
  content: string;
  author: string;
  handle: string;
  image: string;
  featured?: boolean;
}

export default function TestimonialCard({
  content,
  author,
  handle,
  image,
  featured = false,
}: TestimonialCardProps) {
  if (featured) {
    return (
      <figure className="flex h-full flex-col rounded-2xl bg-background p-8 text-base/7 shadow-lg ring-1 ring-foreground/5">
        <blockquote className="flex flex-1 items-center justify-center text-center text-foreground">
          <p className="text-lg font-medium leading-relaxed">&ldquo;{content}&rdquo;</p>
        </blockquote>
        <figcaption className="mt-6 flex w-full items-center gap-x-4 border-t border-foreground/10 pt-6">
          <Image
            src={image}
            alt={author}
            width={56}
            height={56}
            className="h-14 w-14 flex-shrink-0 rounded-full bg-gray-50"
          />
          <div className="flex-1">
            <div className="text-lg font-semibold">{author}</div>
            <div className="text-base text-foreground/60">{handle}</div>
          </div>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="rounded-2xl bg-background p-6 text-sm/6 shadow-lg ring-1 ring-foreground/5">
      <blockquote className="text-foreground">
        <p>&ldquo;{content}&rdquo;</p>
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
