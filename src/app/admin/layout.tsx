"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import SessionProvider from "@/components/providers/SessionProvider";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Si estamos en la página de login, solo envolver con SessionProvider
  if (pathname === "/admin/login") {
    return (
      <SessionProvider>
        {children}
        <Toaster position="top-right" expand={false} richColors closeButton theme="system" />
      </SessionProvider>
    );
  }

  // Para el resto del dashboard, usar AdminLayout con SessionProvider
  return (
    <SessionProvider>
      <AdminLayout>{children}</AdminLayout>
      <Toaster position="top-right" expand={false} richColors closeButton theme="system" />
    </SessionProvider>
  );
}
