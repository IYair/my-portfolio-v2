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
  // Debug: Mostrar todas las variables disponibles
  console.log("🔍 Environment Debug - Auth Config Loading:")
  console.log("NODE_ENV:", process.env.NODE_ENV)
  console.log("process.env.NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET)
  console.log("process.env.AUTH_SECRET exists:", !!process.env.AUTH_SECRET)
  console.log("process.env.ADMIN_EMAIL exists:", !!process.env.ADMIN_EMAIL)
  console.log("process.env.ADMIN_PASSWORD exists:", !!process.env.ADMIN_PASSWORD)
  console.log("NEXTAUTH_SECRET final value exists:", !!NEXTAUTH_SECRET)

  // Lista todas las variables que contienen AUTH
  const authVars = Object.keys(process.env).filter(key =>
    key.includes('AUTH') || key.includes('NEXTAUTH')
  )
  console.log("Available AUTH-related env vars:", authVars)

  // Validación más flexible para desarrollo vs producción
  const requiredSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  if (!requiredSecret) {
    console.error("❌ No secret found! Checked NEXTAUTH_SECRET and AUTH_SECRET")
    // Solo lanzar error en producción
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXTAUTH_SECRET or AUTH_SECRET must be set in production environment variables."
      )
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    console.error("❌ Admin credentials not set!")
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables."
      )
    }
  }

  console.log("🔐 NextAuth Environment Summary:")
  console.log("Secret:", requiredSecret ? "✅ Set" : "❌ Missing")
  console.log("Admin Email:", adminEmail ? "✅ Set" : "❌ Missing")
  console.log("Admin Password:", adminPassword ? "✅ Set" : "❌ Missing")
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

        // Verificar credenciales usando variables de entorno directamente
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
          console.error("Admin credentials not configured")
          return null
        }

        // Verificar email
        if (credentials.email !== adminEmail) {
          return null
        }

        // Verificar password (puedes usar hash más adelante)
        if (credentials.password !== adminPassword) {
          return null
        }

        // Retornar usuario admin
        return {
          id: "admin",
          email: adminEmail,
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
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
}