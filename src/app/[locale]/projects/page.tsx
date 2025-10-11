import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProjectCard from "@/components/projects/ProjectCard";
import { prisma } from "@/lib/prisma";
import { Meteors } from "@/components/ui/meteors";

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("projects");

  return {
    title: `${t("title")} - Yair Chan`,
    description: t("description"),
    openGraph: {
      title: `${t("title")} - Yair Chan`,
      description: t("description"),
      type: "website",
    },
  };
}

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });

    return projects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies),
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

async function getFeaturedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 6,
    });

    return projects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies),
    }));
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const t = await getTranslations("projects");
  const [allProjects, featuredProjects] = await Promise.all([
    getProjects(),
    getFeaturedProjects(),
  ]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section with Meteors */}
      <section className="relative flex min-h-[60vh] w-full flex-col items-center justify-center overflow-hidden">
        <Meteors number={20} maxDuration={10} />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              <span className="bg-gradient-to-b from-gray-300 to-gray-900 bg-clip-text text-transparent dark:from-white dark:to-gray-800">
                {t("title")}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-500 dark:text-gray-300">
              {t("pageDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="relative z-20 bg-foreground/5 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12">
              <h2 className="mb-4 text-3xl font-bold">
                {t("featured")}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects */}
      <section className="relative z-20 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold">
              {t("allProjects")}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
          </div>

          {allProjects.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {allProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-foreground/10 bg-background p-12 text-center">
              <p className="text-foreground/60">
                {t("noProjects")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
