import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  env: {
    // Variables de NextAuth
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    // Credenciales de admin
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    // Base de datos
    DATABASE_URL: process.env.DATABASE_URL,
  },
  images: {
    remotePatterns: [
      // AWS S3
      {
        protocol: "https",
        hostname: "portfolio-blog-prod.s3.mx-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
      },
      // Common image hosting services
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      // GitHub assets
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      // CDNs
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "unpkg.com",
      },
      // Fallback for any other HTTPS domain (less secure but functional)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add formats for better optimization
    formats: ["image/webp", "image/avif"],
    // Handle broken images gracefully
    unoptimized: false,
    // Increase loader timeout for slow S3 responses
    minimumCacheTTL: 60,
  },
};

export default withNextIntl(nextConfig);
