'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signup } from '@/lib/actions/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            const result = await signup(email, password, name || undefined)

            if (result.success) {
                // Redirect to home page on success
                router.push('/')
                router.refresh()
            } else {
                setError(result.error || 'Signup failed')
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
            console.error('Signup error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    // Password strength indicator
    const getPasswordStrength = () => {
        if (!password) return null

        const hasLength = password.length >= 8
        const hasUpper = /[A-Z]/.test(password)
        const hasLower = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

        const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(
            Boolean
        ).length

        if (score < 3) return { label: 'Weak', color: 'text-red-600' }
        if (score < 4) return { label: 'Medium', color: 'text-yellow-600' }
        return { label: 'Strong', color: 'text-green-600' }
    }

    const passwordStrength = getPasswordStrength()

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <UserPlus className="h-8 w-8 text-gray-900" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="mt-2 text-gray-600">
                        Get started with AI provider management
                    </p>
                </div>

                {/* Signup Form */}
                <Card className="notion-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Name Field */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-900 mb-2"
                            >
                                Full Name <span className="text-gray-400">(optional)</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    disabled={isLoading}
                                    className="pl-11"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-900 mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    disabled={isLoading}
                                    className="pl-11"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-900 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 8 characters"
                                    required
                                    disabled={isLoading}
                                    className="pl-11"
                                />
                            </div>
                            {passwordStrength && (
                                <p className={`text-xs mt-2 ${passwordStrength.color}`}>
                                    Password strength: {passwordStrength.label}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-900 mb-2"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                    disabled={isLoading}
                                    className="pl-11"
                                />
                            </div>
                            {confirmPassword && password === confirmPassword && (
                                <div className="flex items-center gap-2 mt-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <p className="text-xs text-green-600">Passwords match</p>
                                </div>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="text-xs text-gray-500 space-y-1">
                            <p className="font-medium">Password must contain:</p>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                                <li>At least 8 characters</li>
                                <li>3 of the following: uppercase, lowercase, number, special character</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>
                </Card>

                {/* Sign In Link */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/auth/login"
                            className="font-medium text-gray-900 hover:text-gray-700 underline"
                        >
                            Sign in instead
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
