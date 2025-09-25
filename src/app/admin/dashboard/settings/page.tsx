"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/hooks/useToast";
import {
  UserCircleIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  PhotoIcon,
  CheckIcon
} from "@heroicons/react/24/outline";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  ownerName: string;
  ownerEmail: string;
  siteUrl: string;
  profileImage: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  features: {
    enableComments: boolean;
    enableNewsletter: boolean;
    enableDarkMode: boolean;
    enableAnalytics: boolean;
    maintenanceMode: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Mi Portfolio",
    siteDescription: "Portfolio personal y blog de desarrollo web",
    ownerName: "Tu Nombre",
    ownerEmail: "tu@email.com",
    siteUrl: "https://tu-portfolio.com",
    profileImage: "/images/me.png",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: ""
    },
    features: {
      enableComments: true,
      enableNewsletter: false,
      enableDarkMode: true,
      enableAnalytics: false,
      maintenanceMode: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error, promise } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const savePromise = fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      promise(savePromise, {
        loading: "Guardando configuración...",
        success: "Configuración guardada exitosamente",
        error: "Error al guardar la configuración",
      });

      await savePromise;
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateSocialLink = (platform: keyof SiteSettings['socialLinks'], value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const updateFeature = (feature: keyof SiteSettings['features'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value
      }
    }));

    // Show notification for important feature changes
    const featureNames: Record<keyof SiteSettings['features'], string> = {
      enableComments: 'Comentarios',
      enableNewsletter: 'Newsletter',
      enableDarkMode: 'Modo Oscuro',
      enableAnalytics: 'Analytics',
      maintenanceMode: 'Modo Mantenimiento'
    };

    const featureName = featureNames[feature];
    const action = value ? 'habilitado' : 'deshabilitado';

    if (feature === 'maintenanceMode') {
      if (value) {
        error("Modo Mantenimiento Activado", "Los visitantes verán una página de mantenimiento");
      } else {
        success("Modo Mantenimiento Desactivado", "El sitio ya está disponible para visitantes");
      }
    } else {
      success(`${featureName} ${action}`, "Recuerda guardar los cambios para aplicarlos");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            Configuración del Sitio
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Administra la configuración general de tu portfolio y información personal.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            variant="primary"
            icon={<CheckIcon className="h-5 w-5" />}
            onClick={handleSave}
            loading={isSaving}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* Información del Sitio */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <GlobeAltIcon className="h-5 w-5 mr-2" />
              Información del Sitio
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Nombre del Sitio"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                placeholder="Mi Portfolio"
              />
              <Input
                label="URL del Sitio"
                value={settings.siteUrl}
                onChange={(e) => updateSetting('siteUrl', e.target.value)}
                placeholder="https://tu-portfolio.com"
                leftIcon={<GlobeAltIcon className="h-4 w-4" />}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Descripción del Sitio"
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
                  placeholder="Portfolio personal y blog de desarrollo web"
                  leftIcon={<DocumentTextIcon className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información Personal */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <UserCircleIcon className="h-5 w-5 mr-2" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Tu Nombre"
                value={settings.ownerName}
                onChange={(e) => updateSetting('ownerName', e.target.value)}
                placeholder="Tu Nombre Completo"
                leftIcon={<UserCircleIcon className="h-4 w-4" />}
              />
              <Input
                label="Email de Contacto"
                type="email"
                value={settings.ownerEmail}
                onChange={(e) => updateSetting('ownerEmail', e.target.value)}
                placeholder="tu@email.com"
                leftIcon={<EnvelopeIcon className="h-4 w-4" />}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Imagen de Perfil"
                  value={settings.profileImage}
                  onChange={(e) => updateSetting('profileImage', e.target.value)}
                  placeholder="/images/me.png"
                  leftIcon={<PhotoIcon className="h-4 w-4" />}
                  helperText="Ruta a tu imagen de perfil (ej: /images/me.png)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Redes Sociales
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Input
                label="GitHub"
                value={settings.socialLinks.github}
                onChange={(e) => updateSocialLink('github', e.target.value)}
                placeholder="https://github.com/tu-usuario"
                leftIcon={
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                }
              />
              <Input
                label="LinkedIn"
                value={settings.socialLinks.linkedin}
                onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/tu-usuario"
                leftIcon={
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                }
              />
              <Input
                label="Twitter"
                value={settings.socialLinks.twitter}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                placeholder="https://twitter.com/tu-usuario"
                leftIcon={
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        {/* Configuración de Funcionalidades */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Funcionalidades
            </h3>
            <div className="space-y-4">
              <Toggle
                checked={settings.features.enableComments}
                onChange={(value) => updateFeature('enableComments', value)}
                label="Comentarios"
                description="Permite a los usuarios comentar en los posts del blog"
                color="green"
              />

              <Toggle
                checked={settings.features.enableNewsletter}
                onChange={(value) => updateFeature('enableNewsletter', value)}
                label="Newsletter"
                description="Muestra el formulario de suscripción al newsletter"
                color="blue"
              />

              <Toggle
                checked={settings.features.enableDarkMode}
                onChange={(value) => updateFeature('enableDarkMode', value)}
                label="Modo Oscuro"
                description="Permite a los usuarios cambiar entre tema claro y oscuro"
                color="indigo"
              />

              <Toggle
                checked={settings.features.enableAnalytics}
                onChange={(value) => updateFeature('enableAnalytics', value)}
                label="Analytics"
                description="Habilita el seguimiento de Google Analytics"
                color="purple"
              />

              <Toggle
                checked={settings.features.maintenanceMode}
                onChange={(value) => updateFeature('maintenanceMode', value)}
                label="Modo Mantenimiento"
                description="Activa una página de mantenimiento para visitantes (los admins siguen teniendo acceso)"
                color="red"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}