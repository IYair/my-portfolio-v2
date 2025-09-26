import { prisma } from './prisma'

let warmupActive = false
let lastWarmup = 0

// Detect local DB for different warmup strategy
const isLocalDB = process.env.DATABASE_URL?.includes('localhost') ||
                  process.env.DATABASE_URL?.includes('127.0.0.1') ||
                  process.env.DATABASE_URL?.includes('::1')

const WARMUP_INTERVAL = isLocalDB ? 60 * 1000 : 20 * 1000 // Local: 60s, Remote: 20s

export async function warmupConnections() {
  if (warmupActive || Date.now() - lastWarmup < WARMUP_INTERVAL) {
    return // Skip if already warming up or recently warmed
  }

  warmupActive = true
  lastWarmup = Date.now()

  try {
    console.log(`🔥 Warming up ${isLocalDB ? 'local' : 'remote'} database connections...`)

    if (isLocalDB) {
      // Local DB: single simple query is enough
      await prisma.$executeRaw`SELECT 1`
    } else {
      // Remote DB: multiple connections for pool warmup
      await Promise.all([
        prisma.$executeRaw`SELECT 1`,
        prisma.$executeRaw`SELECT 1`,
        prisma.$executeRaw`SELECT 1`
      ])
    }

    console.log('✅ Database connections warmed up')
  } catch (error) {
    console.warn('⚠️ Connection warmup failed:', error)
  } finally {
    warmupActive = false
  }
}

// Auto-warmup in development
if (process.env.NODE_ENV === 'development') {
  // Initial warmup
  setTimeout(warmupConnections, 1000)

  // Periodic warmup
  setInterval(warmupConnections, WARMUP_INTERVAL)
}