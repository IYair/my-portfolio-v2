import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("📊 Starting dashboard stats fetch...");

    // Set a much shorter timeout and only get essential stats
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Stats timeout after 8 seconds")), 8000)
    );

    const statsPromise = async () => {
      // Execute queries sequentially to reduce database load
      console.log("📝 Fetching posts stats...");
      const postsCount = await prisma.post.count().catch(() => 0);
      const publishedPostsCount = await prisma.post
        .count({ where: { published: true } })
        .catch(() => 0);

      console.log("🎨 Fetching projects stats...");
      const projectsCount = await prisma.project.count().catch(() => 0);
      const featuredProjectsCount = await prisma.project
        .count({ where: { featured: true } })
        .catch(() => 0);

      console.log("📧 Fetching contacts stats...");
      const contactsCount = await prisma.contact.count().catch(() => 0);
      const unreadContactsCount = await prisma.contact
        .count({ where: { read: false } })
        .catch(() => 0);

      return {
        posts: postsCount,
        publishedPosts: publishedPostsCount,
        projects: projectsCount,
        featuredProjects: featuredProjectsCount,
        contacts: contactsCount,
        unreadContacts: unreadContactsCount,
      };
    };

    const stats = (await Promise.race([statsPromise(), timeoutPromise])) as any;

    console.log("✅ Dashboard stats fetched successfully");

    return NextResponse.json({
      stats,
      // Remove recent activity for now to improve performance
      recentActivity: {
        posts: [],
        projects: [],
        contacts: [],
      },
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
