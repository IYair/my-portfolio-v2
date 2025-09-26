"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAdminStore from "@/stores/adminStore";
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

  console.log("🏗️ AdminLayout rendered - using Zustand global state");

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

  // Fetch dashboard data when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, fetchDashboardData]);

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