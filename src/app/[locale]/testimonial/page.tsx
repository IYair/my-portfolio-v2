"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/routing";
import ImageUpload from "@/components/ui/ImageUpload";

export default function TestimonialFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code") || "";
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    content: "",
    contentEn: "",
    author: "",
    handle: "",
    image: "",
    code: codeFromUrl,
  });

  const submitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code) {
      setError("Por favor ingresa el código de acceso");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Primero validar el código
      const validateResponse = await fetch("/api/testimonials/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: formData.code }),
      });

      const validateData = await validateResponse.json();

      if (!validateData.valid) {
        setError(validateData.message || "Código inválido");
        setLoading(false);
        return;
      }

      // Si el código es válido, crear el testimonio
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Error al enviar testimonio");
      }
    } catch (err) {
      setError("Error al enviar testimonio");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-20">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mb-4 text-2xl font-bold">¡Testimonio Enviado!</h2>
          <p className="text-foreground/60 mb-8">
            Tu testimonio ha sido enviado exitosamente. Será revisado y publicado pronto.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Volver
        </Link>

        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Enviar Testimonio</h1>
          <p className="text-foreground/70 text-lg">
            Comparte tu experiencia trabajando conmigo
          </p>
        </div>

        <form onSubmit={submitTestimonial} className="space-y-6">
          <div className="rounded-2xl bg-background p-8 shadow-lg ring-1 ring-foreground/5">
            <div className="space-y-6">
              <div>
                <label htmlFor="author" className="mb-2 block font-semibold">
                  Tu Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div>
                <label htmlFor="handle" className="mb-2 block font-semibold">
                  Handle o Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="handle"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="@juanperez o CEO en Empresa"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="mb-2 block font-semibold">
                  Testimonio (Español) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  rows={6}
                  placeholder="Escribe tu testimonio aquí..."
                  required
                />
                <p className="text-foreground/60 mt-2 text-sm">
                  Mínimo 50 caracteres
                </p>
              </div>

              <div>
                <label htmlFor="contentEn" className="mb-2 block font-semibold">
                  Testimonio (Inglés) <span className="text-foreground/60">(Opcional)</span>
                </label>
                <textarea
                  id="contentEn"
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  rows={6}
                  placeholder="Write your testimonial here..."
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Foto de Perfil <span className="text-foreground/60">(Opcional)</span>
                </label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  placeholder="Sube tu foto de perfil"
                  maxSize={5}
                  width={150}
                  height={150}
                />
                <p className="text-foreground/60 mt-2 text-sm">
                  Si no subes una foto, usaremos una imagen por defecto
                </p>
              </div>

              {/* Código al final */}
              <div className="border-t border-foreground/10 pt-6">
                <label htmlFor="code" className="mb-2 block font-semibold">
                  Código de Acceso <span className="text-red-500">*</span>
                </label>
                <p className="text-foreground/60 mb-4 text-sm">
                  Ingresa el código que recibiste en tu invitación
                </p>
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 font-mono text-lg transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="ABC123XYZ"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || formData.content.length < 50}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar Testimonio"}
          </button>
        </form>
      </div>
    </div>
  );
}
