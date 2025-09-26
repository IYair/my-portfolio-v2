"use client";

import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { BookOpenIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Course {
  id: number;
  title: string;
  provider: string;
  providerIcon?: string;
  icon?: string;
  category?: string;
  order: number;
}

interface CourseFormData {
  title: string;
  provider: string;
  providerIcon: string;
  icon: string;
  category: string;
  order: number;
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    provider: "",
    providerIcon: "",
    icon: "",
    category: "",
    order: 0,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/about/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCourse
        ? `/api/admin/about/courses/${editingCourse.id}`
        : "/api/admin/about/courses";

      const method = editingCourse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingCourse ? "Curso actualizado" : "Curso creado");
        loadCourses();
        resetForm();
      } else {
        toast.error("Error al guardar el curso");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Error al guardar el curso");
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      provider: course.provider,
      providerIcon: course.providerIcon || "",
      icon: course.icon || "",
      category: course.category || "",
      order: course.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este curso?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/about/courses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Curso eliminado");
        loadCourses();
      } else {
        toast.error("Error al eliminar el curso");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error al eliminar el curso");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      provider: "",
      providerIcon: "",
      icon: "",
      category: "",
      order: 0,
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  // Group courses by provider
  const coursesByProvider = courses.reduce(
    (acc, course) => {
      if (!acc[course.provider]) {
        acc[course.provider] = [];
      }
      acc[course.provider].push(course);
      return acc;
    },
    {} as Record<string, Course[]>
  );

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
          <BookOpenIcon className="h-6 w-6 text-[var(--foreground)]" />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Cursos y Certificaciones</h2>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Agregar Curso
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
            {editingCourse ? "Editar Curso" : "Nuevo Curso"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Título del Curso
              </label>
              <Input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="ej: Curso profesional de React"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Proveedor
                </label>
                <Input
                  value={formData.provider}
                  onChange={e => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="ej: Platzi, Udemy, Coursera"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Icono del Proveedor
                </label>
                <Input
                  value={formData.providerIcon}
                  onChange={e => setFormData({ ...formData, providerIcon: e.target.value })}
                  placeholder="ej: /icons/platzi.svg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Icono del Curso
                </label>
                <Input
                  value={formData.icon}
                  onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="ej: /icons/react.svg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Categoría
                </label>
                <Input
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="ej: Frontend, Backend"
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
              <Button type="submit">{editingCourse ? "Actualizar" : "Crear"}</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(coursesByProvider).map(([provider, providerCourses]) => (
          <Card key={provider} className="p-6">
            <div className="mb-4 flex items-center space-x-2">
              {providerCourses[0]?.providerIcon && (
                <Image
                  src={providerCourses[0].providerIcon}
                  alt={provider}
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              )}
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{provider}</h3>
            </div>

            <div className="space-y-3">
              {providerCourses.map(course => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-2">
                    {course.icon && (
                      <Image
                        src={course.icon}
                        alt={course.title}
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
                      <p className="font-medium text-[var(--foreground)]">{course.title}</p>
                      {course.category && (
                        <p className="text-sm text-[var(--foreground)] opacity-70">
                          {course.category}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[var(--foreground)] opacity-70">
                      #{course.order}
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(course)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-[var(--foreground)] opacity-70">No hay cursos agregados</p>
        </div>
      )}
    </div>
  );
}
