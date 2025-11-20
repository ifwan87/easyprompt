'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getSession, signout } from '@/lib/actions/auth'
import { SessionData } from '@/lib/services/auth'
import { User, Settings, LogOut, LogIn } from 'lucide-react'

export function AuthNav() {
    const router = useRouter()
    const pathname = usePathname()
    const [session, setSession] = useState<SessionData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        async function loadSession() {
            const user = await getSession()
            setSession(user)
            setIsLoading(false)
        }
        loadSession()
    }, [pathname]) // Reload when path changes

    const handleSignOut = async () => {
        await signout()
        setSession(null)
        router.push('/')
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            </div>
        )
    }

    if (!session) {
        // Not logged in - show login/signup buttons
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/auth/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150 font-medium"
                >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Sign In</span>
                </Link>
                <Link
                    href="/auth/signup"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-gray-900 text-white hover:bg-gray-800 transition-all duration-150 font-medium"
                >
                    <User className="h-3.5 w-3.5" />
                    <span>Sign Up</span>
                </Link>
            </div>
        )
    }

    // Logged in - show user menu
    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150 font-medium"
            >
                <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
                    {session.name ? session.name[0].toUpperCase() : session.email[0].toUpperCase()}
                </div>
                <span className="hidden md:inline">{session.name || session.email.split('@')[0]}</span>
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{session.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{session.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            <Link
                                href="/settings"
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Link>
                            <Link
                                href="/settings/providers"
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <User className="h-4 w-4" />
                                AI Providers
                            </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-gray-100 py-1">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
