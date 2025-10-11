import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SafeImage from "@/components/ui/SafeImage";
import { ArrowTopRightOnSquareIcon, CodeBracketIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { Link } from "@/i18n/routing";

// Revalidate every 60 seconds
export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

async function getProject(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      return null;
    }

    return {
      ...project,
      technologies: JSON.parse(project.technologies),
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

async function getRelatedProjects(currentProjectId: number, technologies: string[]) {
  try {
    // Get projects with similar technologies
    const allProjects = await prisma.project.findMany({
      where: {
        id: { not: currentProjectId },
      },
      take: 3,
      orderBy: { order: "asc" },
    });

    return allProjects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies),
    }));
  } catch (error) {
    console.error("Error fetching related projects:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Proyecto no encontrado",
    };
  }

  return {
    title: `${project.title} - Proyectos`,
    description: project.description || `Conoce más sobre el proyecto ${project.title}`,
    openGraph: {
      title: project.title,
      description: project.description || "",
      images: project.image ? [project.image] : [],
      type: "website",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(project.id, project.technologies);

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Back Button */}
        <Link
          href="/projects"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-foreground/60 transition-all hover:gap-3 hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a proyectos
        </Link>

        {/* Project Header */}
        <div className="mb-12">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                <span className="bg-gradient-to-b from-gray-300 to-gray-900 bg-clip-text text-transparent dark:from-white dark:to-gray-800">
                  {project.title}
                </span>
              </h1>
              {project.description && (
                <p className="text-xl leading-relaxed text-foreground/70">
                  {project.description}
                </p>
              )}
            </div>
            {project.featured && (
              <div className="ml-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                <StarIcon className="h-4 w-4" />
                Destacado
              </div>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                <ArrowTopRightOnSquareIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Ver Demo en Vivo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-foreground/20 bg-background px-6 py-3 font-medium transition-all hover:border-foreground/30 hover:bg-foreground/5"
              >
                <svg className="h-5 w-5 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Ver Código Fuente
              </a>
            )}
          </div>
        </div>

        {/* Project Image */}
        {project.image && (
          <div className="mb-12 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 shadow-2xl">
            <div className="relative aspect-video">
              <SafeImage
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                    <CodeBracketIcon className="h-32 w-32 text-white opacity-50" />
                  </div>
                }
              />
            </div>
          </div>
        )}

        {/* Project Details */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-foreground/10 bg-background p-8">
              <h2 className="mb-6 text-2xl font-bold">
                Acerca del Proyecto
              </h2>
              <div className="prose prose-gray max-w-none dark:prose-invert">
                {project.longDescription ? (
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground/80">
                    {project.longDescription}
                  </p>
                ) : (
                  <p className="text-foreground/80">
                    {project.description || "Sin descripción disponible."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Technologies */}
              <div className="rounded-xl border border-foreground/10 bg-background p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  Tecnologías Utilizadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Info */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  Información del Proyecto
                </h3>
                <div className="space-y-3 text-sm">
                  {project.demoUrl && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Estado:
                      </span>{" "}
                      <span className="text-green-600 dark:text-green-400">
                        En producción
                      </span>
                    </div>
                  )}
                  {project.featured && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Destacado:
                      </span>{" "}
                      <span className="text-yellow-600 dark:text-yellow-400">
                        ★ Proyecto destacado
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
              Proyectos Relacionados
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.slug}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {relatedProject.image ? (
                      <SafeImage
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        fallback={
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                            <CodeBracketIcon className="h-16 w-16 text-white opacity-50" />
                          </div>
                        }
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                        <CodeBracketIcon className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      {relatedProject.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                      {relatedProject.description || "Proyecto sin descripción"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
