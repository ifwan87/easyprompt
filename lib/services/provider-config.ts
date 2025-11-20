/**
 * Provider Configuration Service
 *
 * Manages user-specific provider configurations with encrypted API keys.
 * Handles CRUD operations and provides fallback to environment variables.
 */

'use server'

import { prisma } from '@/lib/db/prisma'
import { encrypt, decrypt, EncryptedData } from '@/lib/security/encryption'
import { ProviderConfig } from '@prisma/client'
import { ProviderType } from '@/lib/providers/types'

/**
 * Provider configuration (without encrypted fields exposed)
 */
export interface ProviderConfigData {
    id: string
    providerName: string
    displayName: string | null
    isEnabled: boolean
    hasApiKey: boolean
    hasEndpoint: boolean
    createdAt: Date
    updatedAt: Date
    lastUsedAt: Date | null
}

/**
 * Decrypted provider credentials
 */
export interface ProviderCredentials {
    apiKey: string | null
    endpoint: string | null
}

/**
 * Save or update provider configuration for a user
 *
 * @param userId - User ID
 * @param providerName - Provider name (e.g., 'anthropic', 'openai')
 * @param apiKey - API key (will be encrypted)
 * @param endpoint - Custom endpoint URL (optional, will be encrypted)
 * @param displayName - User-friendly name (optional)
 * @returns Created/updated provider config
 */
export async function saveProviderConfig(
    userId: string,
    providerName: ProviderType,
    apiKey?: string,
    endpoint?: string,
    displayName?: string
): Promise<ProviderConfig> {
    // Encrypt API key if provided
    let encryptedApiKey: EncryptedData | null = null
    if (apiKey) {
        encryptedApiKey = encrypt(apiKey)
    }

    // Encrypt endpoint if provided
    let encryptedEndpoint: EncryptedData | null = null
    if (endpoint) {
        encryptedEndpoint = encrypt(endpoint)
    }

    // Upsert (create or update)
    const config = await prisma.providerConfig.upsert({
        where: {
            userId_providerName: {
                userId,
                providerName,
            },
        },
        create: {
            userId,
            providerName,
            displayName: displayName || null,
            encryptedApiKey: encryptedApiKey?.encrypted || null,
            apiKeyIv: encryptedApiKey?.iv || null,
            apiKeyAuthTag: encryptedApiKey?.authTag || null,
            encryptedEndpoint: encryptedEndpoint?.encrypted || null,
            endpointIv: encryptedEndpoint?.iv || null,
            endpointAuthTag: encryptedEndpoint?.authTag || null,
            isEnabled: true,
        },
        update: {
            displayName: displayName || null,
            ...(encryptedApiKey && {
                encryptedApiKey: encryptedApiKey.encrypted,
                apiKeyIv: encryptedApiKey.iv,
                apiKeyAuthTag: encryptedApiKey.authTag,
            }),
            ...(encryptedEndpoint && {
                encryptedEndpoint: encryptedEndpoint.encrypted,
                endpointIv: encryptedEndpoint.iv,
                endpointAuthTag: encryptedEndpoint.authTag,
            }),
            updatedAt: new Date(),
        },
    })

    return config
}

/**
 * Get all provider configurations for a user
 * (returns sanitized data without decrypted keys)
 *
 * @param userId - User ID
 * @returns Array of provider configs (without decrypted sensitive data)
 */
export async function getUserProviderConfigs(userId: string): Promise<ProviderConfigData[]> {
    const configs = await prisma.providerConfig.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })

    return configs.map((config) => ({
        id: config.id,
        providerName: config.providerName,
        displayName: config.displayName,
        isEnabled: config.isEnabled,
        hasApiKey: !!config.encryptedApiKey,
        hasEndpoint: !!config.encryptedEndpoint,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
        lastUsedAt: config.lastUsedAt,
    }))
}

/**
 * Get decrypted credentials for a specific provider
 * This is the ONLY function that decrypts sensitive data
 *
 * @param userId - User ID
 * @param providerName - Provider name
 * @returns Decrypted credentials or null if not found
 */
export async function getProviderCredentials(
    userId: string,
    providerName: ProviderType
): Promise<ProviderCredentials | null> {
    const config = await prisma.providerConfig.findUnique({
        where: {
            userId_providerName: {
                userId,
                providerName,
            },
        },
    })

    if (!config || !config.isEnabled) {
        return null
    }

    // Decrypt API key if exists
    let apiKey: string | null = null
    if (config.encryptedApiKey && config.apiKeyIv && config.apiKeyAuthTag) {
        try {
            apiKey = decrypt({
                encrypted: config.encryptedApiKey,
                iv: config.apiKeyIv,
                authTag: config.apiKeyAuthTag,
            })
        } catch (error) {
            console.error(`Failed to decrypt API key for ${providerName}:`, error)
            // Don't throw - return null and let caller handle fallback
        }
    }

    // Decrypt endpoint if exists
    let endpoint: string | null = null
    if (config.encryptedEndpoint && config.endpointIv && config.endpointAuthTag) {
        try {
            endpoint = decrypt({
                encrypted: config.encryptedEndpoint,
                iv: config.endpointIv,
                authTag: config.endpointAuthTag,
            })
        } catch (error) {
            console.error(`Failed to decrypt endpoint for ${providerName}:`, error)
        }
    }

    // Update last used timestamp
    await prisma.providerConfig.update({
        where: { id: config.id },
        data: { lastUsedAt: new Date() },
    }).catch((error) => {
        // Non-critical operation, just log error
        console.error('Failed to update lastUsedAt:', error)
    })

    return {
        apiKey,
        endpoint,
    }
}

/**
 * Get provider credentials with fallback to environment variables
 * This is the primary function used by the provider factory
 *
 * @param userId - User ID (optional - if not provided, only checks env)
 * @param providerName - Provider name
 * @returns Credentials object with apiKey and endpoint
 */
export async function getProviderCredentialsWithFallback(
    providerName: ProviderType,
    userId?: string
): Promise<ProviderCredentials> {
    // Try database first if userId provided
    if (userId) {
        const dbCredentials = await getProviderCredentials(userId, providerName)
        if (dbCredentials && dbCredentials.apiKey) {
            return dbCredentials
        }
    }

    // Fallback to environment variables
    const envKeyName = `${providerName.toUpperCase()}_API_KEY`
    const envEndpointName = `${providerName.toUpperCase()}_ENDPOINT`

    return {
        apiKey: process.env[envKeyName] || null,
        endpoint: process.env[envEndpointName] || null,
    }
}

/**
 * Toggle provider enabled status
 *
 * @param userId - User ID
 * @param configId - Provider config ID
 * @param isEnabled - New enabled status
 * @returns Updated config
 */
export async function toggleProviderConfig(
    userId: string,
    configId: string,
    isEnabled: boolean
): Promise<ProviderConfig> {
    return await prisma.providerConfig.update({
        where: {
            id: configId,
            userId, // Ensure user can only modify their own configs
        },
        data: { isEnabled },
    })
}

/**
 * Delete a provider configuration
 *
 * @param userId - User ID
 * @param configId - Provider config ID
 * @returns true if deleted, false if not found
 */
export async function deleteProviderConfig(userId: string, configId: string): Promise<boolean> {
    try {
        await prisma.providerConfig.delete({
            where: {
                id: configId,
                userId, // Ensure user can only delete their own configs
            },
        })
        return true
    } catch (error) {
        console.error('Delete provider config error:', error)
        return false
    }
}

/**
 * Check if a user has any provider configured
 *
 * @param userId - User ID
 * @returns true if user has at least one enabled provider
 */
export async function hasConfiguredProviders(userId: string): Promise<boolean> {
    const count = await prisma.providerConfig.count({
        where: {
            userId,
            isEnabled: true,
            OR: [
                { encryptedApiKey: { not: null } },
                { encryptedEndpoint: { not: null } },
            ],
        },
    })

    return count > 0
}
