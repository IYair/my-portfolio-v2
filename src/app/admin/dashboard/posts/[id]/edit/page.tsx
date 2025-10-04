"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import useAdminStore from "@/stores/adminStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TagSelector from "@/components/ui/TagSelector";
import Toggle from "@/components/ui/Toggle";
import FormEditor, { FormEditorRef } from "@/components/editor/FormEditor";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import PostPreview from "@/components/blog/PostPreview";
import { useToast } from "@/hooks/useToast";
import {
  BookOpenIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured: boolean;
  tags: { id: number; name: string }[];
}

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const { error, success, promise } = useToast();
  const editorRef = useRef<FormEditorRef>(null);
  const { invalidatePostsCache, invalidateAllCache } = useAdminStore();

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

  // Load post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${postId}`);
        if (response.ok) {
          const post: Post = await response.json();
          setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || "",
            content: post.content,
            published: post.published,
            featured: post.featured,
            tags: post.tags.map(tag => tag.name),
          });
        } else if (response.status === 404) {
          error("Post no encontrado", "El post que intentas editar no existe");
          setTimeout(() => router.push("/admin/dashboard/posts"), 2000);
        } else {
          error("Error al cargar", "No se pudo cargar el post");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        error("Error inesperado", "Hubo un problema al cargar el post");
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

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

  const handleContentChange = useCallback((content: string) => {
    console.log("📝 Content changed, length:", content.length);
    console.log("📄 New content preview:", content.substring(0, 200));
    setFormData(prev => {
      const newData = { ...prev, content };
      console.log("💾 Updating formData with new content");
      return newData;
    });
    // Clear content error when user starts typing
    setErrors(prev => {
      if (prev.content) {
        const { content, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

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

    console.log("🔍 Form submission started");
    console.log("📝 Form data:", formData);
    console.log("📏 Content length in formData:", formData.content.length);
    console.log("📄 Content first 500 chars:", formData.content.substring(0, 500));

    if (!validateForm()) {
      console.log("❌ Validation failed");
      error("Formulario incompleto", "Por favor completa todos los campos requeridos");
      return;
    }

    console.log("✅ Validation passed");
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        contentType: "tiptap" as const,
      };

      console.log("📤 Sending data to API");
      console.log("📤 Content preview being sent:", submitData.content.substring(0, 500));

      const submitPromise = fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      promise(submitPromise, {
        loading: "Actualizando post...",
        success: "Post actualizado exitosamente",
        error: "Error al actualizar el post",
      });

      const response = await submitPromise;
      console.log("📥 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Post updated successfully:", data);

        // Invalidar caché para que se muestren los cambios
        invalidatePostsCache();
        invalidateAllCache();

        success("¡Éxito!", "Tu post ha sido actualizado correctamente");
        setTimeout(() => router.push("/admin/dashboard/posts"), 1500);
      } else {
        const errorData = await response.json();
        console.error("❌ Update failed:", errorData);
        error("Error al actualizar", errorData.error || "Error desconocido");
      }
    } catch (err) {
      console.error("❌ Error updating post:", err);
      error("Error inesperado", "Hubo un problema al actualizar el post");
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

  const handlePublishToggle = async (value: boolean) => {
    setFormData(prev => ({ ...prev, published: value }));
    // Auto-save cuando se cambia el estado de publicación
    if (formData.title.trim()) {
      setTimeout(async () => {
        const updatedData = { ...formData, published: value, contentType: "tiptap" as const };
        try {
          const response = await fetch(`/api/admin/posts/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          });
          if (response.ok) {
            invalidatePostsCache();
            invalidateAllCache();
            success("Configuración actualizada", "El estado de publicación se ha guardado");
          }
        } catch (err) {
          error("Error al guardar", "No se pudo actualizar la configuración");
        }
      }, 500);
    }
  };

  const handleFeaturedToggle = async (value: boolean) => {
    setFormData(prev => ({ ...prev, featured: value }));
    // Auto-save cuando se cambia el estado de destacado
    if (formData.title.trim()) {
      setTimeout(async () => {
        const updatedData = { ...formData, featured: value, contentType: "tiptap" as const };
        try {
          const response = await fetch(`/api/admin/posts/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          });
          if (response.ok) {
            invalidatePostsCache();
            invalidateAllCache();
            success("Configuración actualizada", "El estado de destacado se ha guardado");
          }
        } catch (err) {
          error("Error al guardar", "No se pudo actualizar la configuración");
        }
      }, 500);
    }
  };

  const breadcrumbs = [
    { name: "Posts", href: "/admin/dashboard/posts", current: false },
    { name: "Editar Post", current: true },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs pages={breadcrumbs} homeHref="/admin/dashboard" />
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-64 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-8 h-4 w-96 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-6">
            <div className="h-48 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-64 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs pages={breadcrumbs} homeHref="/admin/dashboard" />

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Post</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Edita el contenido de tu post usando el editor de texto enriquecido
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
                onChange={handlePublishToggle}
                label="Publicar inmediatamente"
                description="El post será visible públicamente"
                color="green"
              />
              <Toggle
                checked={formData.featured}
                onChange={handleFeaturedToggle}
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
            {formData.published ? "Actualizar y Publicar" : "Actualizar Post"}
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
