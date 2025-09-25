"use client";

import { useEffect, useState } from "react";
import Stats, { StatItem } from "@/components/ui/Stats";
import {
  DocumentTextIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

interface DashboardStats {
  posts: number;
  projects: number;
  contacts: number;
  publishedPosts: number;
  featuredProjects: number;
  unreadContacts: number;
}

interface RecentActivity {
  id: string;
  type: 'post' | 'project' | 'contact';
  title: string;
  action: string;
  timestamp: string;
  status?: string;
}

export default function DashboardContent() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    posts: 0,
    projects: 0,
    contacts: 0,
    publishedPosts: 0,
    featuredProjects: 0,
    unreadContacts: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsRes, projectsRes, contactsRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/projects"),
          fetch("/api/contacts"),
        ]);

        const [posts, projects, contacts] = await Promise.all([
          postsRes.json(),
          projectsRes.json(),
          contactsRes.json(),
        ]);

        const publishedPosts = posts.filter((post: any) => post.published).length;
        const featuredProjects = projects.filter((project: any) => project.featured).length;
        const unreadContacts = contacts.filter((contact: any) => !contact.read).length;

        setDashboardStats({
          posts: posts.length || 0,
          projects: projects.length || 0,
          contacts: contacts.length || 0,
          publishedPosts,
          featuredProjects,
          unreadContacts,
        });

        // Generate recent activity
        const activities: RecentActivity[] = [
          ...posts.slice(0, 3).map((post: any) => ({
            id: `post-${post.id}`,
            type: 'post' as const,
            title: post.title,
            action: post.published ? 'Publicado' : 'Creado como borrador',
            timestamp: post.createdAt,
            status: post.published ? 'published' : 'draft'
          })),
          ...projects.slice(0, 2).map((project: any) => ({
            id: `project-${project.id}`,
            type: 'project' as const,
            title: project.title,
            action: 'Proyecto agregado',
            timestamp: project.createdAt,
            status: project.featured ? 'featured' : 'normal'
          })),
          ...contacts.slice(0, 2).map((contact: any) => ({
            id: `contact-${contact.id}`,
            type: 'contact' as const,
            title: `Mensaje de ${contact.name}`,
            action: 'Nuevo contacto',
            timestamp: contact.createdAt,
            status: contact.read ? 'read' : 'unread'
          }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);

        setRecentActivity(activities);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Prepare stats data for the Stats component
  const statsData: StatItem[] = [
    {
      name: "Total Posts",
      stat: dashboardStats.posts,
      previousStat: dashboardStats.publishedPosts,
      change: dashboardStats.publishedPosts > 0 ? `${Math.round((dashboardStats.publishedPosts / dashboardStats.posts) * 100)}%` : "0%",
      changeType: dashboardStats.publishedPosts > 0 ? "increase" : undefined,
      icon: <DocumentTextIcon className="w-5 h-5" />
    },
    {
      name: "Proyectos",
      stat: dashboardStats.projects,
      previousStat: dashboardStats.featuredProjects,
      change: dashboardStats.featuredProjects > 0 ? `${dashboardStats.featuredProjects}` : "0",
      changeType: dashboardStats.featuredProjects > 0 ? "increase" : undefined,
      icon: <RocketLaunchIcon className="w-5 h-5" />
    },
    {
      name: "Contactos",
      stat: dashboardStats.contacts,
      previousStat: dashboardStats.contacts - dashboardStats.unreadContacts,
      change: dashboardStats.unreadContacts > 0 ? `${dashboardStats.unreadContacts}` : "0",
      changeType: dashboardStats.unreadContacts > 0 ? "decrease" : undefined,
      icon: <EnvelopeIcon className="w-5 h-5" />
    },
    {
      name: "Actividad",
      stat: recentActivity.length,
      change: "Reciente",
      changeType: recentActivity.length > 0 ? "increase" : undefined,
      icon: <ChartBarIcon className="w-5 h-5" />
    }
  ];

  return (
    <>
      {/* Stats Section */}
      <Stats
        title="Resumen de los últimos 30 días"
        stats={statsData}
        columns={4}
        className="mb-8"
      />

      {/* Recent Activity */}
      <div>
        <div className="bg-white/80 dark:bg-gray-800/75 shadow rounded-lg ring-1 ring-inset ring-gray-200 dark:ring-white/10 backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Actividad Reciente</h3>
          </div>
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No hay actividad reciente</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        activity.type === 'post' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                        activity.type === 'project' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                        'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
                      }`}>
                        {activity.type === 'post' ? <DocumentTextIcon className="w-4 h-4" /> :
                         activity.type === 'project' ? <RocketLaunchIcon className="w-4 h-4" /> :
                         <EnvelopeIcon className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.action} • {new Date(activity.timestamp).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'published' || activity.status === 'featured' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                        activity.status === 'unread' ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400'
                      }`}>
                        {activity.status === 'published' ? 'Publicado' :
                         activity.status === 'featured' ? 'Destacado' :
                         activity.status === 'unread' ? 'Sin leer' :
                         activity.status === 'draft' ? 'Borrador' : 'Normal'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}