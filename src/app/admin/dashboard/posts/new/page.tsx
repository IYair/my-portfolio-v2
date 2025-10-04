"use client";

import FormEditor, { FormEditorRef } from "@/components/editor/FormEditor";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import PostPreview from "@/components/blog/PostPreview";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TagSelector from "@/components/ui/TagSelector";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/hooks/useToast";
import {
  BookOpenIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { error, success, promise } = useToast();
  const editorRef = useRef<FormEditorRef>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
    featured: false,
    tags: [] as string[],
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableTags = [
    "JavaScript",
    "React",
    "Next.js",
    "TypeScript",
    "Tutorial",
    "Tips",
    "CSS",
    "HTML",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "AWS",
    "GraphQL",
    "REST API",
    "Testing",
    "DevOps",
    "Frontend",
    "Backend",
    "Fullstack",
    "UI/UX",
    "Performance",
  ];

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
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
      // Clear title error when user starts typing
      if (errors.title) {
        setErrors(prev => ({ ...prev, title: "" }));
      }
    },
    [generateSlug, errors.title]
  );

  const handleContentChange = useCallback(
    (content: string) => {
      setFormData(prev => ({ ...prev, content }));
      // Clear content error when user starts typing
      if (errors.content) {
        setErrors(prev => ({ ...prev, content: "" }));
      }
    },
    [errors.content]
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }

    if (!formData.content.trim() || formData.content === "<p></p>") {
      newErrors.content = "El contenido es requerido";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "El slug es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      error("Formulario incompleto", "Por favor completa todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        contentType: "tiptap" as const,
      };

      const submitPromise = fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      promise(submitPromise, {
        loading: "Creando post...",
        success: "Post creado exitosamente",
        error: "Error al crear el post",
      });

      const response = await submitPromise;
      if (response.ok) {
        success("¡Éxito!", "Tu post ha sido creado correctamente");
        setTimeout(() => router.push("/admin/dashboard/posts"), 1500);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      error("Error inesperado", "Hubo un problema al crear el post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async () => {
    if (!formData.title.trim()) {
      error("Título requerido", "Necesitas al menos un título para guardar el borrador");
      return;
    }

    setFormData(prev => ({ ...prev, published: false }));
    setTimeout(() => {
      const formEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(formEvent);
    }, 100);
  };

  const breadcrumbs = [
    { name: "Posts", href: "/admin/dashboard/posts", current: false },
    { name: "Crear Post", current: true },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs pages={breadcrumbs} homeHref="/admin/dashboard" />

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crear Nuevo Post</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Crea un nuevo post para tu blog usando el editor de texto enriquecido
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowPreview(true)}
            variant="ghost"
            size="sm"
            icon={<EyeIcon className="h-4 w-4" />}
          >
            Vista previa
          </Button>
          <Button
            onClick={saveDraft}
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            icon={<ExclamationCircleIcon className="h-4 w-4" />}
          >
            Guardar borrador
          </Button>
          <Button
            onClick={() => {
              setFormData(prev => ({ ...prev, published: true }));
              setTimeout(() => {
                const formEvent = { preventDefault: () => {} } as React.FormEvent;
                handleSubmit(formEvent);
              }, 100);
            }}
            variant="primary"
            loading={isSubmitting}
            disabled={!formData.title.trim()}
            icon={<BookOpenIcon className="h-4 w-4" />}
          >
            Publicar
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title and Slug Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-6">
            <div>
              <Input
                label="Título del Post"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Escribe un título atractivo para tu post..."
                required
                error={errors.title}
                className="text-xl"
              />
            </div>
            <div>
              <Input
                label="URL Slug"
                value={formData.slug}
                onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-amigable-del-post"
                helperText="Se genera automáticamente desde el título. Puedes editarlo."
                error={errors.slug}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Extracto
              </label>
              <textarea
                value={formData.excerpt}
                onChange={e => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData(prev => ({ ...prev, excerpt: value }));
                  }
                }}
                placeholder="Escribe un resumen breve que aparecerá en la lista de posts..."
                rows={3}
                maxLength={500}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <div className="mt-1 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Opcional: Descripción corta para SEO y vista previa
                </p>
                <p
                  className={`text-sm ${formData.excerpt.length > 450 ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {formData.excerpt.length}/500
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
              Contenido del Post
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Usa la barra de herramientas para formatear tu contenido
            </p>
            {errors.content && (
              <p className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400">
                <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                {errors.content}
              </p>
            )}
          </div>
          <FormEditor
            ref={editorRef}
            content={formData.content}
            onChange={handleContentChange}
            placeholder="Comienza a escribir el contenido de tu post aquí..."
          />
        </div>

        {/* Settings Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Tags */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <TagSelector
              tags={formData.tags}
              onChange={tags => setFormData(prev => ({ ...prev, tags }))}
              availableTags={availableTags}
              maxTags={5}
              label="Tags del Post"
            />
          </div>

          {/* Publication Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              Configuración de Publicación
            </h3>
            <div className="space-y-4">
              <Toggle
                checked={formData.published}
                onChange={value => setFormData(prev => ({ ...prev, published: value }))}
                label="Publicar inmediatamente"
                description="El post será visible públicamente"
                color="green"
              />
              <Toggle
                checked={formData.featured}
                onChange={value => setFormData(prev => ({ ...prev, featured: value }))}
                label="Post destacado"
                description="Aparecerá en la sección de destacados"
                color="blue"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 border-t border-gray-200 py-6 dark:border-gray-700">
          <Link href="/admin/dashboard/posts">
            <Button variant="ghost" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button
            type="button"
            onClick={saveDraft}
            variant="secondary"
            disabled={isSubmitting || !formData.title.trim()}
            icon={<ExclamationCircleIcon className="h-4 w-4" />}
          >
            Guardar Borrador
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={!formData.title.trim()}
            icon={<CheckCircleIcon className="h-4 w-4" />}
          >
            {formData.published ? "Publicar Post" : "Crear Post"}
          </Button>
        </div>
      </form>

      {/* Vista Previa Modal */}
      {showPreview && (
        <PostPreview
          title={formData.title}
          excerpt={formData.excerpt}
          content={formData.content}
          tags={formData.tags}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
