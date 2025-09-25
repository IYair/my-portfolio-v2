import { Meteors } from "@/components/ui/meteors";
import Image from "next/image";
import ContactForm from "@/components/features/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section id="home" className="relative flex pt-20 min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        <Meteors number={30} maxDuration={10}  />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-1 gap-12 items-center">
            {/* Text Content */}
            <div className="max-w-3xl relative z-20">
              <h1 className="text-6xl md:text-6xl font-bold mb-6">
                Hola, soy{" "}
                <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                  Yair Chan
                </span>
              </h1>
              <p className="text-2xl md:text-2xl text-foreground/80 mb-8 leading-relaxed">
                Desarrollador Full Stack apasionado por crear experiencias digitales
                increíbles y soluciones innovadoras.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#projects"
                  className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors text-center"
                >
                  Ver Proyectos
                </a>
                <a
                  href="#contact"
                  className="border border-foreground/20 px-6 py-3 rounded-lg font-medium hover:bg-foreground/5 transition-colors text-center"
                >
                  Contáctame
                </a>
              </div>
            </div>
          </div>
        </div>
            {/* Profile Image */}
            <div className="flex justify-center md:justify-end md:absolute md:right-6 lg:right-12 xl:right-24 2xl:right-40 md:bottom-0 md:h-full pt-20">
              <div className="relative h-96 md:h-full brightness-[65%]">
                <Image
                  src="/images/me.png"
                  alt="Yair Chan - Desarrollador Full Stack"
                  width={400}
                  height={600}
                  className="object-contain h-full w-auto relative z-5 neon-glow"
                  priority
                />
              </div>
            </div>
      </section>

      {/* About Preview */}
      <section id="about" className="py-20 bg-foreground/5 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Acerca de mí</h2>
              <p className="text-foreground/80 mb-6 leading-relaxed">
                Soy un desarrollador con experiencia en tecnologías modernas como React,
                Next.js, Node.js y TypeScript. Me encanta resolver problemas complejos
                y crear aplicaciones que marquen la diferencia.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Cuando no estoy programando, me gusta escribir en mi blog sobre
                tecnología y compartir conocimientos con la comunidad.
              </p>
            </div>
            <div className="bg-background rounded-lg p-8 border border-foreground/10">
              <h3 className="text-xl font-semibold mb-4">Tecnologías</h3>
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
      <section className="py-20 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-8 rounded-lg border border-foreground/10">
              <h3 className="text-2xl font-bold mb-4">Proyectos</h3>
              <p className="text-foreground/80 mb-6">
                Explora mis proyectos más recientes y las tecnologías que utilizo.
              </p>
              <a
                href="#projects"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Ver todos los proyectos →
              </a>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 p-8 rounded-lg border border-foreground/10">
              <h3 className="text-2xl font-bold mb-4">Blog</h3>
              <p className="text-foreground/80 mb-6">
                Lee mis últimos artículos sobre desarrollo web y tecnología.
              </p>
              <a
                href="#blog"
                className="inline-flex items-center text-green-600 dark:text-green-400 font-medium hover:underline"
              >
                Leer artículos →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-foreground/5 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Contáctame</h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              ¿Tienes un proyecto en mente? ¡Me encantaría conocer más detalles!
              Envíame un mensaje y conversemos sobre cómo puedo ayudarte.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10 py-12 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="font-mono font-semibold text-lg mb-4 md:mb-0">
              Tu Nombre
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                Twitter
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-foreground/10 text-center text-foreground/60 text-sm">
            © 2024 Tu Nombre. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
