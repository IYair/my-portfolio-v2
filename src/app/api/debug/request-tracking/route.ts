import { NextResponse } from 'next/server'

// Track concurrent requests
const activeRequests = new Map<string, { timestamp: number, source: string }>()

export async function GET(request: Request) {
  const url = new URL(request.url)
  const source = url.searchParams.get('source') || 'unknown'
  const requestId = Math.random().toString(36).substr(2, 9)

  // Log this request
  console.log(`📥 Request ${requestId} from ${source} - Active requests: ${activeRequests.size}`)

  // Show all active requests
  if (activeRequests.size > 0) {
    console.log('🔄 Currently active requests:')
    activeRequests.forEach((req, id) => {
      console.log(`  - ${id}: ${req.source} (${Date.now() - req.timestamp}ms ago)`)
    })
  }

  // Add this request to active list
  activeRequests.set(requestId, { timestamp: Date.now(), source })

  // Simulate some work
  await new Promise(resolve => setTimeout(resolve, 100))

  // Remove from active list
  activeRequests.delete(requestId)

  console.log(`📤 Request ${requestId} completed - Remaining active: ${activeRequests.size}`)

  return NextResponse.json({
    requestId,
    source,
    activeAtStart: activeRequests.size,
    timestamp: new Date().toISOString()
  })
}