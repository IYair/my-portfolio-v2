"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "@formkit/tempo";
import {
  PlusIcon,
  PaperAirplaneIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

interface Invite {
  id: number;
  code: string;
  email: string;
  name: string | null;
  sent: boolean;
  used: boolean;
  usedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export default function TestimonialInvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    sendEmail: true,
  });

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const response = await fetch("/api/admin/testimonial-invites");
      if (response.ok) {
        const data = await response.json();
        setInvites(data);
      }
    } catch (err) {
      console.error("Error fetching invites:", err);
    } finally {
      setLoading(false);
    }
  };

  const createInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/testimonial-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          formData.sendEmail
            ? `Invitación enviada a ${formData.email}`
            : "Invitación creada exitosamente"
        );
        setFormData({ email: "", name: "", sendEmail: true });
        setShowForm(false);
        fetchInvites();

        // Copiar link automáticamente
        if (data.link) {
          await navigator.clipboard.writeText(data.link);
          setCopiedCode(data.code);
          setTimeout(() => setCopiedCode(null), 3000);
        }
      } else {
        setError(data.error || "Error al crear invitación");
      }
    } catch (err) {
      setError("Error al crear invitación");
    } finally {
      setCreating(false);
    }
  };

  const copyLink = async (code: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const link = `${siteUrl}/es/testimonial?code=${code}`;
    await navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Invitaciones de Testimonios</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  const pendingInvites = invites.filter((i) => !i.used && !i.sent);
  const sentInvites = invites.filter((i) => !i.used && i.sent);
  const usedInvites = invites.filter((i) => i.used);

  return (
    <div className="p-8">
      <Link
        href="/admin/dashboard/testimonials"
        className="mb-6 inline-flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" />
        Volver a testimonios
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invitaciones de Testimonios</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gestiona las invitaciones para recibir testimonios
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Nueva Invitación
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircleIcon className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <XCircleIcon className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Formulario de nueva invitación */}
      {showForm && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Nueva Invitación</h2>
            <button
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={createInvite} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700"
                placeholder="ejemplo@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="mb-2 block font-medium">
                Nombre (opcional)
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Juan Pérez"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendEmail"
                checked={formData.sendEmail}
                onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              <label htmlFor="sendEmail" className="ml-2 font-medium">
                Enviar email automáticamente
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? "Creando..." : "Crear Invitación"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invitaciones Pendientes de Envío */}
      {pendingInvites.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">
            Pendientes de Envío ({pendingInvites.length})
          </h2>
          <div className="space-y-4">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold">{invite.email}</p>
                      {invite.name && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{invite.name}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 font-mono text-sm text-gray-600 dark:text-gray-400">
                    Código: {invite.code}
                  </p>
                  <p className="text-xs text-gray-500">
                    Creado: {format(new Date(invite.createdAt), "DD/MM/YYYY HH:mm")}
                  </p>
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => copyLink(invite.code)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    title="Copiar enlace"
                  >
                    {copiedCode === invite.code ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="h-5 w-5" />
                        Copiar Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invitaciones Enviadas */}
      {sentInvites.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">
            Enviadas - Esperando Respuesta ({sentInvites.length})
          </h2>
          <div className="space-y-4">
            {sentInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <PaperAirplaneIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-semibold">{invite.email}</p>
                      {invite.name && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{invite.name}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 font-mono text-sm text-gray-600 dark:text-gray-400">
                    Código: {invite.code}
                  </p>
                  <p className="text-xs text-gray-500">
                    Enviado: {format(new Date(invite.createdAt), "DD/MM/YYYY HH:mm")}
                  </p>
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => copyLink(invite.code)}
                    className="rounded-lg bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    title="Copiar enlace"
                  >
                    {copiedCode === invite.code ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <ClipboardDocumentIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invitaciones Usadas */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Completadas ({usedInvites.length})
        </h2>
        {usedInvites.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              No hay invitaciones completadas aún
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {usedInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold">{invite.email}</p>
                      {invite.name && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{invite.name}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 font-mono text-sm text-gray-600 dark:text-gray-400">
                    Código: {invite.code}
                  </p>
                  <p className="text-xs text-gray-500">
                    Usado: {invite.usedAt && format(new Date(invite.usedAt), "DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
