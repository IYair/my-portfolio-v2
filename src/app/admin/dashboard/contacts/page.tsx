"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Table, { Column } from "@/components/ui/Table";
import {
  TrashIcon,
  EyeIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Modal from "@/components/ui/Modal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useToast } from "@/hooks/useToast";
import apiClient from "@/lib/api-client";

interface Contact extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function ContactsPage() {
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; contact: Contact | null }>({
    open: false,
    contact: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;
  const { success, error } = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiClient.get<Contact[]>("/api/contacts");
        setAllContacts(res.data);
      } catch (err) {
        console.error("Error fetching contacts:", err);
        error("Error", "No se pudieron cargar los mensajes de contacto");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Update paginated data when page or contacts change
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setContacts(allContacts.slice(startIndex, endIndex));
  }, [allContacts, currentPage, itemsPerPage]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiClient.patch(`/api/contacts/${id}`, { read: true });
      setAllContacts(prev =>
        prev.map(contact => (contact.id === id ? { ...contact, read: true } : contact))
      );
    } catch (err) {
      console.error("Error marking contact as read:", err);
      error("Error", "No se pudo marcar el mensaje como leído");
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setDeleteModal({ open: true, contact });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.contact) return;

    setIsDeleting(true);
    const contactName = deleteModal.contact.name;
    const contactId = deleteModal.contact.id;
    try {
      await apiClient.delete(`/api/contacts/${contactId}`);
      const updatedContacts = allContacts.filter(c => c.id !== contactId);
      setAllContacts(updatedContacts);
      setDeleteModal({ open: false, contact: null });
      success("Mensaje eliminado", `El mensaje de "${contactName}" ha sido eliminado`);

      const totalPages = Math.ceil(updatedContacts.length / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "No se pudo eliminar el mensaje.";
      error("Error al eliminar", message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, contact: null });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<Contact>[] = [
    {
      key: "name",
      header: "Contacto",
      render: contact => (
        <div>
          <div className="flex items-center font-medium text-gray-900 dark:text-white">
            {contact.name}
            {!contact.read && (
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Nuevo
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Asunto",
      render: contact => (
        <div className="max-w-xs">
          <p className="truncate font-medium text-gray-900 dark:text-white">
            {contact.subject || "Sin asunto"}
          </p>
        </div>
      ),
    },
    {
      key: "message",
      header: "Mensaje",
      render: contact => (
        <div className="max-w-md">
          <p className="truncate text-sm text-gray-600 dark:text-gray-300">{contact.message}</p>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Fecha",
      render: contact => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(contact.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: contact => (
        <div className="flex gap-2">
          <a
            href={`mailto:${contact.email}?subject=Re: ${contact.subject || "Tu consulta"}`}
            className="inline-flex"
          >
            <Button variant="ghost" size="sm" icon={<EnvelopeIcon className="h-4 w-4" />}>
              Responder
            </Button>
          </a>
          {!contact.read && (
            <Button
              variant="ghost"
              size="sm"
              icon={<EyeIcon className="h-4 w-4" />}
              onClick={() => handleMarkAsRead(contact.id)}
            >
              Marcar leído
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            icon={<TrashIcon className="h-4 w-4" />}
            onClick={() => handleDeleteClick(contact)}
          >
            Eliminar
          </Button>
        </div>
      ),
      headerClassName: "text-right pr-4 sm:pr-0",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const unreadCount = allContacts.filter(contact => !contact.read).length;
  const totalPages = Math.ceil(allContacts.length / itemsPerPage);

  const breadcrumbs = [{ name: "Contactos", current: true }];

  return (
    <div className="space-y-6">
      <Breadcrumbs pages={breadcrumbs} homeHref="/admin/dashboard" />
      <Table
        data={contacts}
        columns={columns}
        title="Mensajes de Contacto"
        description={`Gestiona todos los mensajes recibidos a través del formulario de contacto. ${unreadCount > 0 ? `Tienes ${unreadCount} mensajes sin leer.` : "Todos los mensajes han sido leídos."}`}
        emptyMessage="No has recibido mensajes aún"
        pagination={
          allContacts.length >= 1
            ? {
                currentPage,
                totalPages,
                totalItems: allContacts.length,
                onPageChange: handlePageChange,
              }
            : undefined
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModal.open}
        onClose={handleDeleteCancel}
        title="Eliminar Mensaje"
        description={`¿Estás seguro de que quieres eliminar el mensaje de "${deleteModal.contact?.name}"? Esta acción no se puede deshacer.`}
        icon={<ExclamationTriangleIcon />}
        iconColor="red"
        primaryAction={{
          label: "Eliminar",
          onClick: handleDeleteConfirm,
          variant: "danger",
          loading: isDeleting,
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: handleDeleteCancel,
        }}
      />
    </div>
  );
}
