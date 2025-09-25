import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {
    // Aquí puedes agregar lógica adicional si necesitas
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Proteger todas las rutas que empiecen con /admin/dashboard
        if (req.nextUrl.pathname.startsWith("/admin/dashboard")) {
          return token?.role === "admin"
        }

        // Permitir acceso a /admin/login sin autenticación
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/dashboard/:path*"]
}