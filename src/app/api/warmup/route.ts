import { NextResponse } from 'next/server'
import { warmupConnections } from '@/lib/db-warmup'

export async function GET() {
  try {
    await warmupConnections()
    return NextResponse.json({
      success: true,
      message: 'Database connections warmed up successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Warmup failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Warmup failed'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  // Same as GET, but allow POST requests
  return GET()
}