"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Table, { Column } from "@/components/ui/Table";
import { TrashIcon, EyeIcon, EnvelopeIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/ui/Modal";

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
    contact: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contacts");
        if (response.ok) {
          const data = await response.json();
          
          // Si no hay contactos, agregar datos de prueba
          if (data.length === 0) {
            const mockContacts = [
              {
                id: 1,
                name: 'Juan Pérez',
                email: 'juan@example.com',
                subject: 'Consulta sobre servicios',
                message: 'Hola, me interesa conocer más sobre sus servicios de desarrollo web.',
                read: false,
                createdAt: new Date().toISOString()
              }
            ];
            setAllContacts(mockContacts);
          } else {
            setAllContacts(data);
          }
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        // En caso de error, mostrar datos de prueba
        const mockContacts = [
          {
            id: 1,
            name: 'Juan Pérez',
            email: 'juan@example.com',
            subject: 'Consulta sobre servicios',
            message: 'Hola, me interesa conocer más sobre sus servicios de desarrollo web.',
            read: false,
            createdAt: new Date().toISOString()
          }
        ];
        setAllContacts(mockContacts);
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
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setAllContacts(allContacts.map(contact =>
          contact.id === id ? { ...contact, read: true } : contact
        ));
      }
    } catch (error) {
      console.error("Error marking contact as read:", error);
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setDeleteModal({ open: true, contact });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.contact) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contacts/${deleteModal.contact.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedContacts = allContacts.filter(contact => contact.id !== deleteModal.contact!.id);
        setAllContacts(updatedContacts);
        setDeleteModal({ open: false, contact: null });
        
        // Ajustar página si es necesario
        const totalPages = Math.ceil(updatedContacts.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      } else {
        alert("Error al eliminar el mensaje");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Error al eliminar el mensaje");
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
      key: 'name',
      header: 'Contacto',
      render: (contact) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white flex items-center">
            {contact.name}
            {!contact.read && (
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Nuevo
              </span>
            )}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            {contact.email}
          </div>
        </div>
      )
    },
    {
      key: 'subject',
      header: 'Asunto',
      render: (contact) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {contact.subject || 'Sin asunto'}
          </p>
        </div>
      )
    },
    {
      key: 'message',
      header: 'Mensaje',
      render: (contact) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {contact.message}
          </p>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      render: (contact) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(contact.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (contact) => (
        <div className="flex gap-2">
          <a
            href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Tu consulta'}`}
            className="inline-flex"
          >
            <Button
              variant="ghost"
              size="sm"
              icon={<EnvelopeIcon className="h-4 w-4" />}
            >
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
      headerClassName: 'text-right pr-4 sm:pr-0'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const unreadCount = allContacts.filter(contact => !contact.read).length;
  const totalPages = Math.ceil(allContacts.length / itemsPerPage);

  return (
    <>
      <Table
        data={contacts}
        columns={columns}
        title="Mensajes de Contacto"
        description={`Gestiona todos los mensajes recibidos a través del formulario de contacto. ${unreadCount > 0 ? `Tienes ${unreadCount} mensajes sin leer.` : 'Todos los mensajes han sido leídos.'}`}
        emptyMessage="No has recibido mensajes aún"
        pagination={allContacts.length >= 1 ? {
          currentPage,
          totalPages,
          totalItems: allContacts.length,
          onPageChange: handlePageChange
        } : undefined}
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
          loading: isDeleting
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: handleDeleteCancel
        }}
      />
    </>
  );
}