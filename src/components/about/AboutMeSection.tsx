import { getAboutProfile } from "@/services/aboutService";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Slide } from "@/components/animate-ui/primitives/effects/slide";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AboutMeSection() {
  const locale = (await getLocale()) as "es" | "en";
  const t = await getTranslations("aboutPage");
  const profile = await getAboutProfile(locale);

  if (!profile) return null;

  const hasRichContent = profile.bioHtml && profile.bioHtml.trim() !== "";

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
            {t("aboutMe")}
          </p>
        </Fade>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: headline */}
          <div>
            <Slide direction="up" inView inViewOnce delay={100}>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  color: "#1d1d1f",
                  marginBottom: "1.5rem",
                }}
              >
                {profile.title}
              </h2>
            </Slide>

            <Fade inView inViewOnce delay={200}>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#0066cc",
                  fontWeight: 500,
                  marginBottom: "2rem",
                }}
              >
                {profile.subtitle}
              </p>
            </Fade>

            {/* Key highlights */}
            <Fade inView inViewOnce delay={300}>
              <div className="space-y-4">
                {[
                  {
                    label: locale === "en" ? "Location" : "Ubicación",
                    value: "Campeche, México",
                  },
                  {
                    label: locale === "en" ? "Availability" : "Disponibilidad",
                    value: locale === "en" ? "Open to opportunities" : "Abierto a oportunidades",
                  },
                  {
                    label: locale === "en" ? "Focus" : "Enfoque",
                    value: locale === "en" ? "Web & Mobile" : "Web y Mobile",
                  },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      paddingBottom: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "0.8rem", color: "#aeaeb2" }}>{item.label}</span>
                    <span style={{ fontSize: "0.875rem", color: "#1d1d1f", fontWeight: 500 }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </Fade>
          </div>

          {/* Right: bio text */}
          <Fade inView inViewOnce delay={200}>
            <div>
              {hasRichContent ? (
                <div
                  className="prose prose-sm prose-p:text-[#6e6e73] prose-p:leading-relaxed prose-p:text-justify prose-strong:text-[#1d1d1f] prose-a:text-[#0066cc] prose-headings:text-[#1d1d1f] prose-ul:text-[#6e6e73] prose-li:text-[#6e6e73] max-w-none"
                  dangerouslySetInnerHTML={{ __html: profile.bioHtml || "" }}
                />
              ) : (
                <p
                  style={{
                    fontSize: "1.05rem",
                    lineHeight: 1.85,
                    color: "#6e6e73",
                    textAlign: "justify",
                  }}
                >
                  {profile.bio}
                </p>
              )}
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}
