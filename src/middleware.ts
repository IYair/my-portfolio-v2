import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Public paths that don't need protection
const publicPaths = ["/admin/login"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Skip i18n for admin, api and static files
    const shouldSkipI18n =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/images") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.includes(".");

    if (shouldSkipI18n) {
      return NextResponse.next();
    }

    // Apply internationalization middleware
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Permitir acceso a /admin/login sin autenticación
        if (publicPaths.some(path => pathname === path)) {
          return true;
        }

        // Proteger todas las demás rutas de admin
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
