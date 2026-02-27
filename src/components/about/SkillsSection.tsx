import Image from "next/image";
import { getSkills } from "@/services/aboutService";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Slide } from "@/components/animate-ui/primitives/effects/slide";
import { getLocale, getTranslations } from "next-intl/server";

// Icons that are dark/black on transparent and need inversion on dark backgrounds
const DARK_ICONS = [
  "nextjs",
  "github",
  "express",
  "flask",
  "fastapi",
  "astro",
  "electron",
  "vercel",
];

function needsInvert(iconUrl: string) {
  return DARK_ICONS.some(name => iconUrl.toLowerCase().includes(`/${name}/`));
}

export default async function SkillsSection() {
  const t = await getTranslations("aboutPage");
  const locale = (await getLocale()) as "es" | "en";
  const skills = await getSkills();

  return (
    <section style={{ backgroundColor: "#000", padding: "8rem 0" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Fade inView inViewOnce>
          <p
            style={{
              color: "rgba(100,170,255,0.9)",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            {t("skills")}
          </p>
        </Fade>

        <Slide direction="up" inView inViewOnce delay={100}>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            {locale === "en" ? "Technologies I work with" : "Tecnologías que domino"}
          </h2>
        </Slide>

        <Fade inView inViewOnce delay={150}>
          <p
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.38)",
              marginBottom: "4rem",
              maxWidth: "38rem",
              lineHeight: 1.7,
            }}
          >
            {locale === "en"
              ? "A curated selection of tools and frameworks I use to build modern applications."
              : "Una selección de herramientas y frameworks que uso para construir aplicaciones modernas."}
          </p>
        </Fade>

        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9">
          {skills.map((skill, i) => (
            <Fade key={skill.id} inView inViewOnce delay={200 + i * 30}>
              <div
                className="group flex flex-col items-center gap-2.5 rounded-xl p-3 transition-all duration-300"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  height={40}
                  width={40}
                  loading="lazy"
                  className="h-9 w-9 transition-transform duration-300 group-hover:scale-110"
                  style={
                    needsInvert(skill.icon) ? { filter: "invert(1) brightness(1.8)" } : undefined
                  }
                />
                <p
                  style={{
                    fontSize: "0.6rem",
                    color: "rgba(255,255,255,0.4)",
                    textAlign: "center",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {skill.name}
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}
