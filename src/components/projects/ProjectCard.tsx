import { Link } from "@/i18n/routing";
import SafeImage from "@/components/ui/SafeImage";
import { ArrowTopRightOnSquareIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  technologies: string[];
  featured: boolean;
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <div className="group border-foreground/10 bg-background hover:border-foreground/20 relative overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-2xl">
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
          <StarIcon className="h-3 w-3" />
          Destacado
        </div>
      )}

      {/* Image */}
      <Link href={`/projects/${project.slug}`}>
        <div className="bg-foreground/5 relative aspect-video overflow-hidden">
          {project.image ? (
            <SafeImage
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                  <CodeBracketIcon className="h-20 w-20 text-white opacity-50" />
                </div>
              }
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
              <CodeBracketIcon className="h-20 w-20 text-white opacity-50" />
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {project.title}
          </h3>
        </Link>

        <p className="text-foreground/70 mb-4 line-clamp-2 text-sm">
          {project.description || "Proyecto sin descripción"}
        </p>

        {/* Technologies */}
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="bg-foreground/5 text-foreground/60 rounded-full px-3 py-1 text-xs font-medium">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="border-foreground/10 flex items-center gap-4 border-t pt-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-1 text-sm font-medium text-indigo-600 transition-all hover:gap-2 dark:text-indigo-400"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              <span>Demo</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link text-foreground/60 hover:text-foreground flex items-center gap-1 text-sm font-medium transition-all hover:gap-2"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Código</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
