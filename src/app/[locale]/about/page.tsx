import { getAboutProfile } from "@/services/aboutService";
import { Metadata } from "next";

// Revalidate every 60 seconds
export const revalidate = 60;

import AboutMeSection from "@/components/about/AboutMeSection";
import CoursesSection from "@/components/about/CoursesSection";
import EducationSection from "@/components/about/EducationSection";
import ExperienceSection from "@/components/about/ExperienceSection";
import ProfileSection from "@/components/about/ProfileSection";
import SkillsSection from "@/components/about/SkillsSection";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getAboutProfile();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: `Acerca de ${profile?.name || "Yair Chan"} - ${profile?.title || "Software Developer"}`,
    description:
      profile?.bio?.slice(0, 160) ||
      "Conoce más sobre mi experiencia como desarrollador de software, habilidades técnicas y trayectoria profesional.",
    keywords: `${profile?.name || "Yair Chan"}, desarrollador software, programador, ${profile?.subtitle || "full stack developer"}`,
    openGraph: {
      title: `Acerca de ${profile?.name || "Yair Chan"}`,
      description:
        profile?.bio?.slice(0, 160) ||
        "Desarrollador de software especializado en tecnologías web modernas",
      images: profile?.profileImage ? [profile.profileImage] : ["/images/me.png"],
      type: "profile",
    },
  };
}

export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000" }}>
      <ProfileSection />
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />
      <AboutMeSection />
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
      <SkillsSection />
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />
      <ExperienceSection />
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
      <EducationSection />
      <CoursesSection />
    </div>
  );
}
