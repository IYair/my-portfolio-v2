"use client";

import BlogSection from "@/components/blog/BlogSection";
import ContactForm from "@/components/features/ContactForm";
import { Meteors } from "@/components/ui/meteors";
import Image from "next/image";

export default function Home() {
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
                Hola, soy{" "}
                <span className="bg-gradient-to-b from-gray-300 to-gray-900 bg-clip-text text-6xl leading-none font-semibold whitespace-pre-wrap text-transparent dark:from-white dark:to-gray-800">
                  Yair Chan
                </span>
              </h1>
              <p className="mb-8 text-2xl leading-relaxed font-medium text-gray-500 md:text-2xl dark:text-gray-300">
                Desarrollador Full Stack apasionado por crear experiencias digitales increíbles y
                soluciones innovadoras.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#projects"
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-6 py-3 text-center font-medium transition-colors"
                >
                  Ver Proyectos
                </a>
                <a
                  href="#contact"
                  className="border-foreground/20 hover:bg-foreground/5 rounded-lg border px-6 py-3 text-center font-medium transition-colors"
                >
                  Contáctame
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
              <h2 className="mb-6 text-3xl font-bold">Acerca de mí</h2>
              <p className="text-foreground/80 mb-6 leading-relaxed">
                Soy un desarrollador con experiencia en tecnologías modernas como React, Next.js,
                Node.js y TypeScript. Me encanta resolver problemas complejos y crear aplicaciones
                que marquen la diferencia.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Cuando no estoy programando, me gusta escribir en mi blog sobre tecnología y
                compartir conocimientos con la comunidad.
              </p>
            </div>
            <div className="bg-background border-foreground/10 rounded-lg border p-8">
              <h3 className="mb-4 text-xl font-semibold">Tecnologías</h3>
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
              <h3 className="mb-4 text-2xl font-bold">Proyectos</h3>
              <p className="text-foreground/80 mb-6">
                Explora mis proyectos más recientes y las tecnologías que utilizo.
              </p>
              <a
                href="#projects"
                className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Ver todos los proyectos →
              </a>
            </div>
            <div className="border-foreground/10 rounded-lg border bg-gradient-to-br from-green-50 to-teal-50 p-8 dark:from-green-950/20 dark:to-teal-950/20">
              <h3 className="mb-4 text-2xl font-bold">Blog</h3>
              <p className="text-foreground/80 mb-6">
                Lee mis últimos artículos sobre desarrollo web y tecnología.
              </p>
              <a
                href="#blog"
                className="inline-flex items-center font-medium text-green-600 hover:underline dark:text-green-400"
              >
                Leer artículos →
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
            <h2 className="mb-6 text-4xl font-bold">Contáctame</h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-xl">
              ¿Tienes un proyecto en mente? ¡Me encantaría conocer más detalles! Envíame un mensaje
              y conversemos sobre cómo puedo ayudarte.
            </p>
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
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/yair-chan/"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/EnyaDev"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
          <div className="border-foreground/10 text-foreground/60 mt-8 border-t pt-8 text-center text-sm">
            © 2025 Yair Chan. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
