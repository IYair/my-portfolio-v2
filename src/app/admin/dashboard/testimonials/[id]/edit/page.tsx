"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ImageUpload from "@/components/ui/ImageUpload";

interface TestimonialFormData {
  content: string;
  contentEn: string;
  author: string;
  handle: string;
  image: string;
  published: boolean;
  featured: boolean;
  order: number;
}

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<TestimonialFormData>({
    content: "",
    contentEn: "",
    author: "",
    handle: "",
    image: "",
    published: false,
    featured: false,
    order: 0,
  });

  useEffect(() => {
    fetchTestimonial();
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          content: data.content || "",
          contentEn: data.contentEn || "",
          author: data.author || "",
          handle: data.handle || "",
          image: data.image || "",
          published: data.published || false,
          featured: data.featured || false,
          order: data.order || 0,
        });
      } else {
        setError("Error al cargar el testimonio");
      }
    } catch (err) {
      setError("Error al cargar el testimonio");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/dashboard/testimonials");
      } else {
        const data = await response.json();
        setError(data.error || "Error al guardar el testimonio");
      }
    } catch (err) {
      setError("Error al guardar el testimonio");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        href="/admin/dashboard/testimonials"
        className="mb-6 inline-flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" />
        Volver a testimonios
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar Testimonio</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Edita el contenido y configuración del testimonio
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Autor */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">Información del Autor</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="author" className="mb-2 block font-medium">
                Nombre del Autor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label htmlFor="handle" className="mb-2 block font-medium">
                Handle/Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="handle"
                value={formData.handle}
                onChange={e => setFormData({ ...formData, handle: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">Imagen de Perfil</label>
              <ImageUpload
                value={formData.image}
                onChange={url => setFormData({ ...formData, image: url })}
                placeholder="Sube la imagen de perfil"
                maxSize={5}
                width={200}
                height={200}
              />
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">Contenido</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="content" className="mb-2 block font-medium">
                Testimonio (Español) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                rows={6}
                required
              />
            </div>

            <div>
              <label htmlFor="contentEn" className="mb-2 block font-medium">
                Testimonio (Inglés)
              </label>
              <textarea
                id="contentEn"
                value={formData.contentEn}
                onChange={e => setFormData({ ...formData, contentEn: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Configuración */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">Configuración</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              <label htmlFor="published" className="ml-2 font-medium">
                Publicado
              </label>
              <p className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                El testimonio será visible en el sitio web
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              <label htmlFor="featured" className="ml-2 font-medium">
                Destacado
              </label>
              <p className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                Se mostrará como testimonio principal
              </p>
            </div>

            <div>
              <label htmlFor="order" className="mb-2 block font-medium">
                Orden
              </label>
              <input
                type="number"
                id="order"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-32 rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Los testimonios se ordenan ascendentemente por este valor
              </p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
          <Link
            href="/admin/dashboard/testimonials"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
