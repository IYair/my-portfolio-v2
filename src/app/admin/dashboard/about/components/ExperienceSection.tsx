"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { BriefcaseIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import type { TiptapEditorRef } from "@/components/editor/TiptapEditor";

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"></div>,
});

interface WorkExperience {
  id: number;
  position: string;
  company: string;
  description: string;
  descriptionHtml?: string | null;
  startDate?: string;
  endDate?: string;
  order: number;
}

interface ExperienceFormData {
  position: string;
  company: string;
  description: string;
  descriptionHtml: string;
  startDate: string;
  endDate: string;
  order: number;
}

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>({
    position: "",
    company: "",
    description: "",
    descriptionHtml: "",
    startDate: "",
    endDate: "",
    order: 0,
  });
  const editorRef = useRef<TiptapEditorRef>(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/about/experience");
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error("Error loading experiences:", error);
      toast.error("Error al cargar las experiencias");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get HTML content from TipTap editor
      const descriptionHtml = editorRef.current?.getHTML() || "";

      // Convert HTML to plain text for backward compatibility
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = descriptionHtml;
      const plainText = tempDiv.textContent || tempDiv.innerText || "";

      const url = editingExperience
        ? `/api/admin/about/experience/${editingExperience.id}`
        : "/api/admin/about/experience";

      const method = editingExperience ? "PUT" : "POST";

      const payload = {
        position: formData.position,
        company: formData.company,
        description: plainText || "Sin descripción",
        descriptionHtml,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        order: formData.order || 0,
      };

      console.log("Sending payload:", payload);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingExperience ? "Experiencia actualizada" : "Experiencia creada");
        loadExperiences();
        resetForm();
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: "Error al parsear respuesta del servidor" };
        }
        console.error("Server error:", errorData);
        toast.error(
          "Error al guardar: " +
            (errorData.error || "Error desconocido") +
            (errorData.details ? ` - ${errorData.details}` : "")
        );
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error(
        "Error de red al guardar la experiencia: " + (error instanceof Error ? error.message : "")
      );
    }
  };

  const handleEdit = (experience: WorkExperience) => {
    setEditingExperience(experience);
    setFormData({
      position: experience.position,
      company: experience.company,
      description: experience.description,
      descriptionHtml: experience.descriptionHtml || "",
      startDate: experience.startDate || "",
      endDate: experience.endDate || "",
      order: experience.order,
    });

    // Set editor content
    setTimeout(() => {
      if (editorRef.current && experience.descriptionHtml) {
        editorRef.current.setContent(experience.descriptionHtml);
      }
    }, 100);

    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta experiencia?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/about/experience/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Experiencia eliminada");
        loadExperiences();
      } else {
        toast.error("Error al eliminar la experiencia");
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("Error al eliminar la experiencia");
    }
  };

  const resetForm = () => {
    setFormData({
      position: "",
      company: "",
      description: "",
      descriptionHtml: "",
      startDate: "",
      endDate: "",
      order: 0,
    });
    editorRef.current?.clear();
    setEditingExperience(null);
    setShowForm(false);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BriefcaseIcon className="h-6 w-6 text-[var(--foreground)]" />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Experiencia Laboral</h2>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Agregar Experiencia
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
            {editingExperience ? "Editar Experiencia" : "Nueva Experiencia"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Puesto
                </label>
                <Input
                  value={formData.position}
                  onChange={e => setFormData({ ...formData, position: e.target.value })}
                  placeholder="ej: Frontend Developer"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Empresa
                </label>
                <Input
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  placeholder="ej: Tech Company S.A."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Fecha de Inicio
                </label>
                <Input
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  placeholder="ej: Enero 2020"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Fecha de Fin
                </label>
                <Input
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  placeholder="ej: Presente o Diciembre 2022"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Orden
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Descripción (Editor Rico)
              </label>
              <TiptapEditor
                ref={editorRef}
                content={formData.descriptionHtml}
                onChange={html => setFormData({ ...formData, descriptionHtml: html })}
                placeholder="Describe tus responsabilidades y logros en este puesto..."
              />
              <p className="mt-1 text-xs text-[var(--foreground)] opacity-60">
                Usa el editor para dar formato a tu experiencia laboral. Puedes agregar listas,
                negritas, cursivas, enlaces, etc.
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit">{editingExperience ? "Actualizar" : "Crear"}</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {experiences.map(experience => (
          <Card key={experience.id} className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {experience.position}
                </h3>
                <p className="font-medium text-red-600">{experience.company}</p>
                {(experience.startDate || experience.endDate) && (
                  <p className="text-sm text-[var(--foreground)] opacity-70">
                    {experience.startDate} - {experience.endDate || "Presente"}
                  </p>
                )}
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(experience)}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(experience.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {experience.descriptionHtml ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-[var(--foreground)] opacity-80"
                dangerouslySetInnerHTML={{ __html: experience.descriptionHtml }}
              />
            ) : (
              <p className="whitespace-pre-wrap text-[var(--foreground)] opacity-80">
                {experience.description}
              </p>
            )}
            <p className="mt-2 text-xs text-[var(--foreground)] opacity-70">
              Orden: {experience.order}
            </p>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-[var(--foreground)] opacity-70">No hay experiencias agregadas</p>
        </div>
      )}
    </div>
  );
}
