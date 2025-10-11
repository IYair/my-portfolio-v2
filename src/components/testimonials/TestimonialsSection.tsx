import { getLocale, getTranslations } from "next-intl/server";
import TestimonialCard from "@/components/features/TestimonialCard";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

interface Testimonial {
  id: number;
  content: string;
  contentEn: string | null;
  author: string;
  handle: string;
  image: string;
  published: boolean;
  featured: boolean;
}

async function getTestimonials(): Promise<Testimonial[]> {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
  });

  return testimonials;
}

export default async function TestimonialsSection() {
  const locale = await getLocale();
  const t = await getTranslations("testimonials");
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) {
    return null; // No mostrar la sección si no hay testimonios
  }

  // Layout tipo magazine
  const featuredTestimonial = testimonials.find((t) => t.featured) || testimonials[0];
  const otherTestimonials = testimonials.filter((t) => t.id !== featuredTestimonial?.id);
  const leftTestimonials = otherTestimonials.slice(0, 2);
  const rightTestimonials = otherTestimonials.slice(2, 4);
  const bottomTestimonials = otherTestimonials.slice(4);

  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      {/* Background gradient effects */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1318/752] w-[82.375rem] bg-gradient-to-r from-[#22c5ea] to-[#9333ea] opacity-10 dark:opacity-20"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1318/752] w-[82.375rem] bg-gradient-to-r from-[#9333ea] to-[#22c5ea] opacity-25 dark:opacity-20"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400">
            {t("title")}
          </h2>
          <p className="text-foreground/70 mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("subtitle")}
          </p>
        </div>

        {/* Magazine Layout: 2 Left + 1 Featured Center + 2 Right */}
        <div className="mx-auto mt-16 sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column - 2 Small Testimonials */}
            <div className="flex flex-col gap-6 lg:col-span-3">
              {leftTestimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  content={locale === "en" && testimonial.contentEn ? testimonial.contentEn : testimonial.content}
                  author={testimonial.author}
                  handle={testimonial.handle}
                  image={testimonial.image}
                />
              ))}
            </div>

            {/* Center Column - 1 Large Featured Testimonial */}
            {featuredTestimonial && (
              <div className="lg:col-span-6">
                <TestimonialCard
                  content={locale === "en" && featuredTestimonial.contentEn ? featuredTestimonial.contentEn : featuredTestimonial.content}
                  author={featuredTestimonial.author}
                  handle={featuredTestimonial.handle}
                  image={featuredTestimonial.image}
                  featured
                />
              </div>
            )}

            {/* Right Column - 2 Small Testimonials */}
            <div className="flex flex-col gap-6 lg:col-span-3">
              {rightTestimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  content={locale === "en" && testimonial.contentEn ? testimonial.contentEn : testimonial.content}
                  author={testimonial.author}
                  handle={testimonial.handle}
                  image={testimonial.image}
                />
              ))}
            </div>
          </div>

          {/* Bottom Row - Remaining Testimonials */}
          {bottomTestimonials.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bottomTestimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  content={locale === "en" && testimonial.contentEn ? testimonial.contentEn : testimonial.content}
                  author={testimonial.author}
                  handle={testimonial.handle}
                  image={testimonial.image}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
