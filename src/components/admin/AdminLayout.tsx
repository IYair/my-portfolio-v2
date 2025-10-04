"use client";

import useAdminStore from "@/stores/adminStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { status } = useSession();
  const router = useRouter();

  // Use Zustand store - automatically triggers fetch on first access
  const { dashboardData, fetchDashboardData } = useAdminStore();

  // Extract stats from Zustand store
  const stats = dashboardData?.stats || {
    posts: 0,
    publishedPosts: 0,
    projects: 0,
    featuredProjects: 0,
    contacts: 0,
    unreadContacts: 0,
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Fetch dashboard data when authenticated (only once)
  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "loading") {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="bg-background flex h-screen">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <AdminSidebar stats={stats} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-72">
        {/* Top header */}
        {title && (
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 px-4 shadow-sm backdrop-blur-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-900/80">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="min-h-0 flex-1 bg-gray-50/30 dark:bg-gray-900/30">
          <div className="h-full overflow-x-hidden overflow-y-auto">
            <div className="mx-auto flex h-full max-w-full flex-col px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
