import { getWorkExperience } from "@/services/aboutService";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Slide } from "@/components/animate-ui/primitives/effects/slide";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { getLocale, getTranslations } from "next-intl/server";

export default async function ExperienceSection() {
  const locale = (await getLocale()) as "es" | "en";
  const t = await getTranslations("aboutPage");
  const experiences = await getWorkExperience(locale);

  if (experiences.length === 0) return null;

  return (
    <section style={{ backgroundColor: "#f5f5f7", padding: "8rem 0" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Fade inView inViewOnce>
          <p
            style={{
              color: "#0066cc",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            {t("experience")}
          </p>
        </Fade>

        <Slide direction="up" inView inViewOnce delay={100}>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "#1d1d1f",
              marginBottom: "4rem",
            }}
          >
            {locale === "en" ? "Professional journey" : "Trayectoria profesional"}
          </h2>
        </Slide>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: "0.6rem",
              width: "1px",
              background:
                "linear-gradient(to bottom, transparent, #d2d2d7 8%, #d2d2d7 92%, transparent)",
            }}
          />

          <div className="space-y-14">
            {experiences.map((experience, i) => {
              const hasRichContent =
                experience.descriptionHtml && experience.descriptionHtml.trim() !== "";

              return (
                <Fade key={experience.id} inView inViewOnce delay={150 + i * 100}>
                  <div className="relative pl-10 lg:pl-0">
                    {/* Timeline dot */}
                    <div
                      className="absolute"
                      style={{
                        left: "0.225rem",
                        top: "0.35rem",
                        width: "0.75rem",
                        height: "0.75rem",
                        borderRadius: "9999px",
                        backgroundColor: "#0066cc",
                        boxShadow: "0 0 0 3px rgba(0,102,204,0.15)",
                      }}
                    />

                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-12 lg:pl-0">
                      {/* Meta — left column on desktop */}
                      <div className="lg:col-span-1 lg:pl-10" style={{ paddingTop: "0.1rem" }}>
                        <p
                          style={{
                            fontSize: "0.72rem",
                            color: "#aeaeb2",
                            fontFamily: "var(--font-geist-mono)",
                            marginBottom: "0.5rem",
                            textTransform: "lowercase",
                          }}
                        >
                          {experience.startDate}
                          {experience.endDate &&
                            ` — ${
                              experience.endDate.toLowerCase() === "presente" ||
                              experience.endDate.toLowerCase() === "present"
                                ? t("present")
                                : experience.endDate
                            }`}
                        </p>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            color: "#0066cc",
                            fontWeight: 600,
                          }}
                        >
                          {experience.company}
                        </p>
                      </div>

                      {/* Content — right column on desktop */}
                      <div className="lg:col-span-2">
                        <div className="mb-3 flex items-start gap-3">
                          <BriefcaseIcon
                            className="mt-0.5 h-5 w-5 flex-shrink-0"
                            style={{ color: "#1d1d1f", opacity: 0.5 }}
                          />
                          <h3
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: 700,
                              color: "#1d1d1f",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {experience.position}
                          </h3>
                        </div>

                        {hasRichContent ? (
                          <div
                            className="prose prose-sm prose-p:text-[#6e6e73] prose-p:leading-relaxed prose-p:text-justify prose-ul:text-[#6e6e73] prose-li:text-[#6e6e73] prose-strong:text-[#1d1d1f] prose-a:text-[#0066cc] max-w-none"
                            dangerouslySetInnerHTML={{ __html: experience.descriptionHtml || "" }}
                          />
                        ) : (
                          <p
                            style={{
                              fontSize: "0.9rem",
                              lineHeight: 1.8,
                              color: "#6e6e73",
                              textAlign: "justify",
                            }}
                          >
                            {experience.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Fade>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
