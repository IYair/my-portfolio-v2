"use client";

import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { PencilIcon, PlusIcon, RocketLaunchIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ContactInfo {
  id: number;
  type: string;
  value: string;
  icon?: string;
  isHeroicon: boolean;
  order: number;
}

interface ContactFormData {
  type: string;
  value: string;
  icon: string;
  isHeroicon: boolean;
  order: number;
}

const contactTypes = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Teléfono" },
  { value: "location", label: "Ubicación" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "website", label: "Sitio Web" },
];

export default function ContactInfoSection() {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    type: "",
    value: "",
    icon: "",
    isHeroicon: false,
    order: 0,
  });

  useEffect(() => {
    loadContactInfos();
  }, []);

  const loadContactInfos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/about/contact-info");
      if (response.ok) {
        const data = await response.json();
        setContactInfos(data);
      }
    } catch (error) {
      console.error("Error loading contact info:", error);
      toast.error("Error al cargar la información de contacto");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingContact
        ? `/api/admin/about/contact-info/${editingContact.id}`
        : "/api/admin/about/contact-info";

      const method = editingContact ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingContact ? "Contacto actualizado" : "Contacto creado");
        loadContactInfos();
        resetForm();
      } else {
        toast.error("Error al guardar el contacto");
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Error al guardar el contacto");
    }
  };

  const handleEdit = (contact: ContactInfo) => {
    setEditingContact(contact);
    setFormData({
      type: contact.type,
      value: contact.value,
      icon: contact.icon || "",
      isHeroicon: contact.isHeroicon,
      order: contact.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este contacto?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/about/contact-info/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Contacto eliminado");
        loadContactInfos();
      } else {
        toast.error("Error al eliminar el contacto");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Error al eliminar el contacto");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      value: "",
      icon: "",
      isHeroicon: false,
      order: 0,
    });
    setEditingContact(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--foreground)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RocketLaunchIcon className="h-6 w-6 text-[var(--foreground)]" />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Información de Contacto</h2>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Agregar Contacto
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
            {editingContact ? "Editar Contacto" : "Nuevo Contacto"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Tipo
                </label>
                <Select
                  value={formData.type}
                  onChange={value => setFormData({ ...formData, type: value as string })}
                  options={[{ value: "", label: "Seleccionar tipo" }, ...contactTypes]}
                  placeholder="Seleccionar tipo"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Valor
                </label>
                <Input
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                  placeholder="ej: ejemplo@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  URL del Icono
                </label>
                <Input
                  value={formData.icon}
                  onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="ej: /icons/email.svg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Es Heroicon
                </label>
                <Select
                  value={formData.isHeroicon.toString()}
                  onChange={value => setFormData({ ...formData, isHeroicon: value === "true" })}
                  options={[
                    { value: "false", label: "No" },
                    { value: "true", label: "Sí" },
                  ]}
                  placeholder="Seleccionar opción"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Orden
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">{editingContact ? "Actualizar" : "Crear"}</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {contactInfos.map(contact => (
          <Card key={contact.id} className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {contact.icon && !contact.isHeroicon && (
                  <Image
                    src={contact.icon}
                    alt={contact.type}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                )}
                <div>
                  <h3 className="font-medium text-[var(--foreground)] capitalize">
                    {contact.type}
                  </h3>
                  <p className="text-sm text-[var(--foreground)] opacity-80">{contact.value}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(contact)}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between text-sm text-[var(--foreground)] opacity-70">
              <span>Orden: {contact.order}</span>
              <span>{contact.isHeroicon ? "Heroicon" : "Icono personalizado"}</span>
            </div>
          </Card>
        ))}
      </div>

      {contactInfos.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-[var(--foreground)] opacity-70">
            No hay información de contacto agregada
          </p>
        </div>
      )}
    </div>
  );
}
