"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface Stats {
  posts: number;
  projects: number;
  contacts: number;
  unreadContacts: number;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    projects: 0,
    contacts: 0,
    unreadContacts: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

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

        const unreadContacts = contacts.filter((contact: any) => !contact.read).length;

        setStats({
          posts: posts.length || 0,
          projects: projects.length || 0,
          contacts: contacts.length || 0,
          unreadContacts,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <AdminSidebar stats={stats} />
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        {/* Top header */}
        {title && (
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 bg-gray-50/30 dark:bg-gray-900/30 min-h-0">
          <div className="h-full overflow-x-hidden overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}