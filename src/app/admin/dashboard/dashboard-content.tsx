"use client";

import Stats, { StatItem } from "@/components/ui/Stats";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { LoadingOverlay } from "@/components/ui/Loading";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Alert } from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import useAdminStore from "@/stores/adminStore";
import {
  DocumentTextIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

// Types from the Zustand store (these types should match the store types)

interface RecentActivity {
  id: string;
  type: 'post' | 'project' | 'contact';
  title: string;
  action: string;
  timestamp: string;
  status?: string;
}

interface PostActivityData {
  id: string | number;
  title: string;
  published: boolean;
  createdAt: string;
}

interface ProjectActivityData {
  id: string | number;
  title: string;
  featured: boolean;
  createdAt: string;
}

interface ContactActivityData {
  id: string | number;
  name: string;
  read: boolean;
  createdAt: string;
}

export default function DashboardContent() {
  console.log('🏗️ DashboardContent component mounted/re-rendered')
  console.trace('DashboardContent mount stack trace')

  const {
    dashboardData: data,
    dashboardLoading: loading,
    dashboardError: error,
    fetchDashboardData: refetch
  } = useAdminStore();

  const breadcrumbs = [
    { name: "Dashboard", current: true }
  ]

  // Prepare stats data for the Stats component
  const stats = data?.stats

  const statsData: StatItem[] = stats ? [
    {
      name: "Total Posts",
      stat: stats.posts.toString(),
      previousStat: stats.publishedPosts,
      change: stats.posts > 0 ? `${stats.publishedPosts} published` : "No posts yet",
      changeType: stats.publishedPosts > 0 ? "increase" : undefined,
      icon: <DocumentTextIcon className="w-5 h-5" />
    },
    {
      name: "Published Posts",
      stat: stats.publishedPosts.toString(),
      previousStat: stats.posts - stats.publishedPosts,
      change: stats.posts > 0 ? `${stats.posts - stats.publishedPosts} drafts` : "0 drafts",
      changeType: stats.publishedPosts > 0 ? "increase" : undefined,
      icon: <DocumentTextIcon className="w-5 h-5" />
    },
    {
      name: "Projects",
      stat: stats.projects.toString(),
      previousStat: stats.featuredProjects,
      change: stats.projects > 0 ? `${stats.featuredProjects} featured` : "No projects",
      changeType: stats.featuredProjects > 0 ? "increase" : undefined,
      icon: <RocketLaunchIcon className="w-5 h-5" />
    },
    {
      name: "Messages",
      stat: stats.contacts.toString(),
      previousStat: stats.contacts - stats.unreadContacts,
      change: stats.unreadContacts > 0 ? `${stats.unreadContacts} unread` : "All read",
      changeType: stats.unreadContacts > 0 ? "decrease" : "increase",
      icon: <EnvelopeIcon className="w-5 h-5" />
    }
  ] : []

  // Generate recent activity from store data
  const recentActivity: RecentActivity[] = data ? [
    ...(data.recentActivity.posts?.map((post: PostActivityData) => ({
      id: `post-${post.id}`,
      type: 'post' as const,
      title: post.title,
      action: post.published ? 'Publicado' : 'Creado como borrador',
      timestamp: post.createdAt,
      status: post.published ? 'published' : 'draft'
    })) || []),
    ...(data.recentActivity.projects?.map((project: ProjectActivityData) => ({
      id: `project-${project.id}`,
      type: 'project' as const,
      title: project.title,
      action: 'Proyecto agregado',
      timestamp: project.createdAt,
      status: project.featured ? 'featured' : 'normal'
    })) || []),
    ...(data.recentActivity.contacts?.map((contact: ContactActivityData) => ({
      id: `contact-${contact.id}`,
      type: 'contact' as const,
      title: `Mensaje de ${contact.name}`,
      action: 'Nuevo contacto',
      timestamp: contact.createdAt,
      status: contact.read ? 'read' : 'unread'
    })) || [])
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8) : [];



  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        pages={breadcrumbs}
        homeHref="/admin/dashboard"
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here&apos;s what&apos;s happening with your portfolio.</p>
        </div>
        <Button
          onClick={refetch}
          disabled={loading}
          icon={<ArrowPathIcon className="h-4 w-4" />}
          variant="secondary"
          size="sm"
        >
          {loading ? "Refreshing..." : "Refresh Stats"}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="error"
          title="Error Loading Data"
          description={error}
          dismissible
          onDismiss={() => {}}
        />
      )}

      {/* Database Connection Alert */}
      {!loading && !error && (
        <Alert
          variant="success"
          title="Database Connected"
          description="Successfully connected to local MySQL database."
          dismissible
          onDismiss={() => {}}
        />
      )}

      {/* Stats Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <SkeletonCard key={i} showImage={false} lines={2} className="h-32" />
          ))}
        </div>
      ) : (
        <Stats
          title="Resumen de los últimos 30 días"
          stats={statsData}
          columns={4}
        />
      )}

      {/* Recent Activity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold text-white">Recent Posts</h3>
            <p className="text-sm text-gray-400">Latest blog post activity</p>
          </CardHeader>
          <CardBody>
            <LoadingOverlay loading={loading} className="min-h-[200px]">
              {!loading && (
                <div className="space-y-4">
                  {recentActivity
                    .filter(activity => activity.type === 'post')
                    .slice(0, 4)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{activity.title}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.timestamp).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Badge variant={activity.status === 'published' ? 'green' : 'yellow'}>
                          {activity.status === 'published' ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                    ))}
                  {recentActivity.filter(activity => activity.type === 'post').length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">No recent posts</p>
                  )}
                </div>
              )}
            </LoadingOverlay>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold text-white">Recent Messages</h3>
            <p className="text-sm text-gray-400">Latest contact form submissions</p>
          </CardHeader>
          <CardBody>
            <LoadingOverlay loading={loading} className="min-h-[200px]">
              {!loading && (
                <div className="space-y-4">
                  {recentActivity
                    .filter(activity => activity.type === 'contact')
                    .slice(0, 4)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{activity.title}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.timestamp).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {activity.status === 'unread' && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Badge variant={activity.status === 'unread' ? 'blue' : 'gray'}>
                            {activity.status === 'unread' ? 'New' : 'Read'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  {recentActivity.filter(activity => activity.type === 'contact').length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">No recent messages</p>
                  )}
                </div>
              )}
            </LoadingOverlay>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}