import { PrismaClient } from '../generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Detect if we're using local database
const isLocalDB = process.env.DATABASE_URL?.includes('localhost') ||
                  process.env.DATABASE_URL?.includes('127.0.0.1') ||
                  process.env.DATABASE_URL?.includes('::1')

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: isLocalDB
        ? // Local database - minimal config for best performance
          process.env.DATABASE_URL + '?connection_limit=5&pool_timeout=10'
        : // Remote database - high latency optimizations
          process.env.DATABASE_URL +
          '?connection_limit=10' +
          '&pool_timeout=20' +
          '&socket_timeout=60' +
          '&connect_timeout=300' +
          '&ssl={"rejectUnauthorized":false}',
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma