"use client";

import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface ProfileData {
  id?: number;
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  profileImage?: string;
}

export default function ProfileSection() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    title: "",
    subtitle: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
          setProfile(data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/about/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
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
            Biografía/Presentación
          </label>
          <Textarea
            value={profile.bio}
            onChange={e => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Escribe una breve descripción sobre ti..."
            rows={6}
            required
          />
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
