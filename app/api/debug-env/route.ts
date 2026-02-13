import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        hasGoogle: !!process.env.GOOGLE_API_KEY,
        hasOpenRouter: !!process.env.OPENROUTER_API_KEY,
        hasDatabase: !!process.env.DATABASE_URL,
        hasRateLimit: !!process.env.USE_MEMORY_RATE_LIMIT,
    })
}
