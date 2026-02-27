import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with Yair Chan's CV data...");

  // ─── ABOUT PROFILE ──────────────────────────────────────────────────────────
  console.log("📝 Creating about profile...");

  await prisma.aboutProfile.deleteMany();
  await prisma.aboutProfile.create({
    data: {
      name: "Yair Chan",
      title: "Desarrollador Full Stack",
      titleEn: "Full Stack Developer",
      subtitle: "Software Engineer · 5+ años de experiencia",
      subtitleEn: "Software Engineer · 5+ years of experience",
      bio: `Desarrollador Full Stack con más de 5 años de experiencia en el desarrollo de soluciones web escalables y aplicaciones empresariales. Especializado en React, Next.js, Laravel, NestJS y arquitectura de microservicios. Experiencia comprobada en desarrollo de ERP, CRM, sistemas de adquisición de datos industriales y plataformas de machine learning. Co-autor de plugin open-source con miles de descargas. Sólida experiencia en diseño de bases de datos, automatización de pruebas, CI/CD y despliegue en AWS y Azure. Obsesionado por código limpio, optimización de rendimiento y arquitectura de software.`,
      bioEn: `Full Stack Developer with 5+ years of experience building scalable web solutions and enterprise applications. Specialized in React, Next.js, Laravel, NestJS, and microservices architecture. Proven experience in ERP and CRM development, industrial data acquisition systems, and machine learning platforms. Co-author of an open-source plugin with thousands of downloads. Strong background in database design, test automation, CI/CD pipelines, and deployment on AWS and Azure. Passionate about clean code, performance optimization, and software architecture.`,
      bioHtml: `<p>Desarrollador Full Stack con más de 5 años de experiencia en el desarrollo de soluciones web escalables y aplicaciones empresariales. Especializado en <strong>React, Next.js, Laravel, NestJS</strong> y arquitectura de microservicios.</p><p>Experiencia comprobada en desarrollo de ERP, CRM, sistemas de adquisición de datos industriales y plataformas de machine learning. Co-autor de plugin open-source con miles de descargas.</p><p>Sólida experiencia en diseño de bases de datos, automatización de pruebas, CI/CD y despliegue en AWS y Azure. Obsesionado por código limpio, optimización de rendimiento y arquitectura de software.</p>`,
      bioHtmlEn: `<p>Full Stack Developer with 5+ years of experience building scalable web solutions and enterprise applications. Specialized in <strong>React, Next.js, Laravel, NestJS</strong>, and microservices architecture.</p><p>Proven experience in ERP and CRM development, industrial data acquisition systems, and machine learning platforms. Co-author of an open-source plugin with thousands of downloads.</p><p>Strong background in database design, test automation, CI/CD pipelines, and deployment on AWS and Azure. Passionate about clean code, performance optimization, and software architecture.</p>`,
    },
  });

  // ─── CONTACT INFO ────────────────────────────────────────────────────────────
  console.log("📞 Creating contact info...");

  await prisma.contactInfo.deleteMany();
  const contactData = [
    {
      type: "email",
      value: "enyaoficial001@gmail.com",
      icon: "EnvelopeIcon",
      isHeroicon: true,
      order: 1,
    },
    { type: "phone", value: "(+52) 981-178-50-39", icon: "PhoneIcon", isHeroicon: true, order: 2 },
    { type: "location", value: "Campeche, México", icon: "MapPinIcon", isHeroicon: true, order: 3 },
    {
      type: "linkedin",
      value: "https://linkedin.com/in/yair-chan",
      icon: "LinkIcon",
      isHeroicon: true,
      order: 4,
    },
    {
      type: "github",
      value: "https://github.com/IYair",
      icon: "CodeBracketIcon",
      isHeroicon: true,
      order: 5,
    },
    {
      type: "twitter",
      value: "https://x.com/EnyaDev",
      icon: "ChatBubbleLeftEllipsisIcon",
      isHeroicon: true,
      order: 6,
    },
  ];

  for (const contact of contactData) {
    await prisma.contactInfo.create({ data: contact });
  }

  // ─── WORK EXPERIENCE ─────────────────────────────────────────────────────────
  console.log("💼 Creating work experience...");

  await prisma.workExperience.deleteMany();

  const workData = [
    {
      position: "Fullstack Developer",
      positionEn: "Fullstack Developer",
      company: "LOVLISOFT",
      startDate: "2023-11",
      endDate: null,
      order: 1,
      description: `- Desarrollo y mantenimiento de soluciones ERP empresariales con Laravel, Vue.js e Inertia.js para gestión de recursos financieros y operacionales.\n- Implementación de filtros de búsqueda avanzados y exportación de datos para conjuntos de más de 100,000 registros, mejorando la eficiencia de consultas en 60%.\n- Creación de módulos end-to-end incluyendo sistema de gestión de permisos basado en roles (RBAC) y funcionalidad de carga masiva de datos via CSV/Excel.\n- Liderazgo técnico del proyecto PLD (Prevención de Lavado de Dinero): diseño e implementación de lógica de evaluación de transacciones financieras y automatización de reportes regulatorios.\n- Configuración y despliegue de entornos dev, testing y producción con Docker.\n\n**Logros:** Reducción del 40% en tiempo de procesamiento de reportes financieros · Implementación exitosa del módulo PLD cumpliendo con regulaciones financieras mexicanas.`,
      descriptionEn: `- Development and maintenance of enterprise ERP solutions using Laravel, Vue.js, and Inertia.js for financial and operational resource management.\n- Implemented advanced search filters and data export for datasets of 100,000+ records, improving query efficiency by 60%.\n- Created end-to-end modules including RBAC permission management and bulk data loading via CSV/Excel.\n- Technical leadership of PLD (Anti-Money Laundering) project: designed and implemented financial transaction evaluation logic and automated regulatory reports.\n- Configured and deployed dev, testing, and production environments using Docker.\n\n**Achievements:** 40% reduction in financial report processing time · Successful PLD module implementation compliant with Mexican financial regulations.`,
      descriptionHtml: `<ul><li>Desarrollo y mantenimiento de soluciones ERP empresariales con <strong>Laravel, Vue.js e Inertia.js</strong> para gestión de recursos financieros y operacionales.</li><li>Implementación de filtros de búsqueda avanzados y exportación de datos para conjuntos de más de 100,000 registros, mejorando la eficiencia de consultas en <strong>60%</strong>.</li><li>Creación de módulos end-to-end incluyendo sistema de gestión de permisos RBAC y carga masiva de datos via CSV/Excel.</li><li>Liderazgo técnico del proyecto PLD: diseño e implementación de lógica de evaluación de transacciones financieras y automatización de reportes regulatorios.</li><li>Configuración y despliegue de entornos dev, testing y producción con Docker.</li></ul>`,
      descriptionHtmlEn: `<ul><li>Development and maintenance of enterprise ERP solutions using <strong>Laravel, Vue.js, and Inertia.js</strong>.</li><li>Advanced search filters and data export for 100,000+ record datasets, improving query efficiency by <strong>60%</strong>.</li><li>End-to-end modules including RBAC and bulk data loading via CSV/Excel.</li><li>Technical leadership of the PLD (Anti-Money Laundering) project.</li><li>Dev, testing, and production environments with Docker.</li></ul>`,
    },
    {
      position: "Ingeniero en Software",
      positionEn: "Software Engineer",
      company: "Grupo ICARUS S.A. de C.V.",
      startDate: "2022-11",
      endDate: "2023-11",
      order: 2,
      description: `- Desarrollo frontend de plataforma CRM empresarial con React y TypeScript, implementando diseño UX/UI responsive y componentes reutilizables.\n- Desarrollo y mantenimiento de API REST con C# y .NET Framework para múltiples módulos de microservicios, aplicando patrones Repository, Factory y Dependency Injection.\n- Creación de suite de pruebas automatizadas E2E con Selenium y Cucumber para módulos críticos, reduciendo bugs en producción.\n- Implementación de integraciones con servicios externos mediante REST APIs y webhooks.\n- Colaboración en equipo ágil con daily stand-ups y sprints de 4 semanas.\n\n**Logros:** Mejora del 35% en tiempo de respuesta frontend · Automatización de 80+ casos de prueba reduciendo tiempo de QA manual en 50%.`,
      descriptionEn: `- Frontend development of enterprise CRM platform with React and TypeScript, responsive UX/UI design, and reusable components.\n- Development and maintenance of REST API with C# and .NET Framework for multiple microservices modules, applying Repository, Factory, and DI patterns.\n- E2E automated test suite with Selenium and Cucumber for critical modules, reducing production bugs.\n- External service integrations via REST APIs and webhooks.\n- Agile team collaboration with daily stand-ups and 4-week sprints.\n\n**Achievements:** 35% improvement in frontend response time · Automated 80+ test cases reducing manual QA time by 50%.`,
      descriptionHtml: `<ul><li>Desarrollo frontend de plataforma CRM con <strong>React y TypeScript</strong>, diseño UX/UI responsive y componentes reutilizables.</li><li>API REST con <strong>C# y .NET Framework</strong> aplicando patrones Repository, Factory y Dependency Injection.</li><li>Suite de pruebas E2E con <strong>Selenium y Cucumber</strong> para módulos críticos de microservicios.</li><li>Integraciones con servicios externos mediante REST APIs y webhooks.</li><li>Equipo ágil con daily stand-ups y sprints de 4 semanas.</li></ul>`,
      descriptionHtmlEn: `<ul><li>Frontend development of enterprise CRM platform with <strong>React and TypeScript</strong>.</li><li>REST API with <strong>C# and .NET Framework</strong> using Repository, Factory, and DI patterns.</li><li>E2E test suite with <strong>Selenium and Cucumber</strong> for critical microservices modules.</li><li>External service integrations via REST APIs and webhooks.</li></ul>`,
    },
    {
      position: "Desarrollador Full Stack Freelancer",
      positionEn: "Freelance Full Stack Developer",
      company: "Fiverr",
      startDate: "2020-11",
      endDate: null,
      order: 3,
      description: `- Desarrollo de soluciones web personalizadas para 5+ clientes internacionales con Laravel, Vue.js, React.js y Next.js.\n- Creación de dashboard interactivo con Machine Learning para análisis de datos deportivos via Strava API, con visualizaciones en tiempo real y predicciones de rendimiento atlético.\n- Gestión completa del ciclo de vida de proyectos: levantamiento de requerimientos, arquitectura, desarrollo, testing y deployment.\n- Comunicación efectiva en inglés con clientes internacionales.\n\n**Logros:** 5 proyectos con calificación 5/5 estrellas · 100% de entregas dentro de plazos acordados.`,
      descriptionEn: `- Custom web solutions for 5+ international clients using Laravel, Vue.js, React.js, and Next.js.\n- Interactive ML dashboard for sports data analysis via Strava API, with real-time visualizations and athletic performance predictions.\n- Full project lifecycle management: requirements, architecture, development, testing, and deployment.\n- Effective communication in English with international clients.\n\n**Achievements:** 5 projects with 5/5 star rating · 100% on-time delivery.`,
      descriptionHtml: `<ul><li>Soluciones web personalizadas para 5+ clientes internacionales con <strong>Laravel, Vue.js, React.js y Next.js</strong>.</li><li>Dashboard interactivo con <strong>Machine Learning</strong> para análisis de datos deportivos via Strava API.</li><li>Gestión completa del ciclo de vida de proyectos.</li><li>Comunicación efectiva en inglés con clientes internacionales.</li></ul>`,
      descriptionHtmlEn: `<ul><li>Custom web solutions for 5+ international clients using <strong>Laravel, Vue.js, React.js, and Next.js</strong>.</li><li>Interactive <strong>Machine Learning</strong> dashboard for sports data analysis via Strava API.</li><li>Full project lifecycle management.</li></ul>`,
    },
  ];

  for (const work of workData) {
    await prisma.workExperience.create({ data: work });
  }

  // ─── EDUCATION ───────────────────────────────────────────────────────────────
  console.log("🎓 Creating education...");

  await prisma.education.deleteMany();
  await prisma.education.create({
    data: {
      institution: "Universidad Autónoma de Campeche",
      degree: "Ingeniería en Software",
      degreeEn: "Software Engineering",
      field: "Ingeniería en Software",
      fieldEn: "Software Engineering",
      startDate: "2017",
      endDate: "2022",
      order: 1,
    },
  });

  // ─── SKILLS ──────────────────────────────────────────────────────────────────
  console.log("⚡ Creating skills...");

  await prisma.skill.deleteMany();

  const BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

  const skillsData = [
    // Frontend
    { name: "React.js", icon: `${BASE}/react/react-original.svg`, category: "Frontend", order: 1 },
    { name: "Next.js", icon: `${BASE}/nextjs/nextjs-original.svg`, category: "Frontend", order: 2 },
    {
      name: "TypeScript",
      icon: `${BASE}/typescript/typescript-original.svg`,
      category: "Frontend",
      order: 3,
    },
    { name: "Vue.js", icon: `${BASE}/vuejs/vuejs-original.svg`, category: "Frontend", order: 4 },
    {
      name: "Tailwind CSS",
      icon: `${BASE}/tailwindcss/tailwindcss-original.svg`,
      category: "Frontend",
      order: 5,
    },
    { name: "Astro", icon: `${BASE}/astro/astro-original.svg`, category: "Frontend", order: 6 },
    { name: "Redux", icon: `${BASE}/redux/redux-original.svg`, category: "Frontend", order: 7 },
    {
      name: "Electron",
      icon: `${BASE}/electron/electron-original.svg`,
      category: "Frontend",
      order: 8,
    },
    // Backend
    { name: "Node.js", icon: `${BASE}/nodejs/nodejs-original.svg`, category: "Backend", order: 9 },
    { name: "NestJS", icon: `${BASE}/nestjs/nestjs-original.svg`, category: "Backend", order: 10 },
    {
      name: "Laravel",
      icon: `${BASE}/laravel/laravel-original.svg`,
      category: "Backend",
      order: 11,
    },
    { name: "PHP", icon: `${BASE}/php/php-original.svg`, category: "Backend", order: 12 },
    {
      name: "C# / .NET",
      icon: `${BASE}/csharp/csharp-original.svg`,
      category: "Backend",
      order: 13,
    },
    { name: "GraphQL", icon: `${BASE}/graphql/graphql-plain.svg`, category: "Backend", order: 14 },
    {
      name: "REST APIs",
      icon: `${BASE}/fastapi/fastapi-original.svg`,
      category: "Backend",
      order: 15,
    },
    // Database
    {
      name: "PostgreSQL",
      icon: `${BASE}/postgresql/postgresql-original.svg`,
      category: "Base de Datos",
      order: 16,
    },
    {
      name: "MySQL",
      icon: `${BASE}/mysql/mysql-original.svg`,
      category: "Base de Datos",
      order: 17,
    },
    {
      name: "MongoDB",
      icon: `${BASE}/mongodb/mongodb-original.svg`,
      category: "Base de Datos",
      order: 18,
    },
    {
      name: "SQL Server",
      icon: `${BASE}/microsoftsqlserver/microsoftsqlserver-original.svg`,
      category: "Base de Datos",
      order: 19,
    },
    // DevOps
    {
      name: "Docker",
      icon: `${BASE}/docker/docker-original.svg`,
      category: "DevOps & Cloud",
      order: 20,
    },
    {
      name: "AWS",
      icon: `${BASE}/amazonwebservices/amazonwebservices-original-wordmark.svg`,
      category: "DevOps & Cloud",
      order: 21,
    },
    {
      name: "Azure",
      icon: `${BASE}/azure/azure-original.svg`,
      category: "DevOps & Cloud",
      order: 22,
    },
    { name: "Git", icon: `${BASE}/git/git-original.svg`, category: "DevOps & Cloud", order: 23 },
    {
      name: "GitHub Actions",
      icon: `${BASE}/github/github-original.svg`,
      category: "DevOps & Cloud",
      order: 24,
    },
    // Testing
    {
      name: "Selenium",
      icon: `${BASE}/selenium/selenium-original.svg`,
      category: "Testing",
      order: 25,
    },
    {
      name: "Cucumber",
      icon: `${BASE}/cucumber/cucumber-plain.svg`,
      category: "Testing",
      order: 26,
    },
    { name: "Unit Testing", icon: `${BASE}/jest/jest-plain.svg`, category: "Testing", order: 27 },
    {
      name: "E2E Testing",
      icon: `${BASE}/playwright/playwright-original.svg`,
      category: "Testing",
      order: 28,
    },
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }

  console.log("✅ Seed completed successfully!");
  console.log(`   - 1 perfil de About creado`);
  console.log(`   - ${contactData.length} entradas de contacto`);
  console.log(`   - ${workData.length} experiencias laborales`);
  console.log(`   - 1 educación`);
  console.log(`   - ${skillsData.length} habilidades`);
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
