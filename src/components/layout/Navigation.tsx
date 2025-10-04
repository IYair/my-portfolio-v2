"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/hooks/useTheme";

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();

  // No mostrar navegación en rutas de admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/about", label: "Acerca" },
    { href: "/#projects", label: "Proyectos" },
    { href: "/#blog", label: "Blog" },
    { href: "/#contact", label: "Contacto" },
  ];

  return (
    <nav className="bg-background/80 border-foreground/10 fixed top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="font-mono text-lg font-semibold">
            <Link href="/">Yair Chan</Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden space-x-8 md:flex">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    pathname === item.href
                      ? "text-foreground/70"
                      : "hover:text-foreground/70 transition-colors"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="hover:bg-foreground/5 rounded-lg p-2 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <SunIcon className="text-foreground h-5 w-5" />
                ) : (
                  <MoonIcon className="text-foreground h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
