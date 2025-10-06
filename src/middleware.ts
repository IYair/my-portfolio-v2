import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Auth middleware
const authMiddleware = withAuth(
  function onSuccess() {
    // Lógica adicional si necesitas
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acceso a /admin/login sin autenticación
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }

        // Proteger todas las demás rutas de admin
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }

        return true;
      },
    },
  }
);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply auth middleware for admin routes
  if (pathname.startsWith("/admin")) {
    return (authMiddleware as never)(request, {} as never);
  }

  // Skip i18n for api and static files
  const shouldSkipI18n =
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".");

  if (shouldSkipI18n) {
    return NextResponse.next();
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
