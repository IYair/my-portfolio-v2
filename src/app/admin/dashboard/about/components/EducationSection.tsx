"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { AcademicCapIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Education {
  id: number;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  order: number;
}

interface EducationFormData {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  order: number;
}

export default function EducationSection() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState<EducationFormData>({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    order: 0,
  });

  useEffect(() => {
    loadEducations();
  }, []);

  const loadEducations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/about/education");
      if (response.ok) {
        const data = await response.json();
        setEducations(data);
      }
    } catch (error) {
      console.error("Error loading educations:", error);
      toast.error("Error al cargar la educación");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingEducation
        ? `/api/admin/about/education/${editingEducation.id}`
        : "/api/admin/about/education";

      const method = editingEducation ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingEducation ? "Educación actualizada" : "Educación creada");
        loadEducations();
        resetForm();
      } else {
        toast.error("Error al guardar la educación");
      }
    } catch (error) {
      console.error("Error saving education:", error);
      toast.error("Error al guardar la educación");
    }
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setFormData({
      institution: education.institution,
      degree: education.degree,
      field: education.field || "",
      startDate: education.startDate || "",
      endDate: education.endDate || "",
      order: education.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta educación?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/about/education/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Educación eliminada");
        loadEducations();
      } else {
        toast.error("Error al eliminar la educación");
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Error al eliminar la educación");
    }
  };

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      order: 0,
    });
    setEditingEducation(null);
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
          <AcademicCapIcon className="h-6 w-6 text-[var(--foreground)]" />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Formación Académica</h2>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Agregar Educación
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
            {editingEducation ? "Editar Educación" : "Nueva Educación"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Institución
              </label>
              <Input
                value={formData.institution}
                onChange={e => setFormData({ ...formData, institution: e.target.value })}
                placeholder="ej: Universidad Autónoma de Campeche"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Título/Grado
                </label>
                <Input
                  value={formData.degree}
                  onChange={e => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="ej: Ingeniería"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Campo/Especialidad
                </label>
                <Input
                  value={formData.field}
                  onChange={e => setFormData({ ...formData, field: e.target.value })}
                  placeholder="ej: Tecnología de Software"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Fecha de Inicio
                </label>
                <Input
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  placeholder="ej: 2018"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Fecha de Fin
                </label>
                <Input
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  placeholder="ej: 2022 o En curso"
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
              <Button type="submit">{editingEducation ? "Actualizar" : "Crear"}</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {educations.map(education => (
          <Card key={education.id} className="p-6">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {education.institution}
                </h3>
                <p className="font-medium text-red-600 dark:text-red-400">
                  {education.degree}
                  {education.field && ` en ${education.field}`}
                </p>
                {(education.startDate || education.endDate) && (
                  <p className="text-sm text-[var(--foreground)] opacity-70">
                    {education.startDate} - {education.endDate}
                  </p>
                )}
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(education)}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(education.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-[var(--foreground)] opacity-70">Orden: {education.order}</p>
          </Card>
        ))}
      </div>

      {educations.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-[var(--foreground)] opacity-70">No hay educación agregada</p>
        </div>
      )}
    </div>
  );
}
