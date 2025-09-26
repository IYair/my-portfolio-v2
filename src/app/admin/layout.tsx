"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { usePathname } from "next/navigation";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Si estamos en la página de login, no aplicar AdminLayout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Ya no necesitamos Provider - Zustand maneja el estado globalmente
  return <AdminLayout>{children}</AdminLayout>;
}