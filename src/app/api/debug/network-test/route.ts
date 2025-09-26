import { NextResponse } from 'next/server'

export async function GET() {
  const testId = Math.random().toString(36).substr(2, 9)
  console.log(`🌐 Network Test ${testId} - Starting diagnostics`)

  try {
    const results: any = {}

    // Test 1: Ping AWS Mexico Central
    console.time(`AWS MX Central HTTP ${testId}`)
    try {
      const awsResponse = await fetch('https://ec2.mx-central-1.amazonaws.com', {
        method: 'HEAD',
        signal: AbortSignal.timeout(10000)
      })
      results.awsMXCentral = {
        status: awsResponse.status,
        success: awsResponse.ok
      }
    } catch (error) {
      results.awsMXCentral = {
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
    console.timeEnd(`AWS MX Central HTTP ${testId}`)

    // Test 2: DNS resolution timing
    console.time(`DNS Resolution ${testId}`)
    try {
      // This will test if DNS resolution is slow
      await fetch('https://httpbin.org/ip', {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      })
      results.dnsTest = { success: true }
    } catch (error) {
      results.dnsTest = {
        error: error instanceof Error ? error.message : 'DNS error'
      }
    }
    console.timeEnd(`DNS Resolution ${testId}`)

    // Test 3: Local computation baseline
    console.time(`Local Computation ${testId}`)
    let sum = 0
    for (let i = 0; i < 1000000; i++) {
      sum += Math.random()
    }
    console.timeEnd(`Local Computation ${testId}`)
    results.localComputation = { result: sum }

    console.log(`✅ Network Test ${testId} - Completed`)

    return NextResponse.json({
      success: true,
      testId,
      message: "Network diagnostics completed - check server logs for timing details",
      timestamp: new Date().toISOString(),
      location: "Your server location",
      results
    })

  } catch (error) {
    console.error(`❌ Network Test ${testId} - Error:`, error)
    return NextResponse.json({
      success: false,
      testId,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}