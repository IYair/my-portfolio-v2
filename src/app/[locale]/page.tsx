import { Blur } from "@/components/animate-ui/primitives/effects/blur";
import { Fade, Fades } from "@/components/animate-ui/primitives/effects/fade";
import { Slide } from "@/components/animate-ui/primitives/effects/slide";
import { Tilt } from "@/components/animate-ui/primitives/effects/tilt";
import { GradientText } from "@/components/animate-ui/primitives/texts/gradient";
import { HighlightText } from "@/components/animate-ui/primitives/texts/highlight";
import { TypingGradientText } from "@/components/animate-ui/primitives/texts/typing-gradient";
import ContactForm from "@/components/features/ContactForm";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import { Meteors } from "@/components/ui/meteors";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getTranslations("hero");

  return {
    title: `${hero("name")} - ${hero("description")}`,
    description: hero("description"),
    openGraph: {
      title: `${hero("name")} - ${hero("description")}`,
      description: hero("description"),
      type: "website",
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        id="home"
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pt-20"
      >
        <Meteors number={30} maxDuration={10} />

        {/* Profile Image - Background */}
        <Fade delay={0.4}>
          <div className="absolute inset-0 flex items-end justify-center pb-0">
            <Tilt perspective={500} className="relative h-[90vh] w-auto brightness-[85%]">
              <Image
                src="/images/me.png"
                alt="Yair Chan - Desarrollador Full Stack"
                width={400}
                height={600}
                className="neon-glow h-full w-auto object-contain opacity-90"
                priority
              />
            </Tilt>
          </div>
        </Fade>

        <div className="relative z-10 mx-auto mt-20 w-full max-w-6xl px-6 py-20">
          <div className="flex flex-col items-center gap-12">
            {/* Text Content */}
            <div className="relative z-20 w-full max-w-3xl text-center">
              <Slide direction="up" delay={0.5}>
                <h1 className="mb-6 text-6xl font-bold md:text-6xl">
                  <TypingGradientText
                    text={hero("name")}
                    neon
                    gradient="linear-gradient(120deg, #22c5ea 0%, #9333ea 40%, #9333ea 50%, #555 60%, #555 100%)"
                    typingDuration={100}
                    typingDelay={200}
                    className="text-7xl font-semibold"
                  />
                  <br />
                  <Slide direction="down" delay={3.5}>
                    <Fade delay={3000}>
                      <GradientText
                        text={hero("job")}
                        neon
                        gradient="linear-gradient(240deg, #fff 0%, #fff 40%, #fff 50%, #555 60%, #555 100%)"
                        className="text-6xl font-semibold"
                      />
                    </Fade>
                  </Slide>
                </h1>
              </Slide>
              <Fade delay={4500}>
                <Slide direction="right" delay={0.5}>
                  <p className="mb-8 text-2xl leading-relaxed font-medium text-gray-300 text-shadow-md md:text-2xl dark:text-amber-50">
                    <HighlightText
                      text={hero("description")}
                      delay={500}
                      style={{
                        backgroundImage:
                          "linear-gradient(120deg, rgba(34, 197, 234) 0%, rgba(147, 51, 234) 100%)",
                      }}
                    />
                  </p>
                </Slide>
              </Fade>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Fades holdDelay={5}>
                  <Fade delay={2.5}>
                    <a
                      href="projects"
                      className="bg-foreground text-background hover:bg-foreground/90 inline-block rounded-lg px-6 py-3 text-center font-medium transition-colors"
                    >
                      {common("viewProjects")}
                    </a>
                  </Fade>
                  <Fade delay={2.7}>
                    <a
                      href="#contact"
                      className="border-foreground/20 hover:bg-foreground/5 inline-block rounded-lg border px-6 py-3 text-center font-medium transition-colors"
                    >
                      {common("contactMe")}
                    </a>
                  </Fade>
                </Fades>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section id="about" className="relative isolate overflow-hidden py-24 sm:py-32">
        {/* Background gradient effects */}
        <div
          aria-hidden="true"
          className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#22c5ea] to-[#9333ea] opacity-10 dark:opacity-20"
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <Blur inView inViewOnce delay={0.1}>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{about("title")}</h2>
            </Blur>
            <Slide direction="up" inView inViewOnce delay={0.2}>
              <p className="text-foreground/70 mt-8 text-lg leading-8 sm:text-xl">
                {about("description1")}
              </p>
            </Slide>
            <Slide direction="up" inView inViewOnce delay={0.3}>
              <p className="text-foreground/70 mt-6 text-lg leading-8">{about("description2")}</p>
            </Slide>
          </div>

          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <Fade inView inViewOnce delay={0.4}>
              <div className="flex">
                <Link href="/about" className="text-base font-semibold hover:underline">
                  {common("readMore")} <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </Fade>

            <Fades holdDelay={0.1}>
              <dl className="mt-16 grid grid-cols-2 gap-8 sm:mt-20 sm:grid-cols-3 lg:grid-cols-6">
                <Fade inView inViewOnce delay={0.5}>
                  <div className="flex flex-col-reverse gap-1">
                    <dt className="text-foreground/60 text-base/7">Stack</dt>
                    <dd className="text-2xl font-semibold tracking-tight">React & Next.js</dd>
                  </div>
                </Fade>
                <Fade inView inViewOnce delay={0.6}>
                  <div className="flex flex-col-reverse gap-1">
                    <dt className="text-foreground/60 text-base/7">Language</dt>
                    <dd className="text-2xl font-semibold tracking-tight">TypeScript</dd>
                  </div>
                </Fade>
                <Fade inView inViewOnce delay={0.7}>
                  <div className="flex flex-col-reverse gap-1">
                    <dt className="text-foreground/60 text-base/7">Backend</dt>
                    <dd className="text-2xl font-semibold tracking-tight">Node.js</dd>
                  </div>
                </Fade>
                <Fade inView inViewOnce delay={0.8}>
                  <div className="flex flex-col-reverse gap-1">
                    <dt className="text-foreground/60 text-base/7">Styling</dt>
                    <dd className="text-2xl font-semibold tracking-tight">Tailwind CSS</dd>
                  </div>
                </Fade>
                <Fade inView inViewOnce delay={0.9}>
                  <div className="flex flex-col-reverse gap-1">
                    <dt className="text-foreground/60 text-base/7">Database</dt>
                    <dd className="text-2xl font-semibold tracking-tight">PostgreSQL</dd>
                  </div>
                </Fade>
                <Fade inView inViewOnce delay={1.0}>
                  <div className="flex flex-col-reverse gap-1">
                    <dt className="text-foreground/60 text-base/7">Version Control</dt>
                    <dd className="text-2xl font-semibold tracking-tight">Git & GitHub</dd>
                  </div>
                </Fade>
              </dl>
            </Fades>
          </div>
        </div>
      </section>

      {/* Quick Links - Bento Grid */}
      <section className="relative z-20 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <Blur inView inViewOnce delay={0.1}>
            <h2 className="text-center text-base/7 font-semibold text-blue-600 dark:text-blue-400">
              {common("viewProjects")}
            </h2>
          </Blur>
          <Slide direction="up" inView inViewOnce delay={0.2}>
            <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {projects("featured")}
            </p>
          </Slide>
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-2">
            {/* Projects Card - Large */}
            <Slide direction="up" inView inViewOnce delay={0.3}>
              <div className="relative lg:row-span-2">
                <div className="bg-background absolute inset-px rounded-lg lg:rounded-l-[2rem]" />
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                  <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                    <p className="mt-2 text-lg font-medium tracking-tight max-lg:text-center">
                      {projects("title")}
                    </p>
                    <p className="text-foreground/60 mt-2 max-w-lg text-sm/6 max-lg:text-center">
                      {projects("description")}
                    </p>
                    <div className="mt-6">
                      <Link href="/projects" className="text-base font-semibold hover:underline">
                        {projects("viewAll")}
                      </Link>
                    </div>
                  </div>
                  <div className="relative min-h-[30rem] w-full grow">
                    <div className="border-foreground/10 absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-xl border-x-[3px] border-t-[3px] bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl dark:from-blue-950/20 dark:to-purple-950/20">
                      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                        <svg
                          className="mb-6 h-24 w-24 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
                          />
                        </svg>
                        <h3 className="mb-2 text-xl font-bold">Proyectos Innovadores</h3>
                        <p className="text-foreground/60 text-sm">
                          Aplicaciones web, herramientas y experimentos técnicos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 lg:rounded-l-[2rem] dark:ring-white/15" />
              </div>
            </Slide>

            {/* Blog Card - Top */}
            <Slide direction="up" inView inViewOnce delay={0.4}>
              <div className="relative">
                <div className="bg-background absolute inset-px rounded-lg max-lg:rounded-t-[2rem]" />
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                  <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                    <p className="mt-2 text-lg font-medium tracking-tight max-lg:text-center">
                      {blog("title")}
                    </p>
                    <p className="text-foreground/60 mt-2 max-w-lg text-sm/6 max-lg:text-center">
                      {blog("description")}
                    </p>
                    <div className="mt-6">
                      <Link href="/blog" className="text-base font-semibold hover:underline">
                        {blog("readArticles")}
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-8 pt-10 pb-12 max-lg:pb-12 sm:px-10">
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-green-50 to-teal-50 p-8 dark:from-green-950/20 dark:to-teal-950/20">
                      <svg
                        className="h-20 w-20 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-t-[2rem] dark:ring-white/15" />
              </div>
            </Slide>

            {/* Contact Preview Card - Bottom */}
            <Slide direction="up" inView inViewOnce delay={0.5}>
              <div className="relative">
                <div className="bg-background absolute inset-px rounded-lg max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                  <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                    <p className="mt-2 text-lg font-medium tracking-tight max-lg:text-center">
                      {contact("title")}
                    </p>
                    <p className="text-foreground/60 mt-2 max-w-lg text-sm/6 max-lg:text-center">
                      {contact("description")}
                    </p>
                    <div className="mt-6">
                      <a href="#contact" className="text-base font-semibold hover:underline">
                        {common("contactMe")} <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-8 pt-10 pb-12 sm:px-10">
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-8 dark:from-purple-950/20 dark:to-pink-950/20">
                      <svg
                        className="h-20 w-20 text-purple-600 dark:text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem] dark:ring-white/15" />
              </div>
            </Slide>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
      {/* Contact Section */}
      <section id="contact" className="bg-foreground/5 relative z-20 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <Blur inView inViewOnce delay={0.1}>
              <h2 className="mb-6 text-4xl font-bold">{contact("title")}</h2>
            </Blur>
            <Slide direction="up" inView inViewOnce delay={0.2}>
              <p className="text-foreground/80 mx-auto max-w-3xl text-xl">
                {contact("description")}
              </p>
            </Slide>
          </div>
          <Fade inView inViewOnce delay={0.3}>
            <ContactForm />
          </Fade>
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
