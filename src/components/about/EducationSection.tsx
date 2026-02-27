import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { getEducation } from "@/services/aboutService";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Slide } from "@/components/animate-ui/primitives/effects/slide";
import { getLocale, getTranslations } from "next-intl/server";

export default async function EducationSection() {
  const locale = (await getLocale()) as "es" | "en";
  const t = await getTranslations("aboutPage");
  const educations = await getEducation(locale);

  if (educations.length === 0) return null;

  return (
    <section style={{ backgroundColor: "#000", padding: "8rem 0 4rem" }}>
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
            {t("education")}
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
              marginBottom: "4rem",
            }}
          >
            {locale === "en" ? "Academic background" : "Formación académica"}
          </h2>
        </Slide>

        <div className="grid gap-6 sm:grid-cols-2">
          {educations.map((education, i) => (
            <Fade key={education.id} inView inViewOnce delay={150 + i * 100}>
              <div
                className="flex flex-col rounded-2xl p-8"
                style={{
                  backgroundColor: "#111",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <AcademicCapIcon
                  className="mb-5 h-8 w-8"
                  style={{ color: "rgba(100,170,255,0.65)" }}
                />
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.01em",
                    marginBottom: "0.5rem",
                  }}
                >
                  {education.institution}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: "0.75rem",
                    flexGrow: 1,
                  }}
                >
                  {education.degree}
                  {education.field && ` en ${education.field}`}
                </p>
                {(education.startDate || education.endDate) && (
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.28)",
                      fontFamily: "var(--font-geist-mono)",
                      marginTop: "auto",
                      paddingTop: "1rem",
                      borderTop: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {education.startDate}
                    {education.startDate && education.endDate && " — "}
                    {education.endDate}
                  </p>
                )}
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}
