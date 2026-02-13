'use client'

import { useState, useEffect } from 'react'
import { ProviderInfo, ProviderType } from '@/lib/providers/types'
import { getProviders } from '@/lib/actions/providers'

export function useProvider() {
    const [providers, setProviders] = useState<ProviderInfo[]>([])
    const [selectedProvider, setSelectedProvider] = useState<ProviderType>('google')
    const [selectedModel, setSelectedModel] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchProviders() {
            try {
                const data = await getProviders()
                setProviders(data)

                // Set defaults - prefer Google if available, then OpenRouter
                if (data.length > 0) {
                    const googleProvider = data.find(p => p.name === 'google' && p.available)
                    const openRouterProvider = data.find(p => p.name === 'openrouter' && p.available)
                    const defaultProvider = googleProvider || openRouterProvider || data.find(p => p.available) || data[0]
                    if (defaultProvider) {
                        setSelectedProvider(defaultProvider.name)
                        if (defaultProvider.models.length > 0) {
                            setSelectedModel(defaultProvider.models[0]?.id || '')
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch providers:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProviders()
    }, [])

    // Update model when provider changes
    const handleProviderChange = (providerName: ProviderType) => {
        setSelectedProvider(providerName)
        const provider = providers.find(p => p.name === providerName)
        if (provider) { // Check for provider existence
            if (provider.models.length > 0) {
                setSelectedModel(provider.models[0]?.id || '')
            } else {
                setSelectedModel('')
            }
        } else {
            setSelectedModel('')
        }
    }

    return {
        providers,
        selectedProvider,
        selectedModel,
        setSelectedModel,
        handleProviderChange,
        isLoading,
    }
}
