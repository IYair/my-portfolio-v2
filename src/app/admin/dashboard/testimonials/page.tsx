"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "@formkit/tempo";
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface Testimonial {
  id: number;
  content: string;
  contentEn: string | null;
  author: string;
  handle: string;
  image: string;
  published: boolean;
  featured: boolean;
  order: number;
  code: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials");
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      } else {
        setError("Error al cargar testimonios");
      }
    } catch (err) {
      setError("Error al cargar testimonios");
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: number, currentStatus: boolean) => {
    try {
      const testimonial = testimonials.find((t) => t.id === id);
      if (!testimonial) return;

      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...testimonial,
          published: !currentStatus,
        }),
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error("Error toggling published:", err);
    }
  };

  const toggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      const testimonial = testimonials.find((t) => t.id === id);
      if (!testimonial) return;

      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...testimonial,
          featured: !currentStatus,
        }),
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error("Error toggling featured:", err);
    }
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este testimonio?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error("Error deleting testimonial:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Testimonios</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  const publishedTestimonials = testimonials.filter((t) => t.published);
  const pendingTestimonials = testimonials.filter((t) => !t.published);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonios</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gestiona los testimonios de tu portfolio
          </p>
        </div>
        <Link
          href="/admin/dashboard/testimonials/invites"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Gestionar Invitaciones
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Testimonios Pendientes */}
      {pendingTestimonials.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">
            Pendientes de Aprobación ({pendingTestimonials.length})
          </h2>
          <div className="space-y-4">
            {pendingTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{testimonial.author}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.handle}
                        </p>
                      </div>
                    </div>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                      {testimonial.content}
                    </p>
                    <p className="text-sm text-gray-500">
                      Recibido: {format(new Date(testimonial.createdAt), "DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => togglePublished(testimonial.id, testimonial.published)}
                      className="rounded-lg bg-green-600 p-2 text-white transition-colors hover:bg-green-700"
                      title="Publicar"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                    <Link
                      href={`/admin/dashboard/testimonials/${testimonial.id}/edit`}
                      className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                      title="Editar"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="rounded-lg bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonios Publicados */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Publicados ({publishedTestimonials.length})
        </h2>
        {publishedTestimonials.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              No hay testimonios publicados aún
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {publishedTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{testimonial.author}</h3>
                          {testimonial.featured && (
                            <StarIconSolid className="h-5 w-5 text-yellow-500" title="Destacado" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.handle}
                        </p>
                      </div>
                    </div>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                      {testimonial.content}
                    </p>
                    {testimonial.contentEn && (
                      <p className="mb-2 text-sm italic text-gray-600 dark:text-gray-400">
                        EN: {testimonial.contentEn}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => toggleFeatured(testimonial.id, testimonial.featured)}
                      className={`rounded-lg p-2 transition-colors ${
                        testimonial.featured
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
                      title={testimonial.featured ? "Quitar destacado" : "Marcar como destacado"}
                    >
                      <StarIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => togglePublished(testimonial.id, testimonial.published)}
                      className="rounded-lg bg-orange-600 p-2 text-white transition-colors hover:bg-orange-700"
                      title="Ocultar"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                    <Link
                      href={`/admin/dashboard/testimonials/${testimonial.id}/edit`}
                      className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                      title="Editar"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="rounded-lg bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
