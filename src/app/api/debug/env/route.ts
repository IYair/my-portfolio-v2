import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Solo en desarrollo o con parámetro especial para debug
  const isDev = process.env.NODE_ENV === "development"
  const { searchParams } = new URL(request.url)
  const debugKey = searchParams.get("debug")

  // Permitir temporalmente en producción con clave secreta
  if (!isDev && debugKey !== "temp-debug-2024") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
    AUTH_SECRET: process.env.AUTH_SECRET ? "✅ Set" : "❌ Missing",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "✅ Set" : "❌ Missing",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "✅ Set" : "❌ Missing",
    DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
    // Lista de todas las env vars que contienen AUTH o NEXTAUTH
    authRelatedVars: Object.keys(process.env).filter(key =>
      key.includes('AUTH') || key.includes('NEXTAUTH')
    )
  }

  return NextResponse.json(envVars)
}