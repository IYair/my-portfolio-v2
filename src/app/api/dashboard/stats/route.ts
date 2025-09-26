import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('📊 Dashboard stats API called')

    // Simple parallel queries - no over-optimization
    const [
      postsCount,
      publishedPostsCount,
      projectsCount,
      featuredProjectsCount,
      contactsCount,
      unreadContactsCount,
      recentPosts,
      recentProjects,
      recentContacts
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.project.count(),
      prisma.project.count({ where: { featured: true } }),
      prisma.contact.count(),
      prisma.contact.count({ where: { read: false } }),

      prisma.post.findMany({
        select: { id: true, title: true, published: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),

      prisma.project.findMany({
        select: { id: true, title: true, featured: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 2,
      }),

      prisma.contact.findMany({
        select: { id: true, name: true, read: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 2,
      }),
    ])

    console.log('✅ Dashboard stats fetched successfully')

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
      }
    })

  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}