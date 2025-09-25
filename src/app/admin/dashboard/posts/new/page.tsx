"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import FormBuilder from "@/components/ui/FormBuilder";
import Toggle from "@/components/ui/Toggle";
import TagSelector from "@/components/ui/TagSelector";
import { useToast } from "@/hooks/useToast";
import {
  ArrowLeftIcon,
  TagIcon,
  UserCircleIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useFormBuilder, setUseFormBuilder] = useState(false);
  const { error, promise } = useToast();

  // Traditional form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
    featured: false,
    tags: [] as string[]
  });



  const availableTags = [
    'JavaScript', 'React', 'Next.js', 'TypeScript', 'Tutorial', 'Tips',
    'CSS', 'HTML', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
    'Docker', 'AWS', 'GraphQL', 'REST API', 'Testing', 'DevOps'
  ];

  const handleTraditionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitPromise = fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      promise(submitPromise, {
        loading: "Creando post...",
        success: "Post creado exitosamente",
        error: "Error al crear el post",
      });

      const response = await submitPromise;
      if (response.ok) {
        setTimeout(() => router.push("/admin/dashboard/posts"), 1000);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      error("Error al crear el post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormBuilderSubmit = async (data: any) => {
    setIsSubmitting(true);

    const postData = {
      title: data.title as string,
      content: data.description as string,
      published: data.actions?.status?.value === 'published',
      featured: data.actions?.type?.value === 'featured',
      tags: data.actions?.tags?.value ? [data.actions.tags.value] : []
    };

    try {
      const submitPromise = fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      promise(submitPromise, {
        loading: "Creando post con FormBuilder...",
        success: "Post creado exitosamente",
        error: "Error al crear el post",
      });

      const response = await submitPromise;
      if (response.ok) {
        setTimeout(() => router.push("/admin/dashboard/posts"), 1000);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      error("Error al crear el post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: generateSlug(newTitle)
    }));
  };

  if (useFormBuilder) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard/posts">
                <Button variant="ghost" icon={<ArrowLeftIcon className="h-4 w-4" />}>
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Nuevo Post
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Crea un nuevo post para tu blog
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setUseFormBuilder(false)}
            >
              Formulario Tradicional
            </Button>
          </div>
        </div>

        {/* Advanced Form Builder */}
        <FormBuilder
          titlePlaceholder="Título del post"
          descriptionPlaceholder="Escribe el contenido de tu post..."
          onSubmit={handleFormBuilderSubmit}
          submitLabel="Publicar Post"
          actions={[
            {
              label: "Estado",
              icon: <CalendarIcon className="h-4 w-4" />,
              options: [
                { label: 'Borrador', value: 'draft' },
                { label: 'Publicado', value: 'published' }
              ]
            },
            {
              label: "Tipo",
              icon: <UserCircleIcon className="h-4 w-4" />,
              options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Destacado', value: 'featured' }
              ]
            },
            {
              label: "Tag",
              icon: <TagIcon className="h-4 w-4" />,
              options: availableTags.map(tag => ({ label: tag, value: tag }))
            }
          ]}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard/posts">
              <Button variant="ghost" icon={<ArrowLeftIcon className="h-4 w-4" />}>
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nuevo Post
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Crea un nuevo post para tu blog
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setUseFormBuilder(true)}
          >
            Form Builder
          </Button>
        </div>
      </div>

      {/* Traditional Form */}
      <form onSubmit={handleTraditionalSubmit} className="space-y-6">
        <div className="bg-white/80 dark:bg-gray-800/50 rounded-lg p-6 shadow ring-1 ring-inset ring-gray-200 dark:ring-white/10 backdrop-blur-sm">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Información Básica
          </h2>

          <div className="space-y-4">
            <Input
              label="Título"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Título del post"
              required
            />

            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="url-amigable-del-post"
              helperText="Se generará automáticamente desde el título"
            />

            <Textarea
              label="Extracto"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Un resumen breve del post..."
              rows={3}
              helperText="Descripción corta que aparecerá en la lista de posts"
            />

            <Textarea
              label="Contenido"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Escribe el contenido completo del post..."
              rows={10}
              required
            />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/50 rounded-lg p-6 shadow ring-1 ring-inset ring-gray-200 dark:ring-white/10 backdrop-blur-sm">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Configuración
          </h2>

          <div className="space-y-6">
            {/* Tags Selector */}
            <TagSelector
              tags={formData.tags}
              onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
              availableTags={availableTags}
              maxTags={5}
              label="Tags del Post"
            />

            {/* Status Toggles */}
            <div className="space-y-4">
              <Toggle
                checked={formData.published}
                onChange={(value) => setFormData(prev => ({ ...prev, published: value }))}
                label="Publicar Post"
                description="El post será visible públicamente en el blog"
                color="green"
              />

              <Toggle
                checked={formData.featured}
                onChange={(value) => setFormData(prev => ({ ...prev, featured: value }))}
                label="Post Destacado"
                description="El post aparecerá en la sección de posts destacados"
                color="blue"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link href="/admin/dashboard/posts">
            <Button variant="ghost">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={!formData.title || !formData.content}
          >
            Crear Post
          </Button>
        </div>
      </form>
    </div>
  );
}