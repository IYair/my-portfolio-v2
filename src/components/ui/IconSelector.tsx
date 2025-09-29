"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

// Iconos para habilidades técnicas
const skillIcons = [
  // Frontend Básico
  { path: "/icons/skill_html.svg", name: "HTML", category: "Frontend" },
  { path: "/icons/skill_css.svg", name: "CSS", category: "Frontend" },
  { path: "/icons/skill_javascript.svg", name: "JavaScript", category: "Frontend" },
  { path: "/icons/skill_typescript.svg", name: "TypeScript", category: "Frontend" },

  // Frameworks Frontend
  { path: "/icons/skill_react.svg", name: "React", category: "Frontend" },
  { path: "/icons/skill_vue.svg", name: "Vue.js", category: "Frontend" },
  { path: "/icons/skill_angular.svg", name: "Angular", category: "Frontend" },
  { path: "/icons/skill_svelte.svg", name: "Svelte", category: "Frontend" },
  { path: "/icons/skill_nextjs.svg", name: "Next.js", category: "Frontend" },

  // Estilos y UI
  { path: "/icons/skill_tailwind.svg", name: "Tailwind CSS", category: "Frontend" },
  { path: "/icons/skill_sass.svg", name: "SASS", category: "Frontend" },
  { path: "/icons/skill_bootstrap.svg", name: "Bootstrap", category: "Frontend" },

  // Estado y Gestión
  { path: "/icons/skill_redux.svg", name: "Redux", category: "Frontend" },
  { path: "/icons/skill_graphql.svg", name: "GraphQL", category: "Frontend" },
  { path: "/icons/skill_inertia.svg", name: "Inertia.js", category: "Frontend" },

  // Backend
  { path: "/icons/skill_nodejs.svg", name: "Node.js", category: "Backend" },
  { path: "/icons/skill_express.svg", name: "Express.js", category: "Backend" },
  { path: "/icons/skill_nestjs.svg", name: "NestJS", category: "Backend" },
  { path: "/icons/skill_python.svg", name: "Python", category: "Backend" },
  { path: "/icons/skill_laravel.svg", name: "Laravel", category: "Backend" },
  { path: "/icons/skill_dotnet.svg", name: "ASP.NET", category: "Backend" },
  { path: "/icons/skill_csharp.svg", name: "C#", category: "Backend" },

  // Bases de Datos
  { path: "/icons/skill_mysql.svg", name: "MySQL", category: "Database" },
  { path: "/icons/skill_postgresql.svg", name: "PostgreSQL", category: "Database" },
  { path: "/icons/skill_sqlserver.svg", name: "SQL Server", category: "Database" },
  { path: "/icons/skill_mongodb.svg", name: "MongoDB", category: "Database" },
  { path: "/icons/skill_redis.svg", name: "Redis", category: "Database" },

  // Cloud y DevOps
  { path: "/icons/skill_aws.svg", name: "AWS", category: "Cloud" },
  { path: "/icons/skill_azure.svg", name: "Azure", category: "Cloud" },
  { path: "/icons/skill_vercel.svg", name: "Vercel", category: "Cloud" },
  { path: "/icons/skill_firebase.svg", name: "Firebase", category: "Cloud" },
  { path: "/icons/skill_kubernetes.svg", name: "Kubernetes", category: "DevOps" },
  { path: "/icons/skill_docker.svg", name: "Docker", category: "DevOps" },

  // Mobile
  { path: "/icons/skill_flutter.svg", name: "Flutter", category: "Mobile" },

  // Herramientas de Desarrollo
  { path: "/icons/skill_git.svg", name: "Git", category: "Tools" },
];

// Iconos para información de contacto - incluyendo heroicons como rutas normales
const contactIcons = [
  { path: "/icons/flag-mexico.svg", name: "Bandera México", category: "Location" },
  { path: "/icons/icon-linkedin.svg", name: "LinkedIn", category: "Social" },
  { path: "/icons/github.svg", name: "GitHub", category: "Social" },
  { path: "/icons/logo-github.svg", name: "GitHub (Alt)", category: "Social" },
  // Heroicons como opciones especiales
  { path: "heroicon-envelope", name: "Email (Icono)", category: "Heroicon" },
  { path: "heroicon-phone", name: "Teléfono (Icono)", category: "Heroicon" },
  { path: "heroicon-location", name: "Ubicación (Icono)", category: "Heroicon" },
  { path: "heroicon-website", name: "Sitio Web (Icono)", category: "Heroicon" },
];

// Iconos para proveedores de cursos
const providerIcons = [
  { path: "/icons/providers/platzi-svgrepo-com.svg", name: "Platzi", category: "Education" },
  { path: "/icons/providers/udemy-icon-svgrepo-com.svg", name: "Udemy", category: "Education" },
  { path: "/icons/providers/coursera-svgrepo-com.svg", name: "Coursera", category: "Education" },
  { path: "/icons/providers/edx-svgrepo-com.svg", name: "edX", category: "Education" },
  { path: "/icons/providers/udacity-svgrepo-com.svg", name: "Udacity", category: "Education" },
  {
    path: "/icons/providers/codecademy-svgrepo-com.svg",
    name: "Codecademy",
    category: "Education",
  },
  {
    path: "/icons/providers/freecodecamp-svgrepo-com.svg",
    name: "freeCodeCamp",
    category: "Education",
  },
  {
    path: "/icons/providers/khan-academy-icon-svgrepo-com.svg",
    name: "Khan Academy",
    category: "Education",
  },
  {
    path: "/icons/providers/linkedin-svgrepo-com.svg",
    name: "LinkedIn Learning",
    category: "Education",
  },
  {
    path: "/icons/providers/pluralsight-svgrepo-com.svg",
    name: "Pluralsight",
    category: "Education",
  },
  { path: "/icons/providers/devtalles.svg", name: "DevTalles", category: "Education" },
  {
    path: "/icons/providers/google-color-svgrepo-com.svg",
    name: "Google",
    category: "Certification",
  },
  {
    path: "/icons/providers/microsoft-svgrepo-com.svg",
    name: "Microsoft",
    category: "Certification",
  },
  {
    path: "/icons/providers/amazon-color-svgrepo-com.svg",
    name: "Amazon (AWS)",
    category: "Certification",
  },
  { path: "/icons/providers/oracle-svgrepo-com.svg", name: "Oracle", category: "Certification" },
  { path: "/icons/providers/cisco-svgrepo-com.svg", name: "Cisco", category: "Certification" },
];

interface IconSelectorProps {
  value: string;
  onChange: (iconPath: string) => void;
  placeholder?: string;
  type?: "skills" | "contact" | "providers";
}

export default function IconSelector({
  value,
  onChange,
  placeholder = "Selecciona un icono",
  type = "skills",
}: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableIcons =
    type === "contact" ? contactIcons : type === "providers" ? providerIcons : skillIcons;

  // Buscar icono seleccionado
  const selectedIcon = availableIcons.find(icon => icon.path === value);

  // Función para obtener el componente de heroicon
  const getHeroiconComponent = (iconPath: string) => {
    switch (iconPath) {
      case "heroicon-envelope":
        return EnvelopeIcon;
      case "heroicon-phone":
        return DevicePhoneMobileIcon;
      case "heroicon-location":
        return MapPinIcon;
      case "heroicon-website":
        return GlobeAltIcon;
      default:
        return null;
    }
  };

  // Función para actualizar posición del dropdown
  const updateDropdownPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  // Cerrar dropdown al hacer click fuera y manejar scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const handleSelect = (iconPath: string) => {
    onChange(iconPath);
    setIsOpen(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Selector Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        <div className="flex items-center space-x-2">
          {selectedIcon ? (
            <>
              {selectedIcon.path.startsWith("heroicon-") ? (
                (() => {
                  const HeroiconComponent = getHeroiconComponent(selectedIcon.path);
                  return HeroiconComponent ? (
                    <HeroiconComponent className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : null;
                })()
              ) : (
                <Image
                  src={selectedIcon.path}
                  alt={selectedIcon.name}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              )}
              <span>{selectedIcon.name}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="fixed z-[9999] max-h-60 overflow-auto rounded-lg border border-gray-300 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          }}
        >
          {availableIcons.map(icon => (
            <button
              key={icon.path}
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleSelect(icon.path);
              }}
              onMouseDown={e => e.preventDefault()}
              className="flex w-full items-center space-x-2 px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            >
              {icon.path.startsWith("heroicon-") ? (
                (() => {
                  const HeroiconComponent = getHeroiconComponent(icon.path);
                  return HeroiconComponent ? (
                    <HeroiconComponent className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : null;
                })()
              ) : (
                <Image
                  src={icon.path}
                  alt={icon.name}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              )}
              <span className="text-gray-900 dark:text-white">{icon.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
