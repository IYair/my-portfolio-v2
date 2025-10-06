"use client";

import BlogSection from "@/components/blog/BlogSection";
import ContactForm from "@/components/features/ContactForm";
import { Meteors } from "@/components/ui/meteors";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Home() {
  const hero = useTranslations("hero");
  const about = useTranslations("about");
  const projects = useTranslations("projects");
  const blog = useTranslations("blog");
  const contact = useTranslations("contact");
  const footer = useTranslations("footer");
  const common = useTranslations("common");
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        id="home"
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pt-20"
      >
        <Meteors number={30} maxDuration={10} />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-1">
            {/* Text Content */}
            <div className="relative z-20 max-w-3xl">
              <h1 className="mb-6 text-6xl font-bold md:text-6xl">
                {hero("greeting")}{" "}
                <span className="bg-gradient-to-b from-gray-300 to-gray-900 bg-clip-text text-6xl leading-none font-semibold whitespace-pre-wrap text-transparent dark:from-white dark:to-gray-800">
                  {hero("name")}
                </span>
              </h1>
              <p className="mb-8 text-2xl leading-relaxed font-medium text-gray-500 md:text-2xl dark:text-gray-300">
                {hero("description")}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#projects"
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-6 py-3 text-center font-medium transition-colors"
                >
                  {common("viewProjects")}
                </a>
                <a
                  href="#contact"
                  className="border-foreground/20 hover:bg-foreground/5 rounded-lg border px-6 py-3 text-center font-medium transition-colors"
                >
                  {common("contactMe")}
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Profile Image */}
        <div className="flex justify-center pt-20 md:absolute md:right-6 md:bottom-0 md:h-full md:justify-end lg:right-12 xl:right-24 2xl:right-40">
          <div className="relative h-96 brightness-[95%] md:h-full">
            <Image
              src="/images/me.png"
              alt="Yair Chan - Desarrollador Full Stack"
              width={400}
              height={600}
              className="neon-glow relative z-5 h-full w-auto object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section id="about" className="bg-foreground/5 relative z-20 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">{about("title")}</h2>
              <p className="text-foreground/80 mb-6 leading-relaxed">{about("description1")}</p>
              <p className="text-foreground/80 leading-relaxed">{about("description2")}</p>
            </div>
            <div className="bg-background border-foreground/10 rounded-lg border p-8">
              <h3 className="mb-4 text-xl font-semibold">{about("technologies")}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>• React & Next.js</div>
                <div>• TypeScript</div>
                <div>• Node.js</div>
                <div>• Tailwind CSS</div>
                <div>• PostgreSQL</div>
                <div>• Git & GitHub</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="relative z-20 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="border-foreground/10 rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50 p-8 dark:from-blue-950/20 dark:to-purple-950/20">
              <h3 className="mb-4 text-2xl font-bold">{projects("title")}</h3>
              <p className="text-foreground/80 mb-6">{projects("description")}</p>
              <a
                href="#projects"
                className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {projects("viewAll")}
              </a>
            </div>
            <div className="border-foreground/10 rounded-lg border bg-gradient-to-br from-green-50 to-teal-50 p-8 dark:from-green-950/20 dark:to-teal-950/20">
              <h3 className="mb-4 text-2xl font-bold">{blog("title")}</h3>
              <p className="text-foreground/80 mb-6">{blog("description")}</p>
              <a
                href="#blog"
                className="inline-flex items-center font-medium text-green-600 hover:underline dark:text-green-400"
              >
                {blog("readArticles")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* Contact Section */}
      <section id="contact" className="bg-foreground/5 relative z-20 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold">{contact("title")}</h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-xl">{contact("description")}</p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-foreground/10 relative z-20 border-t py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 font-mono text-lg font-semibold md:mb-0">Yair Chan</div>
            <div className="flex space-x-6">
              <a
                href="https://github.com/IYair"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                {footer("github")}
              </a>
              <a
                href="https://www.linkedin.com/in/yair-chan/"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                {footer("linkedin")}
              </a>
              <a
                href="https://x.com/EnyaDev"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                {footer("twitter")}
              </a>
            </div>
          </div>
          <div className="border-foreground/10 text-foreground/60 mt-8 border-t pt-8 text-center text-sm">
            © 2025 Yair Chan. {common("allRightsReserved")}.
          </div>
        </div>
      </footer>
    </div>
  );
}
