'use server'

import { getAvailableProviders } from '../providers/factory-v2'
import { getCurrentUser } from '../services/auth'
import { ProviderInfo } from '../providers/types'

/**
 * Get available providers for the current user
 * Falls back to environment-based providers if not authenticated
 */
export async function getProviders(): Promise<ProviderInfo[]> {
    try {
        console.log('[Action] Starting getProviders')
        console.log('[Action] Environment check:', {
            hasGoogle: !!process.env.GOOGLE_API_KEY,
            hasOpenRouter: !!process.env.OPENROUTER_API_KEY,
        })
        
        // Get current user (may be null if not authenticated)
        const user = await getCurrentUser()
        console.log('[Action] User:', user?.userId || 'anonymous')

        // Get providers with user context (falls back to env if no user)
        const providers = await getAvailableProviders(user?.userId)
        console.log('[Action] Providers found:', providers.length, providers.map(p => `${p.name}:${p.available}`))
        
        return providers
    } catch (error) {
        console.error('[Action] Failed to get providers:', error)
        return []
    }
}
