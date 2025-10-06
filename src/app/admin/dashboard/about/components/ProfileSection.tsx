"use client";

import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";
import { UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import type { TiptapEditorRef } from "@/components/editor/TiptapEditor";

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"></div>,
});

interface ProfileData {
  id?: number;
  name: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  bio: string;
  bioHtml: string;
  bioEn: string;
  bioHtmlEn: string;
  profileImage?: string;
}

export default function ProfileSection() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    title: "",
    titleEn: "",
    subtitle: "",
    subtitleEn: "",
    bio: "",
    bioHtml: "",
    bioEn: "",
    bioHtmlEn: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const bioEditorRef = useRef<TiptapEditorRef>(null);
  const bioEditorEnRef = useRef<TiptapEditorRef>(null);

  const regenerateImageUrl = useCallback(async (imageUrl: string) => {
    try {
      // Extraer la key de la URL de S3
      const url = new URL(imageUrl);
      const key = url.pathname.substring(1); // Remover la primera barra

      const response = await fetch("/api/regenerate-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
    } catch (error) {
      console.error("Error regenerating URL:", error);
    }
    return imageUrl; // Retorna la URL original si falla
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/about/profile");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          // Si hay una imagen, regenerar su URL
          if (data.profileImage) {
            data.profileImage = await regenerateImageUrl(data.profileImage);
          }
          // Asegurar que los campos en inglés tengan valores por defecto
          setProfile({
            ...data,
            titleEn: data.titleEn || "",
            subtitleEn: data.subtitleEn || "",
            bioHtml: data.bioHtml || "",
            bioEn: data.bioEn || "",
            bioHtmlEn: data.bioHtmlEn || "",
          });

          // Set editor content
          setTimeout(() => {
            if (bioEditorRef.current && data.bioHtml) {
              bioEditorRef.current.setContent(data.bioHtml);
            }
            if (bioEditorEnRef.current && data.bioHtmlEn) {
              bioEditorEnRef.current.setContent(data.bioHtmlEn);
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  }, [regenerateImageUrl]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleTranslate = async () => {
    const bioHtml = bioEditorRef.current?.getHTML() || "";

    if (!profile.title || !profile.subtitle || !bioHtml) {
      toast.error("Completa el título, subtítulo y biografía antes de traducir");
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: [profile.title, profile.subtitle, bioHtml],
          targetLang: "en",
          sourceLang: "es",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({
          ...profile,
          titleEn: data.translations[0] || "",
          subtitleEn: data.translations[1] || "",
          bioHtmlEn: data.translations[2] || "",
        });

        // Update English bio editor content
        setTimeout(() => {
          if (bioEditorEnRef.current && data.translations[2]) {
            bioEditorEnRef.current.setContent(data.translations[2]);
          }
        }, 100);

        toast.success("Traducción completada");
      } else {
        toast.error("Error al traducir");
      }
    } catch (error) {
      console.error("Error translating:", error);
      toast.error("Error al traducir");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Get HTML content from editors
      const bioHtml = bioEditorRef.current?.getHTML() || "";
      const bioHtmlEn = bioEditorEnRef.current?.getHTML() || "";

      // Convert HTML to plain text for backward compatibility
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = bioHtml;
      const plainTextBio = tempDiv.textContent || tempDiv.innerText || "";

      const tempDivEn = document.createElement("div");
      tempDivEn.innerHTML = bioHtmlEn;
      const plainTextBioEn = tempDivEn.textContent || tempDivEn.innerText || "";

      const payload = {
        ...profile,
        bio: plainTextBio,
        bioHtml,
        bioEn: plainTextBioEn || null,
        bioHtmlEn: bioHtmlEn || null,
      };

      const response = await fetch("/api/admin/about/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({
          ...data,
          titleEn: data.titleEn || "",
          subtitleEn: data.subtitleEn || "",
          bioHtml: data.bioHtml || "",
          bioEn: data.bioEn || "",
          bioHtmlEn: data.bioHtmlEn || "",
        });
        toast.success("Perfil actualizado correctamente");
      } else {
        toast.error("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error al guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--foreground)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <UserIcon className="h-6 w-6 text-[var(--foreground)]" />
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Mi Perfil</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Nombre Completo
            </label>
            <Input
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Título Principal
            </label>
            <Input
              value={profile.title}
              onChange={e => setProfile({ ...profile, title: e.target.value })}
              placeholder="ej: SOFTWARE DEVELOPER"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Subtítulo/Especialidades
          </label>
          <Input
            value={profile.subtitle}
            onChange={e => setProfile({ ...profile, subtitle: e.target.value })}
            placeholder="ej: Software Developer | Web Developer | Full Stack Developer"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Imagen de Perfil
          </label>
          <ImageUpload
            value={profile.profileImage}
            onChange={url => setProfile({ ...profile, profileImage: url })}
            disabled={saving}
            placeholder="Sube tu imagen de perfil"
            maxSize={5}
            width={200}
            height={200}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Biografía/Presentación (Español)
          </label>
          <TiptapEditor
            ref={bioEditorRef}
            content={profile.bioHtml}
            onChange={html => setProfile({ ...profile, bioHtml: html })}
            placeholder="Escribe una breve descripción sobre ti..."
          />
          <p className="mt-1 text-xs text-[var(--foreground)] opacity-60">
            Usa el editor para dar formato a tu biografía. Puedes agregar listas, negritas,
            cursivas, enlaces, etc.
          </p>
        </div>

        {/* Translate Button */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleTranslate}
            disabled={isTranslating || !profile.title || !profile.subtitle}
          >
            {isTranslating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                Traduciendo...
              </>
            ) : (
              <>🌐 Traducir al Inglés</>
            )}
          </Button>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
        </div>

        {/* English Fields */}
        <div className="space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Versión en Inglés</h3>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Título Principal (English)
            </label>
            <Input
              value={profile.titleEn}
              onChange={e => setProfile({ ...profile, titleEn: e.target.value })}
              placeholder="e.g: SOFTWARE DEVELOPER"
            />
            <p className="mt-1 text-xs text-[var(--foreground)] opacity-60">
              Puedes editarlo manualmente o usar el botón de traducción
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Subtítulo/Especialidades (English)
            </label>
            <Input
              value={profile.subtitleEn}
              onChange={e => setProfile({ ...profile, subtitleEn: e.target.value })}
              placeholder="e.g: Software Developer | Web Developer | Full Stack Developer"
            />
            <p className="mt-1 text-xs text-[var(--foreground)] opacity-60">
              Puedes editarlo manualmente o usar el botón de traducción
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Biografía/Presentación (English)
            </label>
            <TiptapEditor
              ref={bioEditorEnRef}
              content={profile.bioHtmlEn}
              onChange={html => setProfile({ ...profile, bioHtmlEn: html })}
              placeholder="Write a brief description about yourself..."
            />
            <p className="mt-1 text-xs text-[var(--foreground)] opacity-60">
              Edita la traducción si es necesario para mejorar el formato o corregir términos
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar Perfil"}
          </Button>
        </div>
      </form>
    </div>
  );
}
