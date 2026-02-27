import { getAboutProfile, getContactInfo } from "@/services/aboutService";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Slide } from "@/components/animate-ui/primitives/effects/slide";
import Image from "next/image";
import { getLocale } from "next-intl/server";

export default async function ProfileSection() {
  const locale = (await getLocale()) as "es" | "en";
  const profile = await getAboutProfile(locale);
  const contactInfo = await getContactInfo();

  const name = profile?.name || "Yair Chan";
  const title = profile?.title || "Software Developer";
  const subtitle = profile?.subtitle || "Full Stack Developer";
  const profileImage = profile?.profileImage || "/images/me.png";

  const linkedinContact = contactInfo.find(c => c.type.toLowerCase() === "linkedin");
  const githubContact = contactInfo.find(c => c.type.toLowerCase() === "github");
  const emailContact = contactInfo.find(c => c.type.toLowerCase() === "email");

  const stats = [
    { value: "3+", label: locale === "en" ? "Years of experience" : "Años de experiencia" },
    { value: "20+", label: locale === "en" ? "Projects completed" : "Proyectos completados" },
    { value: "28+", label: locale === "en" ? "Technologies" : "Tecnologías" },
  ];

  return (
    <section style={{ backgroundColor: "#000", padding: "8rem 0" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* ── Left: text content ── */}
          <div>
            <Fade delay={100}>
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.45em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                Full Stack Developer
              </p>
            </Fade>

            <Slide direction="up" delay={200}>
              <h1
                style={{
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  marginBottom: "1rem",
                  color: "#fff",
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                }}
              >
                {name}.
              </h1>
            </Slide>

            <Fade delay={400}>
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "clamp(1rem, 2vw, 1.5rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </p>
            </Fade>

            <Fade delay={500}>
              <p
                style={{
                  color: "#0066cc",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  marginBottom: "3rem",
                }}
              >
                {subtitle}
              </p>
            </Fade>

            {/* Stats */}
            <Fade delay={600}>
              <div
                className="mb-10 grid grid-cols-3 gap-6"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  paddingTop: "2rem",
                }}
              >
                {stats.map(stat => (
                  <div key={stat.label}>
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 700,
                        color: "#fff",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.38)",
                        marginTop: "0.25rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Fade>

            {/* Social / Contact buttons */}
            <Fade delay={800}>
              <div className="flex flex-wrap gap-3">
                {linkedinContact && (
                  <a
                    href={
                      linkedinContact.value.startsWith("http")
                        ? linkedinContact.value
                        : `https://linkedin.com/in/${linkedinContact.value}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.625rem 1.4rem",
                      borderRadius: "9999px",
                      backgroundColor: "#fff",
                      color: "#000",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "opacity 0.2s",
                    }}
                  >
                    LinkedIn
                  </a>
                )}
                {githubContact && (
                  <a
                    href={
                      githubContact.value.startsWith("http")
                        ? githubContact.value
                        : `https://github.com/${githubContact.value}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.625rem 1.4rem",
                      borderRadius: "9999px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      backdropFilter: "blur(12px)",
                      transition: "background-color 0.2s",
                    }}
                  >
                    GitHub
                  </a>
                )}
                {emailContact && (
                  <a
                    href={`mailto:${emailContact.value}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.625rem 1.4rem",
                      borderRadius: "9999px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      backdropFilter: "blur(12px)",
                      transition: "background-color 0.2s",
                    }}
                  >
                    Email
                  </a>
                )}
              </div>
            </Fade>
          </div>

          {/* ── Right: Profile photo ── */}
          <Fade delay={300}>
            <div className="relative mx-auto lg:mx-0" style={{ maxWidth: "400px" }}>
              {/* Subtle glow behind the photo */}
              <div
                className="pointer-events-none absolute -inset-8 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)",
                }}
              />
              <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "3/4" }}>
                <Image
                  src={profileImage}
                  alt={name}
                  fill
                  priority
                  className="object-cover"
                  style={{ opacity: 0.92 }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
                {/* Bottom gradient */}
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: "25%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
                  }}
                />
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}
