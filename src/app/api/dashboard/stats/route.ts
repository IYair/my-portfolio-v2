import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Run all count queries in parallel to minimize total response time
    const [
      postsCount,
      publishedPostsCount,
      projectsCount,
      featuredProjectsCount,
      contactsCount,
      unreadContactsCount,
      recentPosts,
      recentProjects,
      recentContacts,
    ] = await Promise.all([
      prisma.post.count().catch(() => 0),
      prisma.post.count({ where: { published: true } }).catch(() => 0),
      prisma.project.count().catch(() => 0),
      prisma.project.count({ where: { featured: true } }).catch(() => 0),
      prisma.contact.count().catch(() => 0),
      prisma.contact.count({ where: { read: false } }).catch(() => 0),
      prisma.post
        .findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, title: true, published: true, createdAt: true },
        })
        .catch(() => []),
      prisma.project
        .findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, title: true, featured: true, createdAt: true },
        })
        .catch(() => []),
      prisma.contact
        .findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, name: true, read: true, createdAt: true },
        })
        .catch(() => []),
    ]);

    return NextResponse.json({
      stats: {
        posts: postsCount,
        publishedPosts: publishedPostsCount,
        projects: projectsCount,
        featuredProjects: featuredProjectsCount,
        contacts: contactsCount,
        unreadContacts: unreadContactsCount,
      },
      recentActivity: {
        posts: recentPosts,
        projects: recentProjects,
        contacts: recentContacts,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
