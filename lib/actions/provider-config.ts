/**
 * Provider Configuration Server Actions
 *
 * Public-facing actions for managing provider configurations.
 * All actions require authentication and operate on the current user's data.
 */

'use server'

import { requireAuth } from '@/lib/services/auth'
import {
    saveProviderConfig as saveProviderConfigService,
    getUserProviderConfigs,
    toggleProviderConfig as toggleProviderConfigService,
    deleteProviderConfig as deleteProviderConfigService,
    ProviderConfigData,
} from '@/lib/services/provider-config'
import { ProviderType } from '@/lib/providers/types'
import { revalidatePath } from 'next/cache'

/**
 * Result type for provider config operations
 */
export interface ProviderConfigResult {
    success: boolean
    error?: string
    data?: ProviderConfigData
}

/**
 * Save or update a provider configuration
 *
 * @param providerName - Provider name (e.g., 'anthropic', 'openai')
 * @param apiKey - API key (optional - only update if provided)
 * @param endpoint - Custom endpoint (optional - for Ollama, etc.)
 * @param displayName - User-friendly name (optional)
 * @returns Result with success status
 */
export async function saveProviderConfig(
    providerName: ProviderType,
    apiKey?: string,
    endpoint?: string,
    displayName?: string
): Promise<ProviderConfigResult> {
    try {
        // Require authentication
        const { userId } = await requireAuth()

        // Validate inputs
        if (!providerName) {
            return {
                success: false,
                error: 'Provider name is required',
            }
        }

        if (!apiKey && !endpoint) {
            return {
                success: false,
                error: 'Either API key or endpoint must be provided',
            }
        }

        // Save configuration
        await saveProviderConfigService(userId, providerName, apiKey, endpoint, displayName)

        // Revalidate pages that use provider data
        revalidatePath('/settings')
        revalidatePath('/settings/providers')
        revalidatePath('/')

        return {
            success: true,
        }
    } catch (error) {
        console.error('Save provider config error:', error)

        if (error instanceof Error && error.message === 'Authentication required') {
            return {
                success: false,
                error: 'You must be logged in to save provider configurations',
            }
        }

        return {
            success: false,
            error: 'Failed to save provider configuration. Please try again.',
        }
    }
}

/**
 * Get all provider configurations for the current user
 *
 * @returns Array of provider configs (without decrypted sensitive data)
 */
export async function getProviderConfigs(): Promise<ProviderConfigData[]> {
    try {
        // Require authentication
        const { userId } = await requireAuth()

        // Get configs
        const configs = await getUserProviderConfigs(userId)

        return configs
    } catch (error) {
        console.error('Get provider configs error:', error)
        return []
    }
}

/**
 * Toggle a provider configuration enabled/disabled
 *
 * @param configId - Provider config ID
 * @param isEnabled - New enabled status
 * @returns Result with success status
 */
export async function toggleProviderConfig(
    configId: string,
    isEnabled: boolean
): Promise<ProviderConfigResult> {
    try {
        // Require authentication
        const { userId } = await requireAuth()

        // Validate input
        if (!configId) {
            return {
                success: false,
                error: 'Configuration ID is required',
            }
        }

        // Toggle configuration
        await toggleProviderConfigService(userId, configId, isEnabled)

        // Revalidate pages
        revalidatePath('/settings')
        revalidatePath('/settings/providers')
        revalidatePath('/')

        return {
            success: true,
        }
    } catch (error) {
        console.error('Toggle provider config error:', error)

        if (error instanceof Error && error.message === 'Authentication required') {
            return {
                success: false,
                error: 'You must be logged in to modify provider configurations',
            }
        }

        return {
            success: false,
            error: 'Failed to update provider configuration. Please try again.',
        }
    }
}

/**
 * Delete a provider configuration
 *
 * @param configId - Provider config ID
 * @returns Result with success status
 */
export async function deleteProviderConfig(configId: string): Promise<ProviderConfigResult> {
    try {
        // Require authentication
        const { userId } = await requireAuth()

        // Validate input
        if (!configId) {
            return {
                success: false,
                error: 'Configuration ID is required',
            }
        }

        // Delete configuration
        const deleted = await deleteProviderConfigService(userId, configId)

        if (!deleted) {
            return {
                success: false,
                error: 'Configuration not found or already deleted',
            }
        }

        // Revalidate pages
        revalidatePath('/settings')
        revalidatePath('/settings/providers')
        revalidatePath('/')

        return {
            success: true,
        }
    } catch (error) {
        console.error('Delete provider config error:', error)

        if (error instanceof Error && error.message === 'Authentication required') {
            return {
                success: false,
                error: 'You must be logged in to delete provider configurations',
            }
        }

        return {
            success: false,
            error: 'Failed to delete provider configuration. Please try again.',
        }
    }
}
