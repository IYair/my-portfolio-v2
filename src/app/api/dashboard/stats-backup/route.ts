import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { warmupConnections } from '@/lib/db-warmup'

// Simple in-memory cache
let cachedStats: any = null
let cacheTimestamp = 0
const CACHE_DURATION = 30 * 1000 // 30 segundos

// Request deduplication - prevent multiple simultaneous requests
let activeRequest: Promise<any> | null = null

export async function GET(request: Request) {
  try {
    const now = Date.now()
    const queryId = Math.random().toString(36).substr(2, 9)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'no-referer'

    console.log(`🔍 Dashboard Stats Request ${queryId}`)
    console.log(`  User-Agent: ${userAgent.substring(0, 50)}...`)
    console.log(`  Referer: ${referer}`)
    console.log(`  Current time: ${new Date().toISOString()}`)

    // Check cache first
    if (cachedStats && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log(`🚀 Cache HIT ${queryId} - Returning cached data (${Math.round((now - cacheTimestamp)/1000)}s old)`)
      return NextResponse.json(cachedStats)
    }

    // Request deduplication - if there's already an active request, wait for it
    if (activeRequest) {
      console.log(`🔄 DEDUPLICATION ${queryId} - Waiting for active request`)
      const result = await activeRequest
      console.log(`✅ DEDUPLICATION ${queryId} - Got result from active request`)
      return NextResponse.json(result)
    }

    console.log(`💾 Cache MISS - Fetching fresh data (query ${queryId})`)

    // Create the data fetching promise
    activeRequest = fetchFreshData(queryId)

    try {
      const result = await activeRequest

      // Cache the result
      cachedStats = result
      cacheTimestamp = now

      console.log(`✅ Fresh data cached for ${CACHE_DURATION/1000}s`)
      return NextResponse.json(result)
    } finally {
      // Clear active request
      activeRequest = null
    }

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    activeRequest = null
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

async function fetchFreshData(queryId: string) {
  console.time(`Dashboard Stats Query ${queryId}`)

  // Warm up connections proactively
  warmupConnections()

  // Usar $transaction para hacer todas las consultas en una sola conexión DB
  const result = await prisma.$transaction(async (tx) => {
    console.time(`Individual Queries ${queryId}`)

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
      // Conteos básicos - mucho más rápido que hacer findMany
      tx.post.count(),
      tx.post.count({ where: { published: true } }),
      tx.project.count(),
      tx.project.count({ where: { featured: true } }),
      tx.contact.count(),
      tx.contact.count({ where: { read: false } }),

      // Solo obtener datos mínimos para actividad reciente
      tx.post.findMany({
        select: {
          id: true,
          title: true,
          published: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),

      tx.project.findMany({
        select: {
          id: true,
          title: true,
          featured: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 2,
      }),

      tx.contact.findMany({
        select: {
          id: true,
          name: true,
          read: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 2,
      }),
    ])

    console.timeEnd(`Individual Queries ${queryId}`)

    return {
      postsCount,
      publishedPostsCount,
      projectsCount,
      featuredProjectsCount,
      contactsCount,
      unreadContactsCount,
      recentPosts,
      recentProjects,
      recentContacts
    }
  })

  console.timeEnd(`Dashboard Stats Query ${queryId}`)

  return {
    stats: {
      posts: result.postsCount,
      publishedPosts: result.publishedPostsCount,
      projects: result.projectsCount,
      featuredProjects: result.featuredProjectsCount,
      contacts: result.contactsCount,
      unreadContacts: result.unreadContactsCount,
    },
    recentActivity: {
      posts: result.recentPosts,
      projects: result.recentProjects,
      contacts: result.recentContacts,
    }
  }
}