"use client";

import { useEffect, useState } from "react";
import useAdminStore, { type Post } from "@/stores/adminStore";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Table, { Column } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Badge, { BadgeGroup } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Tooltip } from "@/components/ui/Tooltip";
import { Alert } from "@/components/ui/Alert";
import { useToast } from "@/hooks/useToast";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

// Using Post interface from the store

export default function PostsPage() {
  // Use Zustand store instead of local state
  const { posts, postsLoading: isLoading, fetchPosts } = useAdminStore();
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; post: Post | null }>({
    open: false,
    post: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const { success, error } = useToast();

  useEffect(() => {
    // Use Zustand store action to fetch posts
    fetchPosts();
  }, [fetchPosts]);

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
        // Refetch posts after deletion
        fetchPosts();
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
        <div className="flex gap-1">
          <Tooltip content="Preview post">
            <Button
              variant="ghost"
              size="sm"
              icon={<EyeIcon className="h-4 w-4" />}
            />
          </Tooltip>
          <Tooltip content="Edit post">
            <Link href={`/admin/dashboard/posts/${post.id}/edit`}>
              <Button
                variant="ghost"
                size="sm"
                icon={<PencilIcon className="h-4 w-4" />}
              />
            </Link>
          </Tooltip>
          <Tooltip content="Delete post (cannot be undone)">
            <Button
              variant="danger"
              size="sm"
              icon={<TrashIcon className="h-4 w-4" />}
              onClick={() => handleDeleteClick(post)}
            />
          </Tooltip>
        </div>
      ),
      headerClassName: 'text-right pr-4 sm:pr-0'
    }
  ];

  const breadcrumbs = [
    { name: "Posts", current: true }
  ];

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
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        pages={breadcrumbs}
        homeHref="/admin/dashboard"
      />

      {/* Success Alert - Shown when posts are loaded */}
      {!isLoading && posts.length > 0 && (
        <Alert
          variant="success"
          title="Posts loaded successfully"
          description={`Found ${posts.length} posts in your database.`}
          dismissible
          onDismiss={() => {}}
        />
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 w-32 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-gray-700/50 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-28 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
          <SkeletonTable rows={5} columns={5} />
        </div>
      ) : (
        <>
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

          {/* Table or Empty State */}
          {filteredPosts.length > 0 ? (
            <Table<Post>
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
            />
          ) : (
            <Alert
              variant="info"
              title="No posts found"
              description={
                posts.length === 0
                  ? "You haven't created any posts yet. Start by creating your first post."
                  : "No posts match the selected filters. Try adjusting your search criteria."
              }
              actions={[
                {
                  label: "Create Post",
                  onClick: () => window.location.href = "/admin/dashboard/posts/new"
                }
              ]}
            />
          )}
        </>
      )}

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