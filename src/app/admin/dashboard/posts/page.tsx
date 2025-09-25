"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Table, { Column } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import { PlusIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon, FunnelIcon } from "@heroicons/react/24/outline";
import Select from "@/components/ui/Select";
import Dropdown from "@/components/ui/Dropdown";
import Badge, { BadgeGroup } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  tags: { id: number; name: string }[];
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; post: Post | null }>({
    open: false,
    post: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const { success, error } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDeleteClick = (post: Post) => {
    setDeleteModal({ open: true, post });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.post) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${deleteModal.post.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== deleteModal.post!.id));
        setDeleteModal({ open: false, post: null });
        success("Post eliminado", `El post "${deleteModal.post.title}" ha sido eliminado exitosamente`);
      } else {
        error("Error al eliminar", "No se pudo eliminar el post. Inténtalo de nuevo.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      error("Error inesperado", "Ocurrió un error inesperado al eliminar el post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, post: null });
  };

  // Filter posts based on selected filters
  const filteredPosts = posts.filter(post => {
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'published' && post.published) ||
      (statusFilter === 'draft' && !post.published);

    const matchesFeatured = featuredFilter === 'all' ||
      (featuredFilter === 'featured' && post.featured) ||
      (featuredFilter === 'normal' && !post.featured);

    return matchesStatus && matchesFeatured;
  });

  const columns: Column<Post>[] = [
    {
      key: 'title',
      header: 'Título',
      render: (post) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {post.title}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            {post.slug}
          </div>
        </div>
      )
    },
    {
      key: 'published',
      header: 'Estado',
      render: (post) => (
        <BadgeGroup>
          <Badge
            variant={post.published ? 'green' : 'yellow'}
          >
            {post.published ? 'Publicado' : 'Borrador'}
          </Badge>
          {post.featured && (
            <Badge variant="blue">
              Destacado
            </Badge>
          )}
        </BadgeGroup>
      )
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (post) => (
        <BadgeGroup>
          {post.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag.id}
              variant="gray"
              size="sm"
            >
              {tag.name}
            </Badge>
          ))}
          {post.tags.length > 3 && (
            <Badge variant="gray" size="sm">
              +{post.tags.length - 3}
            </Badge>
          )}
        </BadgeGroup>
      )
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      render: (post) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(post.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (post) => (
        <div className="flex gap-2">
          <Link href={`/admin/dashboard/posts/${post.id}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              icon={<PencilIcon className="h-4 w-4" />}
            >
              Editar
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            icon={<TrashIcon className="h-4 w-4" />}
            onClick={() => handleDeleteClick(post)}
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

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'published', label: 'Publicados' },
    { value: 'draft', label: 'Borradores' }
  ];

  const featuredOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'featured', label: 'Destacados' },
    { value: 'normal', label: 'Normales' }
  ];

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as string)}
          placeholder="Filtrar por estado"
          className="w-full sm:w-48"
        />
        <Select
          options={featuredOptions}
          value={featuredFilter}
          onChange={(value) => setFeaturedFilter(value as string)}
          placeholder="Filtrar por tipo"
          className="w-full sm:w-48"
        />
        <div className="flex-1" />
        <div className="text-sm text-gray-500 dark:text-gray-400 self-center">
          Mostrando {filteredPosts.length} de {posts.length} posts
        </div>
      </div>

      <Table
        data={filteredPosts}
        columns={columns}
        title="Posts del Blog"
        description="Gestiona todos los posts de tu blog, desde borradores hasta publicaciones."
        headerActions={
          <Link href="/admin/dashboard/posts/new">
            <Button
              variant="primary"
              icon={<PlusIcon className="h-5 w-5" />}
            >
              Nuevo Post
            </Button>
          </Link>
        }
        emptyMessage={
          posts.length === 0
            ? "No tienes posts creados aún"
            : "No se encontraron posts con los filtros seleccionados"
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModal.open}
        onClose={handleDeleteCancel}
        title="Eliminar Post"
        description={`¿Estás seguro de que quieres eliminar el post "${deleteModal.post?.title}"? Esta acción no se puede deshacer.`}
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
    </div>
  );
}