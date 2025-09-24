"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/about", label: "Acerca" },
    { href: "/#projects", label: "Proyectos" },
    { href: "/#blog", label: "Blog" },
    { href: "/#contact", label: "Contacto" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-foreground/10 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="font-mono font-semibold text-lg">
            <Link href="/">Yair Chan</Link>
          </div>
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
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
        </div>
      </div>
    </nav>
  );
}