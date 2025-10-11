"use client";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import ImageUpload from "@/components/ui/ImageUpload";
import TagSelector from "@/components/ui/TagSelector";
import { useToast } from "@/hooks/useToast";
import { RocketLaunchIcon, CheckCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useRouter, useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useAdminStore, { Project } from "@/stores/adminStore";
import apiClient from "@/lib/api-client";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { error, success, promise } = useToast();
  const { fetchProjects } = useAdminStore();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    image: "",
    demoUrl: "",
    githubUrl: "",
    technologies: [] as string[],
    featured: false,
    order: 0,
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableTechnologies = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Express",
    "Tailwind CSS",
    "CSS",
    "HTML",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Prisma",
    "Docker",
    "AWS",
    "Vercel",
    "GraphQL",
    "REST API",
    "Redux",
    "Zustand",
    "Vue.js",
    "Angular",
    "Python",
    "Django",
    "Flask",
    "FastAPI",
    "Git",
    "GitHub",
    "GitLab",
  ];

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);

        if (!response.ok) {
          throw new Error("Proyecto no encontrado");
        }

        const project: Project = await response.json();

        setFormData({
          title: project.title,
          slug: project.slug,
          description: project.description || "",
          longDescription: project.longDescription || "",
          image: project.image || "",
          demoUrl: project.demoUrl || "",
          githubUrl: project.githubUrl || "",
          technologies: project.technologies,
          featured: project.featured,
          order: project.order,
        });
      } catch (err) {
        error("Error al cargar el proyecto");
        console.error(err);
        router.push("/admin/dashboard/projects");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, error, router]);

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }, []);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setFormData(prev => ({
        ...prev,
        title: newTitle,
        slug: generateSlug(newTitle),
      }));
      if (errors.title) {
        setErrors(prev => ({ ...prev, title: "" }));
      }
    },
    [generateSlug, errors.title]
  );

  const handleInputChange = useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const handleToggleChange = useCallback(
    (field: string) => (checked: boolean) => {
      setFormData(prev => ({ ...prev, [field]: checked }));
    },
    []
  );

  const handleImageUpload = useCallback((url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  }, []);

  const handleTechnologiesChange = useCallback(
    (tags: string[]) => {
      setFormData(prev => ({ ...prev, technologies: tags }));
      if (errors.technologies) {
        setErrors(prev => ({ ...prev, technologies: "" }));
      }
    },
    [errors.technologies]
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "El slug es requerido";
    }

    if (formData.technologies.length === 0) {
      newErrors.technologies = "Debes seleccionar al menos una tecnología";
    }

    if (formData.demoUrl && !isValidUrl(formData.demoUrl)) {
      newErrors.demoUrl = "La URL del demo no es válida";
    }

    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = "La URL de GitHub no es válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      error("Por favor corrige los errores en el formulario");
      return;
    }

    setIsSubmitting(true);

    try {
      await promise(
        apiClient
          .patch(`/api/projects/${projectId}`, {
            ...formData,
            description: formData.description || undefined,
            longDescription: formData.longDescription || undefined,
            image: formData.image || undefined,
            demoUrl: formData.demoUrl || undefined,
            githubUrl: formData.githubUrl || undefined,
          })
          .then(res => res.data),
        {
          loading: "Actualizando proyecto...",
          success: "¡Proyecto actualizado exitosamente!",
          error: (err: any) =>
            err.response?.data?.error || err.message || "Error al actualizar el proyecto",
        }
      );

      // Invalidate cache and refetch
      await fetchProjects();

      // Redirect to projects list
      setTimeout(() => {
        router.push("/admin/dashboard/projects");
      }, 1000);
    } catch (err) {
      console.error("Error updating project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/dashboard/projects");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        pages={[
          { name: "Dashboard", href: "/admin/dashboard", current: false },
          { name: "Proyectos", href: "/admin/dashboard/projects", current: false },
          { name: "Editar Proyecto", current: true },
        ]}
        homeHref="/admin/dashboard"
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
          <RocketLaunchIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Proyecto</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Actualiza la información del proyecto
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Información Básica
          </h2>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Título del Proyecto"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Ej: Sistema de Gestión de Inventarios"
                error={errors.title}
                required
              />

              <Input
                label="Slug (URL)"
                value={formData.slug}
                onChange={handleInputChange("slug")}
                placeholder="sistema-gestion-inventarios"
                error={errors.slug}
                helperText="Se genera automáticamente del título, pero puedes editarlo"
                required
              />
            </div>

            <Textarea
              label="Descripción Corta"
              value={formData.description}
              onChange={handleInputChange("description")}
              placeholder="Breve descripción del proyecto (1-2 líneas)"
              rows={2}
              helperText="Descripción breve que se mostrará en las tarjetas del proyecto"
            />

            <Textarea
              label="Descripción Detallada"
              value={formData.longDescription}
              onChange={handleInputChange("longDescription")}
              placeholder="Descripción completa del proyecto, sus características y objetivos"
              rows={6}
              helperText="Descripción completa que se mostrará en la página de detalle del proyecto"
            />
          </div>
        </div>

        {/* Media & Links */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Imagen y Enlaces
          </h2>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Imagen del Proyecto</label>
              <ImageUpload
                value={formData.image}
                onChange={handleImageUpload}
                placeholder="Sube la imagen del proyecto"
                maxSize={5}
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Imagen principal del proyecto (recomendado: 1200x630px)
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="URL de Demostración"
                value={formData.demoUrl}
                onChange={handleInputChange("demoUrl")}
                placeholder="https://mi-proyecto.vercel.app"
                error={errors.demoUrl}
                helperText="Enlace al proyecto en vivo"
              />

              <Input
                label="URL de GitHub"
                value={formData.githubUrl}
                onChange={handleInputChange("githubUrl")}
                placeholder="https://github.com/usuario/proyecto"
                error={errors.githubUrl}
                helperText="Enlace al repositorio del proyecto"
              />
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Tecnologías</h2>

          <div>
            <TagSelector
              label="Tecnologías Utilizadas"
              tags={formData.technologies}
              availableTags={availableTechnologies}
              onChange={handleTechnologiesChange}
              placeholder="Selecciona las tecnologías..."
            />
            {errors.technologies && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.technologies}</p>
            )}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Selecciona todas las tecnologías utilizadas en el proyecto
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Configuración
          </h2>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Toggle
                label="Proyecto Destacado"
                description="Mostrar este proyecto en la sección destacados"
                checked={formData.featured}
                onChange={handleToggleChange("featured")}
              />

              <Input
                label="Orden de Visualización"
                type="number"
                value={formData.order.toString()}
                onChange={e => {
                  const value = parseInt(e.target.value) || 0;
                  setFormData(prev => ({ ...prev, order: value }));
                }}
                placeholder="0"
                helperText="Orden en que aparecerá el proyecto (0 = primero)"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            icon={<CheckCircleIcon className="h-5 w-5" />}
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
