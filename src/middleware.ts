import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {
    // Lógica adicional si necesitas
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acceso a /admin/login sin autenticación
        if (req.nextUrl.pathname === "/admin/login") {
          return true
        }

        // Proteger todas las demás rutas de admin
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}