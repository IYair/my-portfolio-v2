"use client";

import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  AcademicCapIcon,
  BookOpenIcon,
  BriefcaseIcon,
  RocketLaunchIcon,
  TrophyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState, lazy, Suspense } from "react";

// Lazy load components for better performance
const ContactInfoSection = lazy(() => import("./components/ContactInfoSection"));
const CoursesSection = lazy(() => import("./components/CoursesSection"));
const EducationSection = lazy(() => import("./components/EducationSection"));
const ExperienceSection = lazy(() => import("./components/ExperienceSection"));
const ProfileSection = lazy(() => import("./components/ProfileSection"));
const SkillsSection = lazy(() => import("./components/SkillsSection"));

type Section = "profile" | "skills" | "contact" | "experience" | "education" | "courses";

export default function AboutAdmin() {
  const [activeSection, setActiveSection] = useState<Section>("profile");

  const sections = [
    {
      id: "profile" as Section,
      title: "Mi Perfil",
      icon: UserIcon,
      description: "Información personal básica",
    },
    {
      id: "skills" as Section,
      title: "Habilidades",
      icon: TrophyIcon,
      description: "Habilidades técnicas",
    },
    {
      id: "contact" as Section,
      title: "Contacto",
      icon: RocketLaunchIcon,
      description: "Información de contacto",
    },
    {
      id: "experience" as Section,
      title: "Experiencia",
      icon: BriefcaseIcon,
      description: "Experiencia laboral",
    },
    {
      id: "education" as Section,
      title: "Educación",
      icon: AcademicCapIcon,
      description: "Formación académica",
    },
    {
      id: "courses" as Section,
      title: "Cursos",
      icon: BookOpenIcon,
      description: "Cursos y certificaciones",
    },
  ];

  const LoadingFallback = () => (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--foreground)]"></div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ProfileSection />
          </Suspense>
        );
      case "skills":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SkillsSection />
          </Suspense>
        );
      case "contact":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ContactInfoSection />
          </Suspense>
        );
      case "experience":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ExperienceSection />
          </Suspense>
        );
      case "education":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <EducationSection />
          </Suspense>
        );
      case "courses":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <CoursesSection />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ProfileSection />
          </Suspense>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-[var(--foreground)]">
          Gestión de Página &quot;Acerca&quot;
        </h1>
        <p className="text-[var(--foreground)] opacity-80">
          Administra el contenido de tu página personal
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="mb-4 font-semibold text-[var(--foreground)]">Secciones</h2>
            <div className="space-y-2">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "primary" : "ghost"}
                    className="group w-full justify-start"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-[var(--foreground)] opacity-70 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                        {section.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">{renderSection()}</Card>
        </div>
      </div>
    </div>
  );
}
