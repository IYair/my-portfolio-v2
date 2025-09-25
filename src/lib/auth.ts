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

// NextAuth automáticamente lee NEXTAUTH_SECRET de las variables de entorno
// Solo validamos que estén disponibles en desarrollo
if (process.env.NODE_ENV === "development") {
  console.log("🔐 NextAuth Environment Check:")
  console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing")
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing")
  console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL ? "✅ Set" : "❌ Missing")
  console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? "✅ Set" : "❌ Missing")
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

        // Verificar credenciales contra variables de entorno
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
  // NextAuth automáticamente lee NEXTAUTH_SECRET de las variables de entorno
}