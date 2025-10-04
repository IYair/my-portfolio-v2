import { getAboutProfile } from "@/services/aboutService";
import { Metadata } from "next";

// Revalidate every 60 seconds
export const revalidate = 60;

// Dynamic components
import AboutMeSection from "@/components/about/AboutMeSection";
import ContactSection from "@/components/about/ContactSection";
import CoursesSection from "@/components/about/CoursesSection";
import EducationSection from "@/components/about/EducationSection";
import ExperienceSection from "@/components/about/ExperienceSection";
import ProfileSection from "@/components/about/ProfileSection";
import SkillsSection from "@/components/about/SkillsSection";

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
      <div className="grid h-screen w-full grid-cols-1 gap-6 overflow-y-scroll rounded-2xl px-4 py-16 sm:gap-10 sm:px-8 sm:py-20 lg:grid-cols-3 lg:gap-14 lg:px-40 lg:py-24">
        {/* Left Section */}
        <section id="sideLeft" className="col-span-1 flex flex-col lg:col-span-1">
          <ProfileSection />
          <SkillsSection />
          <ContactSection />
        </section>

        {/* Right Section */}
        <section className="col-span-1 flex flex-col flex-nowrap rounded-2xl bg-slate-800 p-3 sm:p-4 lg:col-span-2">
          <AboutMeSection />

          <div className="mt-3 h-px w-full bg-gradient-to-r from-blue-400 to-transparent sm:mt-4"></div>

          <div className="mt-4 sm:mt-6 lg:mt-10">
            <ExperienceSection />
            <EducationSection />

            <div className="mt-3 h-px w-full bg-gradient-to-r from-blue-400 to-transparent sm:mt-4"></div>

            <CoursesSection />
          </div>
        </section>
      </div>
    </div>
  );
}
