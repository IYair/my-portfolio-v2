"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SafeImage from "@/components/ui/SafeImage";
import Table, { Column } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, ExclamationTriangleIcon, EllipsisVerticalIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Dropdown from "@/components/ui/Dropdown";
import Badge, { BadgeGroup } from "@/components/ui/Badge";

interface Project extends Record<string, unknown> {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  technologies: string[];
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          
          // Si no hay proyectos, agregar datos de prueba
          if (data.length === 0) {
            const mockProjects = [
              {
                id: 1,
                title: 'Portfolio Website v2',
                slug: 'portfolio-v2',
                description: 'Modern portfolio built with Next.js 15 and Tailwind CSS',
                image: '/images/portfolio-placeholder.jpg',
                demoUrl: 'https://portfolio-v2.example.com',
                githubUrl: 'https://github.com/user/portfolio-v2',
                technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
                featured: true,
                order: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            ];
            setAllProjects(mockProjects);
          } else {
            setAllProjects(data);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        // En caso de error, también mostrar datos de prueba
        const mockProjects = [
          {
            id: 1,
            title: 'Portfolio Website v2',
            slug: 'portfolio-v2',
            description: 'Modern portfolio built with Next.js 15 and Tailwind CSS',
            image: '/images/portfolio-placeholder.jpg',
            demoUrl: 'https://portfolio-v2.example.com',
            githubUrl: 'https://github.com/user/portfolio-v2',
            technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
            featured: true,
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setAllProjects(mockProjects);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Update paginated data when page or projects change
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setProjects(allProjects.slice(startIndex, endIndex));
  }, [allProjects, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (project: Project) => {
    setDeleteModal({ open: true, project });
  };

    const handleDeleteConfirm = async () => {
    if (!deleteModal.project) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${deleteModal.project.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedProjects = allProjects.filter(p => p.id !== deleteModal.project!.id);
        setAllProjects(updatedProjects);
        
        // If current page becomes empty and it's not the first page, go to previous page
        const totalPages = Math.ceil(updatedProjects.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        
        setDeleteModal({ open: false, project: null });
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, project: null });
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          featured: !project.featured,
        }),
      });

      if (response.ok) {
        setAllProjects(allProjects.map(p => 
          p.id === project.id ? { ...p, featured: !p.featured } : p
        ));
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };  const columns: Column<Project>[] = [
    {
      key: 'title',
      header: 'Proyecto',
      render: (project) => (
        <div className="flex items-center">
          <div className="h-11 w-11 flex-shrink-0">
            {project.image ? (
              <SafeImage
                className="h-11 w-11 rounded-lg object-cover"
                src={project.image}
                alt={project.title}
                width={44}
                height={44}
                fallback={
                  <div className="h-11 w-11 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 text-xl">📁</span>
                  </div>
                }
              />
            ) : (
              <div className="h-11 w-11 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-gray-400 text-xl">📁</span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900 dark:text-white">
              {project.title}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {project.slug}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (project) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {project.description || 'Sin descripción'}
          </p>
        </div>
      )
    },
    {
      key: 'technologies',
      header: 'Tecnologías',
      render: (project) => (
        <BadgeGroup>
          {project.technologies.slice(0, 3).map((tech, index) => (
            <Badge
              key={index}
              variant="blue"
              size="sm"
            >
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="gray" size="sm">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </BadgeGroup>
      )
    },
    {
      key: 'featured',
      header: 'Estado',
      render: (project) => (
        <BadgeGroup>
          {project.featured && (
            <Badge variant="yellow" icon={<StarIconSolid className="h-3 w-3" />}>
              Destacado
            </Badge>
          )}
          <Badge variant="gray" size="sm">
            #{project.order}
          </Badge>
        </BadgeGroup>
      )
    },
    {
      key: 'links',
      header: 'Enlaces',
      render: (project) => (
        <div className="flex gap-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <EyeIcon className="h-4 w-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (project) => (
        <div className="flex gap-2 relative">
          <Link href={`/admin/dashboard/projects/${project.id}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              icon={<PencilIcon className="h-4 w-4" />}
            >
              Editar
            </Button>
          </Link>

          <Dropdown
            label=""
            icon={<EllipsisVerticalIcon className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            options={[
              {
                label: project.featured ? 'Quitar de destacados' : 'Marcar como destacado',
                value: 'toggle-featured',
                icon: project.featured ? <StarIconSolid className="h-4 w-4" /> : <StarIcon className="h-4 w-4" />,
                onClick: () => handleToggleFeatured(project)
              },
              {
                label: 'Eliminar proyecto',
                value: 'delete',
                icon: <TrashIcon className="h-4 w-4" />,
                danger: true,
                onClick: () => handleDeleteClick(project)
              }
            ]}
          />
        </div>
      ),
      headerClassName: 'text-right pr-4 sm:pr-0',
      className: 'relative'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(allProjects.length / itemsPerPage);

  return (
    <>
      <Table
        data={projects}
        columns={columns}
        title="Proyectos del Portfolio"
        description="Gestiona todos los proyectos de tu portafolio, desde la información básica hasta los enlaces y tecnologías."
        headerActions={
          <Link href="/admin/dashboard/projects/new">
            <Button
              variant="primary"
              icon={<PlusIcon className="h-5 w-5" />}
            >
              Nuevo Proyecto
            </Button>
          </Link>
        }
        emptyMessage="No tienes proyectos creados aún"
        pagination={allProjects.length >= 1 ? {
          currentPage,
          totalPages,
          totalItems: allProjects.length,
          onPageChange: handlePageChange
        } : undefined}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModal.open}
        onClose={handleDeleteCancel}
        title="Eliminar Proyecto"
        description={`¿Estás seguro de que quieres eliminar el proyecto "${deleteModal.project?.title}"? Esta acción no se puede deshacer.`}
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