import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    id: string
    role: string
  }
  
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
}

// Obtener variables de entorno con fallbacks para Webpack
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Validación de variables de entorno críticas (solo en servidor)
if (typeof window === "undefined") {
  if (!NEXTAUTH_SECRET) {
    console.error("❌ NEXTAUTH_SECRET is not set!")
    throw new Error(
      "NEXTAUTH_SECRET is not set. Please add it to your environment variables."
    )
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("❌ Admin credentials not set!")
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables."
    )
  }

  console.log("🔐 NextAuth Environment Check:")
  console.log("NEXTAUTH_SECRET:", NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing")
  console.log("ADMIN_EMAIL:", ADMIN_EMAIL ? "✅ Set" : "❌ Missing")
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Verificar credenciales usando las variables locales
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
          console.error("Admin credentials not configured")
          return null
        }

        // Verificar email
        if (credentials.email !== ADMIN_EMAIL) {
          return null
        }

        // Verificar password (puedes usar hash más adelante)
        if (credentials.password !== ADMIN_PASSWORD) {
          return null
        }

        // Retornar usuario admin
        return {
          id: "admin",
          email: ADMIN_EMAIL,
          name: "Admin",
          role: "admin"
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub || "",
          role: token.role as string,
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: NEXTAUTH_SECRET,
}