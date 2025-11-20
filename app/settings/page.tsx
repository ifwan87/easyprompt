'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/actions/auth'
import { SessionData } from '@/lib/services/auth'
import { Card } from '@/components/ui/card'
import { Settings, User, Key, Shield, Database } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
    const router = useRouter()
    const [session, setSession] = useState<SessionData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function checkAuth() {
            const user = await getSession()
            if (!user) {
                router.push('/auth/login')
                return
            }
            setSession(user)
            setIsLoading(false)
        }
        checkAuth()
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    <p className="mt-4 text-gray-600">Loading settings...</p>
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
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="h-8 w-8 text-gray-900" />
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    </div>
                    <p className="text-gray-600">
                        Manage your account and AI provider configurations
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Account Section */}
                    <Card className="notion-card p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-gray-900" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    Account Information
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Your account details and preferences
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-t border-gray-100">
                                        <span className="text-gray-600">Name</span>
                                        <span className="font-medium text-gray-900">
                                            {session.name || 'Not set'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-t border-gray-100">
                                        <span className="text-gray-600">Email</span>
                                        <span className="font-medium text-gray-900">
                                            {session.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* AI Providers Section */}
                    <Link href="/settings/providers">
                        <Card className="notion-card p-6 notion-interactive cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Key className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                        AI Provider Configuration
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Manage API keys and endpoints for AI providers
                                    </p>
                                    <div className="mt-4">
                                        <span className="text-sm font-medium text-blue-600">
                                            Configure Providers →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    {/* Security Section */}
                    <Card className="notion-card p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    Security
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Your data security and encryption status
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-gray-700">
                                            API keys encrypted with AES-256-GCM
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-gray-700">
                                            Password hashed with bcrypt
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-gray-700">
                                            HTTP-only session cookies
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Data Storage Section */}
                    <Card className="notion-card p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Database className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    Data Storage
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Your provider configurations are stored securely in the database with military-grade encryption. We never store your API keys in plain text.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Back to Home */}
                    <div className="text-center pt-4">
                        <Link
                            href="/"
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
