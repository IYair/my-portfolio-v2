"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
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
    profileImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/about/profile");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setProfile(data);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

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
            URL de Imagen de Perfil
          </label>
          <Input
            value={profile.profileImage || ""}
            onChange={e => setProfile({ ...profile, profileImage: e.target.value })}
            placeholder="ej: /images/profile.jpg"
          />
          {profile.profileImage && (
            <div className="mt-2">
              <Image
                src={profile.profileImage}
                alt="Vista previa"
                width={96}
                height={96}
                className="rounded-lg border border-gray-200 object-cover dark:border-gray-700"
              />
            </div>
          )}
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
