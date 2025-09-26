import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const testId = Math.random().toString(36).substr(2, 9)
  console.log(`🔍 DB Test ${testId} - Starting diagnostics`)

  try {
    const results: any = {}

    // Test 1: Simple connection test
    console.time(`Connection Test ${testId}`)
    const connectionTest = await prisma.$executeRaw`SELECT 1 as test`
    console.timeEnd(`Connection Test ${testId}`)
    results.connectionTest = { success: true, result: connectionTest }

    // Test 2: Single count query
    console.time(`Single Count ${testId}`)
    const postsCount = await prisma.post.count()
    console.timeEnd(`Single Count ${testId}`)
    results.singleCount = { posts: postsCount }

    // Test 3: Multiple individual counts (not in parallel)
    console.time(`Sequential Counts ${testId}`)
    const postsCountSeq = await prisma.post.count()
    const projectsCountSeq = await prisma.project.count()
    const contactsCountSeq = await prisma.contact.count()
    console.timeEnd(`Sequential Counts ${testId}`)
    results.sequentialCounts = {
      posts: postsCountSeq,
      projects: projectsCountSeq,
      contacts: contactsCountSeq
    }

    // Test 4: Multiple parallel counts (same as original)
    console.time(`Parallel Counts ${testId}`)
    const [postsCountPar, projectsCountPar, contactsCountPar] = await Promise.all([
      prisma.post.count(),
      prisma.project.count(),
      prisma.contact.count()
    ])
    console.timeEnd(`Parallel Counts ${testId}`)
    results.parallelCounts = {
      posts: postsCountPar,
      projects: projectsCountPar,
      contacts: contactsCountPar
    }

    // Test 5: Simple findMany with limit
    console.time(`Simple FindMany ${testId}`)
    const posts = await prisma.post.findMany({
      select: { id: true, title: true },
      take: 3
    })
    console.timeEnd(`Simple FindMany ${testId}`)
    results.findMany = { postsFound: posts.length }

    // Test 6: Database info
    console.time(`DB Info ${testId}`)
    const dbInfo = await prisma.$executeRaw`SELECT VERSION() as version, NOW() as server_time`
    console.timeEnd(`DB Info ${testId}`)
    results.dbInfo = dbInfo

    console.log(`✅ DB Test ${testId} - All tests completed successfully`)

    return NextResponse.json({
      success: true,
      testId,
      message: "Database diagnostics completed - check server logs for timing details",
      results
    })

  } catch (error) {
    console.error(`❌ DB Test ${testId} - Error:`, error)
    return NextResponse.json({
      success: false,
      testId,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "Database diagnostics failed"
    }, { status: 500 })
  }
}