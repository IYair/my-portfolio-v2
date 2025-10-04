import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const blogPosts = [
  {
    title: "Introducción a Next.js 15: Nuevas Características",
    slug: "introduccion-nextjs-15-nuevas-caracteristicas",
    excerpt:
      "Descubre las últimas innovaciones de Next.js 15 y cómo pueden mejorar tus aplicaciones web.",
    content:
      "<p>Next.js 15 trae consigo una serie de mejoras significativas que transformarán la forma en que desarrollamos aplicaciones web modernas. En este artículo exploraremos las características más destacadas.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop",
    published: true,
    featured: false,
    tags: ["Next.js", "React", "JavaScript", "Tutorial"],
  },
  {
    title: "Guía Completa de React Server Components",
    slug: "guia-completa-react-server-components",
    excerpt:
      "Todo lo que necesitas saber sobre React Server Components y cómo implementarlos en tus proyectos.",
    content:
      "<p>Los React Server Components representan un cambio paradigmático en cómo pensamos sobre la renderización en React. Aprende a dominarlos con esta guía completa.</p>",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
    published: true,
    featured: false,
    tags: ["React", "Server Components", "Frontend"],
  },
  {
    title: "TypeScript: Tipos Avanzados para Desarrolladores",
    slug: "typescript-tipos-avanzados-desarrolladores",
    excerpt:
      "Domina los tipos avanzados de TypeScript y lleva tu código al siguiente nivel de type safety.",
    content:
      "<p>TypeScript ofrece un sistema de tipos robusto que va más allá de los básicos. Explora utility types, conditional types y más en este tutorial avanzado.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop",
    published: true,
    featured: false,
    tags: ["TypeScript", "JavaScript", "Tutorial"],
  },
  {
    title: "Optimización de Performance en Aplicaciones React",
    slug: "optimizacion-performance-aplicaciones-react",
    excerpt:
      "Técnicas probadas para mejorar el rendimiento de tus aplicaciones React y ofrecer una mejor UX.",
    content:
      "<p>La performance es crucial en aplicaciones modernas. Descubre estrategias de optimización como memoization, lazy loading, y code splitting.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
    published: true,
    featured: false,
    tags: ["React", "Performance", "Optimization"],
  },
  {
    title: "Tailwind CSS v4: Novedades y Mejoras",
    slug: "tailwind-css-v4-novedades-mejoras",
    excerpt:
      "Explora las nuevas características de Tailwind CSS v4 y cómo aprovecharlas en tus diseños.",
    content:
      "<p>Tailwind CSS v4 introduce mejoras significativas en rendimiento, nuevas utilidades y un sistema de configuración más flexible. Descubre todo lo nuevo.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=630&fit=crop",
    published: true,
    featured: false,
    tags: ["Tailwind CSS", "CSS", "UI/UX"],
  },
  {
    title: "Construyendo APIs REST con Node.js y Express",
    slug: "construyendo-apis-rest-nodejs-express",
    excerpt: "Aprende a crear APIs RESTful robustas y escalables con Node.js y Express desde cero.",
    content:
      "<p>Las APIs REST son fundamentales en el desarrollo moderno. Este tutorial te guiará paso a paso en la creación de una API profesional con mejores prácticas.</p>",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop",
    published: true,
    featured: false,
    tags: ["Node.js", "Express", "Backend", "REST API"],
  },
  {
    title: "Docker para Desarrolladores Frontend",
    slug: "docker-para-desarrolladores-frontend",
    excerpt: "Simplifica tu flujo de trabajo con Docker: containerización para proyectos frontend.",
    content:
      "<p>Docker no es solo para backend. Descubre cómo containerizar tus aplicaciones frontend para desarrollo consistente y despliegues simplificados.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=630&fit=crop",
    published: true,
    featured: false,
    tags: ["Docker", "DevOps", "Frontend"],
  },
  {
    title: "Testing en React: Jest y React Testing Library",
    slug: "testing-react-jest-testing-library",
    excerpt:
      "Domina el testing en React con Jest y React Testing Library para código más confiable.",
    content:
      "<p>Los tests son esenciales para mantener código de calidad. Aprende a escribir tests efectivos para tus componentes React con las herramientas más populares.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop",
    published: true,
    featured: false,
    tags: ["Testing", "React", "Jest"],
  },
  {
    title: "GraphQL vs REST: ¿Cuál Elegir en 2025?",
    slug: "graphql-vs-rest-cual-elegir-2025",
    excerpt:
      "Análisis comparativo profundo entre GraphQL y REST para ayudarte a tomar la mejor decisión.",
    content:
      "<p>GraphQL y REST tienen sus ventajas. Analizamos casos de uso, performance, y ecosistema para ayudarte a elegir la mejor opción para tu proyecto.</p>",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop",
    published: true,
    featured: false,
    tags: ["GraphQL", "REST API", "Backend"],
  },
  {
    title: "Micro-Frontends: Arquitectura Escalable para Equipos Grandes",
    slug: "micro-frontends-arquitectura-escalable",
    excerpt:
      "Descubre cómo los micro-frontends pueden transformar la forma en que construyes aplicaciones a gran escala.",
    content:
      "<p>Los micro-frontends permiten que múltiples equipos trabajen independientemente en diferentes partes de una aplicación. Conoce esta arquitectura revolucionaria.</p>",
    coverImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630&fit=crop",
    published: true,
    featured: false,
    tags: ["Arquitectura", "Frontend", "Micro-frontends", "Fullstack"],
  },
];

async function main() {
  console.log("🌱 Iniciando seed de posts...");

  // Primero, eliminar posts existentes (opcional)
  console.log("🗑️  Limpiando posts existentes...");
  await prisma.post.deleteMany({});
  console.log("✅ Posts eliminados");

  // Crear tags
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  console.log("🏷️  Creando tags...");
  for (const tagName of allTags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }
  console.log(`✅ ${allTags.length} tags creados`);

  // Crear posts
  console.log("📝 Creando posts...");
  for (const postData of blogPosts) {
    const { tags, ...data } = postData;

    // Obtener IDs de tags
    const tagRecords = await Promise.all(
      tags.map(tagName => prisma.tag.findUnique({ where: { name: tagName } }))
    );

    const post = await prisma.post.create({
      data: {
        ...data,
        contentType: "tiptap",
        tags: {
          connect: tagRecords.filter(tag => tag !== null).map(tag => ({ id: tag!.id })),
        },
      },
      include: {
        tags: true,
      },
    });

    console.log(`  ✓ Creado: ${post.title}`);
  }

  console.log("\n✅ Seed completado exitosamente!");
  console.log(`📊 Total de posts creados: ${blogPosts.length}`);
}

main()
  .catch(e => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
