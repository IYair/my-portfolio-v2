"use client";

import { useTheme } from "@/hooks/useTheme";
import { Link } from "@/i18n/routing";
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");

  // No mostrar navegación en rutas de admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/#projects", label: t("projects") },
    { href: "/#blog", label: t("blog") },
    { href: "/#contact", label: t("contact") },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-background/80 border-foreground/10 fixed top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="font-mono text-lg font-semibold">
            <Link href="/" onClick={closeMobileMenu}>
              Yair Chan
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {/* Desktop Navigation */}
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
            {/* Language Switcher */}
            <LanguageSwitcher />
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="hover:bg-foreground/5 rounded-lg p-2 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <MoonIcon className="text-foreground h-5 w-5" />
                ) : (
                  <SunIcon className="text-foreground h-5 w-5" />
                )}
              </button>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-foreground/5 rounded-lg p-2 transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="text-foreground h-6 w-6" />
              ) : (
                <Bars3Icon className="text-foreground h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-foreground/10 bg-background/95 border-t backdrop-blur-sm md:hidden">
          <div className="mx-auto max-w-6xl space-y-1 px-6 py-4">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block rounded-lg px-4 py-3 transition-colors ${
                  pathname === item.href
                    ? "bg-foreground/5 text-foreground/70"
                    : "hover:bg-foreground/5 hover:text-foreground/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
