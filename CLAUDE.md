# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **bilingual (ES/EN) Next.js 15 portfolio and blog application** built with React 19, TypeScript, and Tailwind CSS v4. The project includes:

- **Public-facing portfolio**: Showcasing projects, skills, education, work experience, and blog posts
- **Admin dashboard**: Full CMS for managing all content with TipTap rich text editor
- **Internationalization**: Spanish (default) and English with next-intl
- **Authentication**: NextAuth-based admin access control
- **AWS S3 integration**: Image uploads and asset management

## Development Commands

### Core Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run dev:full` - Run type-check, lint, then start dev server
- `npm run build` - Run migrations, generate Prisma client, and build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run type-check` - Run TypeScript compiler check without emitting files
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without making changes

### Database Commands

- `npm run db:generate` - Generate Prisma client to `src/generated/prisma`
- `npm run db:migrate` - Create and apply migration (development)
- `npm run db:push` - Push schema changes without creating migration files
- `npm run db:studio` - Open Prisma Studio at http://localhost:5555
- `npm run db:seed` - Seed database with initial data using `prisma/seed.ts`
- `npm run db:deploy` - Apply migrations in production (used in build script)

### Git Hooks

- **pre-commit**: Runs lint-staged which auto-formats and lints staged files
- Configured via Husky v9

## Technology Stack

### Core Framework

- **Next.js 15** with App Router architecture
- **React 19** with TypeScript in strict mode
- **Tailwind CSS v4** with PostCSS and typography plugin
- **next-intl** for internationalization (ES/EN)

### Authentication & Middleware

- **NextAuth v4** for admin authentication
- **Custom middleware** combining NextAuth + next-intl routing
- Admin routes protected at `/admin/*` (except `/admin/login`)

### Database & ORM

- **MySQL** database with **Prisma v6**
- Prisma client generated to `src/generated/prisma` (not default location)
- Shadow database support for safe migrations

### Content Editing

- **TipTap** rich text editor with extensive extensions (tables, images, code blocks, etc.)
- **EditorJS** legacy support for some content
- **Shiki** for syntax highlighting in code blocks
- **Markdown** support with rehype

### File Storage

- **AWS S3** for image uploads and asset storage
- **Sharp** for image optimization
- Configured remote patterns in [next.config.ts](next.config.ts) for S3 and common CDNs

### UI Components

- **Heroicons v2** for icons
- **Radix UI** primitives (dropdown, select, popover, etc.)
- **Headless UI** components
- **dnd-kit** for drag-and-drop functionality
- **Sonner** for toast notifications
- **react-day-picker** for date selection

### Utilities

- **@formkit/tempo** - CRITICAL: Use Tempo for ALL date operations (formatting, parsing, manipulation). Never use date-fns despite it being in dependencies
- **Zod v4** for schema validation
- **Zustand** for client-side state management
- **class-variance-authority** + **clsx** + **tailwind-merge** for className composition
- **axios** for HTTP requests

### Translation

- **DeepL API** integration for automatic ES → EN translation in admin dashboard

### Code Quality

- **ESLint v9** with TypeScript and Prettier integration
- **Prettier** with Tailwind CSS plugin
- **lint-staged** for pre-commit hooks

## Architecture

The project follows a **feature-based architecture** with clear separation of concerns:

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized public routes (ES/EN)
│   │   ├── layout.tsx           # Locale-specific layout with Navigation, Analytics
│   │   ├── page.tsx             # Homepage
│   │   ├── about/               # About page
│   │   ├── projects/            # Portfolio projects
│   │   └── blog/                # Blog posts
│   ├── admin/                   # Admin dashboard (no i18n, auth-protected)
│   │   ├── login/               # Login page (public)
│   │   └── dashboard/           # CMS routes (protected)
│   ├── api/                     # API routes
│   └── layout.tsx               # Root layout (fonts, global styles)
├── components/
│   ├── features/                # Feature-specific components (blog, projects, admin)
│   ├── layout/                  # Layout components (Navigation, Footer)
│   ├── providers/               # React context providers
│   ├── ui/                      # Reusable UI primitives
│   ├── tiptap-*/                # TipTap editor components
│   └── [feature-name]/          # Other feature components
├── generated/
│   └── prisma/                  # Generated Prisma client (non-standard location)
├── hooks/                       # Custom React hooks
├── i18n/                        # Internationalization config
│   ├── routing.ts               # next-intl routing config (locales: es, en)
│   └── request.ts               # Server-side i18n utilities
├── lib/                         # Configurations and external integrations
├── providers/                   # Global providers
├── stores/                      # Zustand stores
├── styles/                      # Global styles and Tailwind config
├── types/                       # TypeScript type definitions
├── utils/                       # Pure utility functions
└── middleware.ts                # Combined NextAuth + i18n middleware
```

### Key Architecture Patterns

1. **Locale-based routing**: Public routes use `[locale]` dynamic segment for ES/EN
2. **Admin isolation**: `/admin` routes bypass i18n, use separate auth-protected layout
3. **Middleware chain**: Combines NextAuth authorization + next-intl routing
4. **Service layer pattern**: API calls organized in `src/lib/` or feature-specific services
5. **Component colocation**: Feature components grouped by domain (blog, projects, admin)

### Database Schema

**Core Models:**

- `Post` - Blog posts with title, slug, content (markdown/TipTap JSON), tags, published/featured flags
- `Tag` - Post tags with many-to-many relation to Posts
- `Project` - Portfolio projects with title, description, images, tech stack, order
- `Contact` - Contact form submissions with read/unread status

**Profile & About:**

- `AboutProfile` - Personal bio with bilingual support (ES/EN)
- `Skill` - Skills with icons and categories
- `ContactInfo` - Contact methods (email, phone, social links)
- `WorkExperience` - Job history with bilingual descriptions (markdown + HTML)
- `Education` - Educational background with bilingual degrees
- `Course` - Completed courses/certifications

**Key Schema Features:**

- Bilingual fields: Many models have `field` and `fieldEn` variants for ES/EN
- Content formats: Support both markdown and HTML rendering
- Order fields: For manual sorting (projects, skills, work experience, etc.)
- Timestamps: `createdAt`/`updatedAt` on most models
- Soft publishing: `published` and `featured` flags

## Configuration Notes

### TypeScript

- Path mapping: `@/*` → `./src/*`
- Strict mode enabled
- Target: ES2017

### Prisma

- **IMPORTANT**: Client outputs to `src/generated/prisma`, NOT `node_modules/.prisma/client`
- Import Prisma client as: `import { PrismaClient } from "@/generated/prisma"`
- Uses shadow database for safe migrations

### Next.js

- Image optimization enabled with multiple remote patterns
- SVG support with CSP sandbox
- Environment variables exposed via `next.config.ts` `env` property
- Analytics: Vercel Analytics + Speed Insights

### Internationalization

- Default locale: `es` (Spanish)
- Supported locales: `es`, `en`
- Messages loaded per-locale in `[locale]/layout.tsx`
- Admin dashboard is Spanish-only (no locale routing)
- Use `next-intl` navigation wrappers (`Link`, `useRouter`, etc.) from `@/i18n/routing`

### Authentication

- Admin credentials configured via environment variables
- Protected routes: All `/admin/*` except `/admin/login`
- Token-based auth with role checking (`role === "admin"`)

### Styling

- Tailwind CSS v4 with inline theme in `globals.css`
- Dark mode via CSS custom properties and `prefers-color-scheme`
- Typography plugin for prose content
- Prettier auto-sorts Tailwind classes

## Environment Variables

Required variables (see [.env.example](.env.example)):

```bash
# Database
DATABASE_URL="mysql://user:pass@host:port/db"

# NextAuth
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="https://yourdomain.com"

# Admin credentials
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="secure-password"

# AWS S3
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket"

# DeepL Translation API
DEEPL_API_KEY="your-deepl-key"

# Site URL (for SEO/sitemap)
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

## Critical Implementation Rules

### HTTP Requests

- **ALWAYS use axios** via `@/lib/api-client` for HTTP requests
- **NEVER use `fetch` API** directly for API calls in client-side code
- The configured apiClient handles timeouts, headers, and error formatting
- Examples:

  ```typescript
  import apiClient from "@/lib/api-client";

  // GET request
  const response = await apiClient.get("/api/posts");
  const data = response.data;

  // POST request
  const response = await apiClient.post("/api/posts", { title: "New Post" });

  // PATCH/PUT request
  await apiClient.patch("/api/posts/123", formData);

  // Error handling - axios throws on non-2xx responses
  try {
    await apiClient.post("/api/posts", formData);
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.message;
  }
  ```

### Date Handling

- **ALWAYS use `@formkit/tempo`** for all date operations
- **NEVER use `date-fns`** even though it's in dependencies
- Examples:
  ```typescript
  import { format, parse } from "@formkit/tempo";
  format(new Date(), "YYYY-MM-DD");
  ```

### Prisma Client Import

- **ALWAYS import from generated path**:
  ```typescript
  import { PrismaClient } from "@/generated/prisma";
  ```
- **NEVER** import from `@prisma/client` directly

### Internationalization

- **Public routes**: Must be under `[locale]` directory
- **Admin routes**: No locale prefix, always in Spanish
- **Navigation**: Use `Link` from `@/i18n/routing`, not `next/link`
- **Bilingual content**: Most models have `field` (ES) and `fieldEn` (EN) variants

### Content Editing

- TipTap is primary editor for new content
- EditorJS legacy support for existing content
- Content stored as both markdown and HTML where applicable

### Next.js 15 Specific Rules

- **Dynamic Route Params**: All `params` in Server Components and API routes are `Promise<{}>` - must await them
- **Client Component Params**: Use React's `use()` hook to unwrap params Promise in Client Components
- **Server vs Client Components**: Default to Server Components, only use `"use client"` when absolutely necessary (forms, interactivity, browser APIs)
