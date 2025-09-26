import { Metadata } from "next";
import { getAboutProfile } from "@/services/aboutService";

// Dynamic components
import ProfileSection from "@/components/about/ProfileSection";
import SkillsSection from "@/components/about/SkillsSection";
import ContactSection from "@/components/about/ContactSection";
import AboutMeSection from "@/components/about/AboutMeSection";
import ExperienceSection from "@/components/about/ExperienceSection";
import EducationSection from "@/components/about/EducationSection";
import CoursesSection from "@/components/about/CoursesSection";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getAboutProfile();

  return {
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
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url(/images/NoiseTexture.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="grid h-screen w-full grid-cols-1 gap-14 overflow-y-scroll rounded-2xl px-4 py-24 lg:grid-cols-3 lg:px-40">
        {/* Left Section */}
        <section id="sideLeft" className="col-span-1 flex flex-col lg:col-span-1">
          <ProfileSection />
          <SkillsSection />
          <ContactSection />
        </section>

        {/* Right Section */}
        <section className="col-span-1 flex flex-col flex-nowrap rounded-2xl bg-white p-4 lg:col-span-2">
          <AboutMeSection />

          <div className="mt-4 h-px w-full bg-gradient-to-r from-blue-900 to-transparent"></div>

          <div className="mt-10">
            <ExperienceSection />
            <EducationSection />

            <div className="mt-4 h-px w-full bg-gradient-to-r from-blue-900 to-transparent"></div>

            <CoursesSection />
          </div>
        </section>
      </div>
    </div>
  );
}
