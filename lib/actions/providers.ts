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
        // Get current user (may be null if not authenticated)
        const user = await getCurrentUser()

        // Get providers with user context (falls back to env if no user)
        return await getAvailableProviders(user?.userId)
    } catch (error) {
        console.error('[Action] Failed to get providers:', error)
        return []
    }
}
