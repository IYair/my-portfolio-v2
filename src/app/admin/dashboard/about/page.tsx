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
import { useState } from "react";

// Component imports
import ContactInfoSection from "./components/ContactInfoSection";
import CoursesSection from "./components/CoursesSection";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import ProfileSection from "./components/ProfileSection";
import SkillsSection from "./components/SkillsSection";

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

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "skills":
        return <SkillsSection />;
      case "contact":
        return <ContactInfoSection />;
      case "experience":
        return <ExperienceSection />;
      case "education":
        return <EducationSection />;
      case "courses":
        return <CoursesSection />;
      default:
        return <ProfileSection />;
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
