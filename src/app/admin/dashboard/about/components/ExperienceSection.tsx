"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { BriefcaseIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import type { TiptapEditorRef } from "@/components/editor/TiptapEditor";
import { format as tempoFormat, parse as tempoParse } from "@formkit/tempo";

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"></div>,
});

interface WorkExperience {
  id: number;
  position: string;
  positionEn?: string | null;
  company: string;
  description: string;
  descriptionHtml?: string | null;
  descriptionEn?: string | null;
  descriptionHtmlEn?: string | null;
  startDate?: string;
  endDate?: string;
  order: number;
}

interface ExperienceFormData {
  position: string;
  positionEn: string;
  company: string;
  description: string;
  descriptionHtml: string;
  descriptionEn: string;
  descriptionHtmlEn: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  isPresent: boolean;
  order: number;
}

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>({
    position: "",
    positionEn: "",
    company: "",
    description: "",
    descriptionHtml: "",
    descriptionEn: "",
    descriptionHtmlEn: "",
    startDate: undefined,
    endDate: undefined,
    isPresent: false,
    order: 0,
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const editorRef = useRef<TiptapEditorRef>(null);
  const editorEnRef = useRef<TiptapEditorRef>(null);

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

  const handleTranslate = async () => {
    if (!formData.position || !formData.descriptionHtml) {
      toast.error("Completa el puesto y la descripción antes de traducir");
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: [formData.position, formData.descriptionHtml],
          targetLang: "en",
          sourceLang: "es",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...formData,
          positionEn: data.translations[0] || "",
          descriptionHtmlEn: data.translations[1] || "",
        });

        // Update English editor content
        setTimeout(() => {
          if (editorEnRef.current && data.translations[1]) {
            editorEnRef.current.setContent(data.translations[1]);
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

    try {
      // Get HTML content from TipTap editors
      const descriptionHtml = editorRef.current?.getHTML() || "";
      const descriptionHtmlEn = editorEnRef.current?.getHTML() || "";

      // Convert HTML to plain text for backward compatibility
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = descriptionHtml;
      const plainText = tempDiv.textContent || tempDiv.innerText || "";

      const tempDivEn = document.createElement("div");
      tempDivEn.innerHTML = descriptionHtmlEn;
      const plainTextEn = tempDivEn.textContent || tempDivEn.innerText || "";

      const url = editingExperience
        ? `/api/admin/about/experience/${editingExperience.id}`
        : "/api/admin/about/experience";

      const method = editingExperience ? "PUT" : "POST";

      const payload = {
        position: formData.position,
        positionEn: formData.positionEn || null,
        company: formData.company,
        description: plainText || "Sin descripción",
        descriptionHtml,
        descriptionEn: plainTextEn || null,
        descriptionHtmlEn: descriptionHtmlEn || null,
        startDate: formData.startDate
          ? tempoFormat(formData.startDate, "MMMM YYYY", "es").toUpperCase()
          : null,
        endDate: formData.isPresent
          ? "Presente"
          : formData.endDate
            ? tempoFormat(formData.endDate, "MMMM YYYY", "es").toUpperCase()
            : null,
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
        } catch {
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

    // Parse dates from string format "MMMM YYYY" to Date using Tempo
    const parseDate = (dateStr: string | undefined | null): Date | undefined => {
      if (!dateStr || dateStr === "Presente" || dateStr === "Present") return undefined;

      try {
        // Try different formats with Tempo
        const formats = [
          "MMMM YYYY", // "ENERO 2023"
          "MMM YYYY", // "ENE 2023"
        ];

        for (const formatStr of formats) {
          try {
            const parsedDate = tempoParse(dateStr, formatStr, "es");
            if (parsedDate && !isNaN(parsedDate.getTime())) {
              return parsedDate;
            }
          } catch {
            continue;
          }
        }

        // If all formats fail, return undefined
        console.warn(`Could not parse date: ${dateStr}`);
        return undefined;
      } catch (error) {
        console.error("Error parsing date:", dateStr, error);
        return undefined;
      }
    };

    setFormData({
      position: experience.position,
      positionEn: experience.positionEn || "",
      company: experience.company,
      description: experience.description,
      descriptionHtml: experience.descriptionHtml || "",
      descriptionEn: experience.descriptionEn || "",
      descriptionHtmlEn: experience.descriptionHtmlEn || "",
      startDate: parseDate(experience.startDate),
      endDate: parseDate(experience.endDate),
      isPresent: experience.endDate?.toLowerCase() === "presente",
      order: experience.order,
    });

    // Set editor content
    setTimeout(() => {
      if (editorRef.current && experience.descriptionHtml) {
        editorRef.current.setContent(experience.descriptionHtml);
      }
      if (editorEnRef.current && experience.descriptionHtmlEn) {
        editorEnRef.current.setContent(experience.descriptionHtmlEn);
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
      positionEn: "",
      company: "",
      description: "",
      descriptionHtml: "",
      descriptionEn: "",
      descriptionHtmlEn: "",
      startDate: undefined,
      endDate: undefined,
      isPresent: false,
      order: 0,
    });
    editorRef.current?.clear();
    editorEnRef.current?.clear();
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Fecha de Inicio
                </label>
                <DatePicker
                  date={formData.startDate}
                  onDateChange={date => setFormData({ ...formData, startDate: date })}
                  placeholder="Seleccionar fecha de inicio"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Fecha de Fin
                </label>
                <DatePicker
                  date={formData.endDate}
                  onDateChange={date => setFormData({ ...formData, endDate: date })}
                  placeholder="Seleccionar fecha de fin"
                  disabled={formData.isPresent}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Checkbox
                id="isPresent"
                checked={formData.isPresent}
                onChange={e =>
                  setFormData({
                    ...formData,
                    isPresent: e.target.checked,
                    endDate: e.target.checked ? undefined : formData.endDate,
                  })
                }
                label="Trabajo actual"
                description="Marca esta opción si actualmente trabajas en esta empresa"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

            <div className="space-y-6">
              {/* Spanish Editor */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Descripción en Español (Editor Rico)
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

              {/* Translate Button */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleTranslate}
                  disabled={isTranslating || !formData.position || !formData.descriptionHtml}
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

              {/* English Position */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Puesto en Inglés
                </label>
                <Input
                  value={formData.positionEn}
                  onChange={e => setFormData({ ...formData, positionEn: e.target.value })}
                  placeholder="e.g: Frontend Developer"
                />
                <p className="mt-1 text-xs text-[var(--foreground)] opacity-60">
                  Puedes editarlo manualmente o usar el botón de traducción
                </p>
              </div>

              {/* English Editor */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Descripción en Inglés (Editor Rico)
                </label>
                <TiptapEditor
                  ref={editorEnRef}
                  content={formData.descriptionHtmlEn}
                  onChange={html => setFormData({ ...formData, descriptionHtmlEn: html })}
                  placeholder="Describe your responsibilities and achievements in this position..."
                />
                <p className="mt-1 text-xs text-[var(--foreground)] opacity-60">
                  Edita la traducción si es necesario para mejorar el formato o corregir términos
                  técnicos
                </p>
              </div>
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
