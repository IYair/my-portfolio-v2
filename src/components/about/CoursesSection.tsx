import { getCourses } from "@/services/aboutService";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Slide } from "@/components/animate-ui/primitives/effects/slide";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

export default async function CoursesSection() {
  const locale = (await getLocale()) as "es" | "en";
  const t = await getTranslations("aboutPage");
  const coursesByProvider = await getCourses(locale);

  if (Object.keys(coursesByProvider).length === 0) return null;

  return (
    <section style={{ backgroundColor: "#000", padding: "4rem 0 8rem" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "6rem",
          }}
        >
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
              {t("courses")}
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
              {locale === "en" ? "Certifications & courses" : "Certificaciones y cursos"}
            </h2>
          </Slide>

          <div className="space-y-14">
            {Object.entries(coursesByProvider).map(([provider, courses], groupIdx) => {
              const firstCourse = courses[0];
              return (
                <Fade key={provider} inView inViewOnce delay={150 + groupIdx * 100}>
                  <div>
                    {/* Provider header */}
                    <div
                      className="mb-6 flex items-center gap-4"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                        paddingBottom: "1.25rem",
                      }}
                    >
                      {firstCourse.providerIcon && (
                        <div
                          className="flex items-center justify-center rounded-xl"
                          style={{
                            width: "3rem",
                            height: "3rem",
                            backgroundColor: "rgba(255,255,255,0.06)",
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={firstCourse.providerIcon}
                            alt={provider}
                            width={28}
                            height={28}
                            className="h-7 w-7 object-contain"
                          />
                        </div>
                      )}
                      <h3
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#fff",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {provider}
                      </h3>
                    </div>

                    {/* Courses grid */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {courses.map((course, courseIdx) => (
                        <Fade
                          key={course.id}
                          inView
                          inViewOnce
                          delay={200 + groupIdx * 80 + courseIdx * 40}
                        >
                          <div
                            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            {course.icon && (
                              <Image
                                src={course.icon}
                                alt={course.title}
                                width={28}
                                height={28}
                                className="h-7 w-7 flex-shrink-0 object-contain"
                              />
                            )}
                            <p
                              style={{
                                fontSize: "0.8rem",
                                color: "rgba(255,255,255,0.6)",
                                lineHeight: 1.4,
                              }}
                            >
                              {course.title}
                            </p>
                          </div>
                        </Fade>
                      ))}
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
