/**
 * Provider Factory V2 - Per-User Configuration Support
 *
 * This is a refactored version of the provider factory that supports:
 * - Per-user provider configurations from database
 * - Fallback to environment variables for backward compatibility
 * - Per-request provider instances (no singleton)
 * - User-specific API keys and endpoints
 *
 * Key differences from V1:
 * - No singleton pattern
 * - Providers created per-request with user context
 * - Credentials from database or environment
 * - Better isolation between users
 */

import { AIProvider } from './base'
import { ProviderType, ProviderInfo, HealthStatus } from './types'
import { ProviderUnavailableError } from './errors'
import { getProviderCredentialsWithFallback } from '@/lib/services/provider-config'

// Import provider classes
import { AnthropicProvider } from './commercial/anthropic'
import { OpenAIProvider } from './commercial/openai'
import { GoogleProvider } from './commercial/google'
import { KimiProvider } from './commercial/kimi'
import { OllamaProvider } from './open-source/ollama'

/**
 * Provider configuration for instantiation
 */
interface ProviderConfig {
    apiKey?: string
    endpoint?: string
}

/**
 * Create a provider instance with custom configuration
 *
 * @param providerName - Name of the provider to create
 * @param config - Configuration (API key, endpoint, etc.)
 * @returns Configured provider instance
 */
function createProviderInstance(
    providerName: ProviderType,
    config: ProviderConfig
): AIProvider {
    switch (providerName) {
        case 'anthropic':
            return new AnthropicProvider(config.apiKey)
        case 'openai':
            return new OpenAIProvider(config.apiKey)
        case 'google':
            return new GoogleProvider(config.apiKey)
        case 'kimi':
            return new KimiProvider(config.apiKey)
        case 'ollama':
            return new OllamaProvider(config.endpoint)
        default:
            throw new ProviderUnavailableError(
                providerName,
                `Provider '${providerName}' is not supported`
            )
    }
}

/**
 * Get a provider instance configured for a specific user
 * Falls back to environment variables if no user config exists
 *
 * @param providerName - Name of the provider
 * @param userId - User ID (optional - will use env vars if not provided)
 * @returns Configured provider instance
 */
export async function getProvider(
    providerName: ProviderType,
    userId?: string
): Promise<AIProvider> {
    // Get credentials from database or environment
    const credentials = await getProviderCredentialsWithFallback(providerName, userId)

    // Create provider instance with credentials
    const provider = createProviderInstance(providerName, {
        apiKey: credentials.apiKey || undefined,
        endpoint: credentials.endpoint || undefined,
    })

    return provider
}

/**
 * Get all available providers for a user
 * Checks both database and environment configurations
 *
 * @param userId - User ID (optional)
 * @returns Array of available provider info
 */
export async function getAvailableProviders(userId?: string): Promise<ProviderInfo[]> {
    const providerNames: ProviderType[] = ['anthropic', 'openai', 'google', 'kimi', 'ollama']

    const results = await Promise.all(
        providerNames.map(async (providerName) => {
            try {
                // Get provider instance for this user
                const provider = await getProvider(providerName, userId)

                // Check if provider is available (has credentials)
                const isAvailable = provider.isAvailable()
                let health: HealthStatus = { available: false, latency: 0 }

                if (isAvailable) {
                    try {
                        health = await provider.healthCheck()
                    } catch (e) {
                        console.error(`Health check failed for ${providerName}:`, e)
                    }
                }

                return {
                    ...provider.metadata,
                    models: provider.models,
                    capabilities: provider.capabilities,
                    available: isAvailable && health.available,
                    latency: health.latency,
                }
            } catch (error) {
                console.error(`Failed to load provider ${providerName}:`, error)
                // Return unavailable provider info
                const tempProvider = createProviderInstance(providerName, {})
                return {
                    ...tempProvider.metadata,
                    models: tempProvider.models,
                    capabilities: tempProvider.capabilities,
                    available: false,
                    latency: 0,
                }
            }
        })
    )

    return results
}

/**
 * Check if a provider is available for a user
 *
 * @param providerName - Name of the provider
 * @param userId - User ID (optional)
 * @returns true if provider is available and healthy
 */
export async function isProviderAvailable(
    providerName: ProviderType,
    userId?: string
): Promise<boolean> {
    try {
        const provider = await getProvider(providerName, userId)
        if (!provider.isAvailable()) {
            return false
        }

        const health = await provider.healthCheck()
        return health.available
    } catch (error) {
        return false
    }
}

/**
 * Get provider metadata without creating full instance
 * Useful for UI display
 *
 * @param providerName - Name of the provider
 * @returns Provider metadata
 */
export function getProviderMetadata(providerName: ProviderType) {
    const tempProvider = createProviderInstance(providerName, {})
    return tempProvider.metadata
}

/**
 * Get all supported provider names
 *
 * @returns Array of provider names
 */
export function getSupportedProviders(): ProviderType[] {
    return ['anthropic', 'openai', 'google', 'kimi', 'ollama']
}
