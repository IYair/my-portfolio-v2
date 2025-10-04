"use client";

import { useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className = "" }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      await response.json();

      setSubmitStatus({
        type: "success",
        message: "¡Mensaje enviado exitosamente! Te responderé pronto.",
      });

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Error al enviar el mensaje. Inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`mx-auto max-w-2xl ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border-foreground/20 bg-background w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border-foreground/20 bg-background w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-medium">
            Asunto
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="border-foreground/20 bg-background w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            placeholder="¿En qué te puedo ayudar?"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium">
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="border-foreground/20 bg-background w-full resize-none rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe tu mensaje aquí..."
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg px-6 py-3 font-medium transition-colors ${
              isSubmitting
                ? "bg-foreground/50 cursor-not-allowed"
                : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
          </button>
        </div>

        {/* Status Message */}
        {submitStatus.type && (
          <div
            className={`rounded-lg p-4 ${
              submitStatus.type === "success"
                ? "border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
  );
}
