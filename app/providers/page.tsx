'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { checkHealth } from '@/lib/actions/health'
import { discoverModels } from '@/lib/actions/discover-models'
import { HealthStatus } from '@/lib/providers/types'
import { useProvider } from '@/components/hooks/use-provider'
import { Activity, Server, RefreshCw, Zap, Database, Cpu, CheckCircle2, XCircle, AlertTriangle, Eye } from 'lucide-react'

export default function ProvidersPage() {
    const { providers, isLoading: providersLoading } = useProvider()
    const [healthStatuses, setHealthStatuses] = useState<Record<string, HealthStatus>>({})
    const [checking, setChecking] = useState<Record<string, boolean>>({})
    const [discovering, setDiscovering] = useState(false)

    useEffect(() => {
        providers.forEach(provider => {
            checkProviderHealth(provider.name)
        })
    }, [providers])

    const checkProviderHealth = async (providerName: string) => {
        setChecking(prev => ({ ...prev, [providerName]: true }))
        try {
            const status = await checkHealth(providerName)
            setHealthStatuses(prev => ({ ...prev, [providerName]: status }))
        } catch (error) {
            console.error(`Health check failed for ${providerName}:`, error)
        } finally {
            setChecking(prev => ({ ...prev, [providerName]: false }))
        }
    }

    const handleDiscoverModels = async () => {
        setDiscovering(true)
        try {
            await discoverModels('ollama')
            await checkProviderHealth('ollama')
        } catch (error) {
            console.error('Model discovery failed:', error)
        } finally {
            setDiscovering(false)
        }
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
            <section className="border-b border-gray-100">
                <div className="max-w-[1200px] mx-auto px-6 py-16">
                    <div className="max-w-3xl mx-auto text-center space-y-6 animate-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-2">
                            <Activity className="h-3.5 w-3.5" />
                            System Status
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-gray-900">
                            Provider Health
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Real-time monitoring of AI model availability, latency, and capabilities.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in">
                        <StatCard
                            label="Providers"
                            value={providers.length}
                            icon={Server}
                        />
                        <StatCard
                            label="Models"
                            value={providers.reduce((acc, p) => acc + p.models.length, 0)}
                            icon={Cpu}
                        />
                        <StatCard
                            label="Avg Latency"
                            value="~450ms"
                            icon={Zap}
                        />
                        <StatCard
                            label="Status"
                            value="Healthy"
                            icon={CheckCircle2}
                        />
                    </div>

                    {/* Providers Grid */}
                    <div className="grid md:grid-cols-2 gap-6 animate-in">
                        {providers.map((provider) => {
                            const status = healthStatuses[provider.name]
                            const isChecking = checking[provider.name]

                            return (
                                <Card key={provider.name} className="notion-card">
                                    <div className="p-6 space-y-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                                                    {provider.name === 'ollama' ? '🦙' :
                                                        provider.name === 'anthropic' ? '🧠' :
                                                            provider.name === 'openai' ? '🤖' : '🌐'}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {provider.displayName}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="notion-badge text-[10px] uppercase">
                                                            {provider.category}
                                                        </span>
                                                        {provider.location === 'local' && (
                                                            <span className="notion-badge bg-green-50 text-green-700 border-green-200 text-[10px] uppercase">
                                                                Local
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => checkProviderHealth(provider.name)}
                                                disabled={isChecking}
                                                className="notion-button-secondary h-9 w-9 p-0"
                                            >
                                                <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                                            </Button>
                                        </div>

                                        {/* Status Grid */}
                                        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                                            <div className="space-y-1">
                                                <span className="text-xs font-semibold text-gray-600 uppercase">Status</span>
                                                <div className="flex items-center gap-2">
                                                    {status?.available ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    )}
                                                    <span className={`text-sm font-medium ${status?.available ? 'text-green-600' : 'text-red-600'}`}>
                                                        {status?.available ? 'Online' : 'Offline'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs font-semibold text-gray-600 uppercase">Latency</span>
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm font-mono font-medium text-gray-900">
                                                        {status?.latency ? `${status.latency}ms` : '--'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Capabilities */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold text-gray-600 uppercase">Capabilities</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {provider.capabilities.streaming && (
                                                    <span className="notion-badge text-xs">
                                                        <Zap className="h-3 w-3" />
                                                        Streaming
                                                    </span>
                                                )}
                                                {provider.capabilities.vision && (
                                                    <span className="notion-badge text-xs">
                                                        <Eye className="h-3 w-3" />
                                                        Vision
                                                    </span>
                                                )}
                                                {provider.capabilities.functionCalling && (
                                                    <span className="notion-badge text-xs">
                                                        <Database className="h-3 w-3" />
                                                        Functions
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Models List */}
                                        <div className="space-y-3 pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-semibold text-gray-600 uppercase">
                                                    Models ({provider.models.length})
                                                </h4>
                                                {provider.supportsModelDiscovery && (
                                                    <Button
                                                        onClick={handleDiscoverModels}
                                                        disabled={discovering}
                                                        className="notion-button-secondary h-7 text-xs px-2"
                                                    >
                                                        {discovering ? 'Scanning...' : 'Scan Local'}
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {provider.models.map((model) => (
                                                    <span
                                                        key={model.id}
                                                        className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200"
                                                    >
                                                        {model.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Error Message */}
                                        {status?.error && (
                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm">
                                                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                                {status.error}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>
        </main>
    )
}

function StatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string
    value: string | number
    icon: React.ElementType
}) {
    return (
        <Card className="notion-card p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-100">
                <Icon className="h-5 w-5 text-gray-700" />
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </Card>
    )
}
