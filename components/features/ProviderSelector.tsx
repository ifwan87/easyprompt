'use client'

import React from 'react'
import { Select } from '@/components/ui/select'
import { ProviderInfo, ProviderType } from '@/lib/providers/types'
import { Server, Eye, Zap, Cloud, HardDrive, Loader2 } from 'lucide-react'

interface ProviderSelectorProps {
    providers: ProviderInfo[]
    selectedProvider: ProviderType
    selectedModel: string
    onProviderChange: (provider: ProviderType) => void
    onModelChange: (model: string) => void
    disabled?: boolean
    isLoading?: boolean
}

export function ProviderSelector({
    providers,
    selectedProvider,
    selectedModel,
    onProviderChange,
    onModelChange,
    disabled,
    isLoading,
}: ProviderSelectorProps) {
    const activeProvider = providers.find((p) => p.name === selectedProvider)
    const models = activeProvider?.models || []
    const selectedModelInfo = models.find((m) => m.id === selectedModel)

    return (
        <div className="space-y-4">
            {/* Header with icon */}
            <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gray-100">
                    <Server className="h-4 w-4 text-gray-700" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                    Provider & Model
                </h3>
                {isLoading && (
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                )}
            </div>

            {/* Selectors in Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
                {/* Provider Selector */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        Provider
                    </label>
                    <Select
                        value={selectedProvider}
                        onChange={(e) => onProviderChange(e.target.value as ProviderType)}
                        disabled={disabled || isLoading}
                        className="notion-input w-full text-sm font-medium text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {providers.map((provider) => (
                            <option
                                key={provider.name}
                                value={provider.name}
                                className="bg-white text-gray-900"
                            >
                                {provider.displayName} {!provider.available && '(Unavailable)'}
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Model Selector */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        Model
                    </label>
                    <Select
                        value={selectedModel}
                        onChange={(e) => onModelChange(e.target.value)}
                        disabled={disabled || models.length === 0 || isLoading}
                        className="notion-input w-full text-sm font-medium text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {models.map((model) => (
                            <option
                                key={model.id}
                                value={model.id}
                                className="bg-white text-gray-900"
                            >
                                {model.name}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Provider Info - Clean and organized */}
            {activeProvider && (
                <div className="pt-2 space-y-3">
                    {/* Model tier info */}
                    {selectedModelInfo && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Tier:</span>
                            <span className="notion-badge capitalize">
                                {selectedModelInfo.tier}
                            </span>
                        </div>
                    )}

                    {/* Provider metadata */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Category */}
                        <div className="notion-badge">
                            {activeProvider.category === 'commercial' ? (
                                <>
                                    <Cloud className="h-3 w-3" />
                                    <span>Commercial</span>
                                </>
                            ) : (
                                <>
                                    <HardDrive className="h-3 w-3" />
                                    <span>Open Source</span>
                                </>
                            )}
                        </div>

                        {/* Location */}
                        <div className="notion-badge capitalize">
                            {activeProvider.location === 'cloud' ? '☁️' : '💻'} {activeProvider.location}
                        </div>

                        {/* Vision capability */}
                        {activeProvider.capabilities.vision && (
                            <div className="notion-badge">
                                <Eye className="h-3 w-3" />
                                <span>Vision</span>
                            </div>
                        )}

                        {/* Streaming capability */}
                        {activeProvider.capabilities.streaming && (
                            <div className="notion-badge">
                                <Zap className="h-3 w-3" />
                                <span>Streaming</span>
                            </div>
                        )}

                        {/* Model count */}
                        <div className="notion-badge">
                            {activeProvider.models.length} {activeProvider.models.length === 1 ? 'model' : 'models'}
                        </div>
                    </div>

                    {/* Description if available */}
                    {activeProvider.description && (
                        <p className="text-sm text-gray-600 leading-relaxed pt-1">
                            {activeProvider.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
