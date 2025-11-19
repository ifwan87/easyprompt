'use client'

import { Select } from '@/components/ui/select'
import { ProviderInfo, ProviderType } from '@/lib/providers/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Server } from 'lucide-react'

interface ProviderSelectorProps {
    providers: ProviderInfo[]
    selectedProvider: ProviderType
    selectedModel: string
    onProviderChange: (provider: ProviderType) => void
    onModelChange: (model: string) => void
    disabled?: boolean
}

export function ProviderSelector({
    providers,
    selectedProvider,
    selectedModel,
    onProviderChange,
    onModelChange,
    disabled,
}: ProviderSelectorProps) {
    const activeProvider = providers.find((p) => p.name === selectedProvider)
    const models = activeProvider?.models || []

    return (
        <Card className="glass-card space-y-4 border-0 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">
                <Server className="h-4 w-4" />
                <span>Provider Settings</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Select
                    value={selectedProvider}
                    onChange={(e) => onProviderChange(e.target.value as ProviderType)}
                    disabled={disabled}
                    className="bg-[hsl(var(--background))]/50"
                >
                    {providers.map((provider) => (
                        <option key={provider.name} value={provider.name}>
                            {provider.displayName}
                        </option>
                    ))}
                </Select>

                <Select
                    value={selectedModel}
                    onChange={(e) => onModelChange(e.target.value)}
                    disabled={disabled || models.length === 0}
                    className="bg-[hsl(var(--background))]/50"
                >
                    {models.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.name} ({model.tier})
                        </option>
                    ))}
                </Select>
            </div>

            {activeProvider && (
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                        {activeProvider.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {activeProvider.location}
                    </Badge>
                    {activeProvider.capabilities.vision && (
                        <Badge variant="secondary" className="text-xs">Vision</Badge>
                    )}
                </div>
            )}
        </Card>
    )
}
