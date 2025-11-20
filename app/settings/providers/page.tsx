'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/actions/auth'
import {
    getProviderConfigs,
    saveProviderConfig,
    toggleProviderConfig,
    deleteProviderConfig
} from '@/lib/actions/provider-config'
import { ProviderConfigData } from '@/lib/services/provider-config'
import { SessionData } from '@/lib/services/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Key,
    Plus,
    Trash2,
    Edit,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { ProviderType } from '@/lib/providers/types'

export default function ProvidersSettingsPage() {
    const router = useRouter()
    const [session, setSession] = useState<SessionData | null>(null)
    const [configs, setConfigs] = useState<ProviderConfigData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)

    // Form state
    const [formProvider, setFormProvider] = useState<ProviderType>('anthropic')
    const [formApiKey, setFormApiKey] = useState('')
    const [formEndpoint, setFormEndpoint] = useState('')
    const [formDisplayName, setFormDisplayName] = useState('')
    const [showApiKey, setShowApiKey] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState(false)

    useEffect(() => {
        async function init() {
            const user = await getSession()
            if (!user) {
                router.push('/auth/login')
                return
            }
            setSession(user)
            await loadConfigs()
            setIsLoading(false)
        }
        init()
    }, [router])

    const loadConfigs = async () => {
        const data = await getProviderConfigs()
        setConfigs(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)
        setFormSuccess(false)
        setIsSaving(true)

        try {
            const result = await saveProviderConfig(
                formProvider,
                formApiKey || undefined,
                formEndpoint || undefined,
                formDisplayName || undefined
            )

            if (result.success) {
                setFormSuccess(true)
                setFormApiKey('')
                setFormEndpoint('')
                setFormDisplayName('')
                setShowAddForm(false)
                await loadConfigs()
            } else {
                setFormError(result.error || 'Failed to save configuration')
            }
        } catch (error) {
            setFormError('An unexpected error occurred')
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleToggle = async (configId: string, currentState: boolean) => {
        await toggleProviderConfig(configId, !currentState)
        await loadConfigs()
    }

    const handleDelete = async (configId: string) => {
        if (!confirm('Are you sure you want to delete this provider configuration?')) {
            return
        }

        const result = await deleteProviderConfig(configId)
        if (result.success) {
            await loadConfigs()
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    <p className="mt-4 text-gray-600">Loading configurations...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-100">
                <div className="max-w-[1200px] mx-auto px-6 py-8">
                    <Link
                        href="/settings"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Settings
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Key className="h-8 w-8 text-gray-900" />
                                <h1 className="text-3xl font-bold text-gray-900">AI Providers</h1>
                            </div>
                            <p className="text-gray-600">
                                Manage your API keys and endpoints for different AI providers
                            </p>
                        </div>
                        <Button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Provider
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Success Message */}
                    {formSuccess && (
                        <Card className="notion-card border-green-200 bg-green-50 p-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <p className="text-sm text-green-800">
                                    Provider configuration saved successfully!
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Add Provider Form */}
                    {showAddForm && (
                        <Card className="notion-card p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Add Provider Configuration
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {formError && (
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-800">{formError}</p>
                                    </div>
                                )}

                                {/* Provider Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Provider
                                    </label>
                                    <select
                                        value={formProvider}
                                        onChange={(e) => setFormProvider(e.target.value as ProviderType)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        disabled={isSaving}
                                    >
                                        <option value="anthropic">Anthropic Claude</option>
                                        <option value="openai">OpenAI GPT</option>
                                        <option value="google">Google Gemini</option>
                                        <option value="ollama">Ollama (Local)</option>
                                    </select>
                                </div>

                                {/* Display Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Display Name <span className="text-gray-400">(optional)</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={formDisplayName}
                                        onChange={(e) => setFormDisplayName(e.target.value)}
                                        placeholder="e.g., My Work Account"
                                        disabled={isSaving}
                                    />
                                </div>

                                {/* API Key (for non-Ollama providers) */}
                                {formProvider !== 'ollama' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            API Key
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showApiKey ? 'text' : 'password'}
                                                value={formApiKey}
                                                onChange={(e) => setFormApiKey(e.target.value)}
                                                placeholder="Enter your API key"
                                                required
                                                disabled={isSaving}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowApiKey(!showApiKey)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showApiKey ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Your API key will be encrypted before storage
                                        </p>
                                    </div>
                                )}

                                {/* Endpoint (for Ollama) */}
                                {formProvider === 'ollama' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Endpoint URL
                                        </label>
                                        <Input
                                            type="url"
                                            value={formEndpoint}
                                            onChange={(e) => setFormEndpoint(e.target.value)}
                                            placeholder="http://127.0.0.1:11434"
                                            required
                                            disabled={isSaving}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            The URL where your Ollama instance is running
                                        </p>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save Configuration'}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        disabled={isSaving}
                                        className="bg-gray-100 text-gray-900 hover:bg-gray-200"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {/* Provider List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Configured Providers ({configs.length})
                        </h2>

                        {configs.length === 0 ? (
                            <Card className="notion-card p-12 text-center">
                                <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No providers configured
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Add your first AI provider to get started
                                </p>
                                <Button onClick={() => setShowAddForm(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Provider
                                </Button>
                            </Card>
                        ) : (
                            configs.map((config) => (
                                <Card key={config.id} className="notion-card p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {config.displayName || config.providerName}
                                                </h3>
                                                {config.isEnabled ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Enabled
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                        <XCircle className="h-3 w-3" />
                                                        Disabled
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p>Provider: <span className="font-medium text-gray-900">{config.providerName}</span></p>
                                                {config.hasApiKey && <p>API Key: Configured (encrypted)</p>}
                                                {config.hasEndpoint && <p>Endpoint: Configured</p>}
                                                {config.lastUsedAt && (
                                                    <p>Last used: {new Date(config.lastUsedAt).toLocaleDateString()}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleToggle(config.id, config.isEnabled)}
                                                className="bg-gray-100 text-gray-900 hover:bg-gray-200"
                                            >
                                                {config.isEnabled ? 'Disable' : 'Enable'}
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(config.id)}
                                                className="bg-red-100 text-red-600 hover:bg-red-200"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
