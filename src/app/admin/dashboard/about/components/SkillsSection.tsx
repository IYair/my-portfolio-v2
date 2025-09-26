"use client";

import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { PencilIcon, PlusIcon, TrashIcon, TrophyIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Skill {
  id: number;
  name: string;
  icon: string;
  category?: string;
  order: number;
}

interface SkillFormData {
  name: string;
  icon: string;
  category: string;
  order: number;
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    icon: "",
    category: "",
    order: 0,
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/about/skills");
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error("Error loading skills:", error);
      toast.error("Error al cargar las habilidades");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSkill
        ? `/api/admin/about/skills/${editingSkill.id}`
        : "/api/admin/about/skills";

      const method = editingSkill ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingSkill ? "Habilidad actualizada" : "Habilidad creada");
        loadSkills();
        resetForm();
      } else {
        toast.error("Error al guardar la habilidad");
      }
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error("Error al guardar la habilidad");
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      icon: skill.icon,
      category: skill.category || "",
      order: skill.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta habilidad?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/about/skills/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Habilidad eliminada");
        loadSkills();
      } else {
        toast.error("Error al eliminar la habilidad");
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Error al eliminar la habilidad");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      icon: "",
      category: "",
      order: 0,
    });
    setEditingSkill(null);
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
          <TrophyIcon className="h-6 w-6 text-[var(--foreground)]" />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Habilidades Técnicas</h2>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Agregar Habilidad
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
            {editingSkill ? "Editar Habilidad" : "Nueva Habilidad"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Nombre
                </label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: React.js"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  URL del Icono
                </label>
                <Input
                  value={formData.icon}
                  onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="ej: /icons/react.svg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Categoría
                </label>
                <Input
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="ej: Frontend, Backend, Tools"
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
              <Button type="submit">{editingSkill ? "Actualizar" : "Crear"}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map(skill => (
          <Card key={skill.id} className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <div>
                  <h3 className="font-medium">{skill.name}</h3>
                  {skill.category && (
                    <p className="text-sm text-[var(--foreground)] opacity-70">{skill.category}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => handleEdit(skill)}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(skill.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-[var(--foreground)] opacity-70">Orden: {skill.order}</p>
          </Card>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-[var(--foreground)] opacity-70">No hay habilidades agregadas</p>
        </div>
      )}
    </div>
  );
}
