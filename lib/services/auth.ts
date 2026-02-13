/**
 * Authentication Service
 *
 * Handles user authentication, session management, and authorization.
 * Uses database-backed sessions for security and scalability.
 */

import { prisma } from '@/lib/db/prisma'
import { hashPassword, verifyPassword, validateEmail, validatePassword } from '@/lib/security/password'
import { generateSecureToken, hashToken } from '@/lib/security/encryption'
import { Session } from '@prisma/client'
import { cookies } from 'next/headers'

// Session configuration
const SESSION_COOKIE_NAME = 'easyprompt_session'
const SESSION_MAX_AGE = Number(process.env.SESSION_MAX_AGE) || 30 * 24 * 60 * 60 // 30 days in seconds

/**
 * Session data returned to the application
 */
export interface SessionData {
    userId: string
    email: string
    name: string | null
    sessionId: string
}

/**
 * Authentication result
 */
export interface AuthResult {
    success: boolean
    user?: SessionData
    error?: string
}

/**
 * Create a new user account
 *
 * @param email - User's email address
 * @param password - User's password (will be hashed)
 * @param name - User's display name (optional)
 * @returns AuthResult with user data or error
 */
export async function signUp(
    email: string,
    password: string,
    name?: string
): Promise<AuthResult> {
    try {
        // Validate email
        if (!validateEmail(email)) {
            return {
                success: false,
                error: 'Invalid email address',
            }
        }

        // Validate password
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.isValid) {
            return {
                success: false,
                error: passwordValidation.errors[0] || 'Password does not meet requirements',
            }
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        })

        if (existingUser) {
            return {
                success: false,
                error: 'An account with this email already exists',
            }
        }

        // Hash password
        const passwordHash = await hashPassword(password)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                name: name || null,
                passwordHash,
            },
        })

        // Create session for the new user
        const session = await createSession(user.id)

        // Set session cookie
        await setSessionCookie(session.token)

        return {
            success: true,
            user: {
                userId: user.id,
                email: user.email,
                name: user.name,
                sessionId: session.id,
            },
        }
    } catch (error) {
        console.error('Signup error:', error)
        return {
            success: false,
            error: 'Failed to create account. Please try again.',
        }
    }
}

/**
 * Authenticate a user with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns AuthResult with user data or error
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        })

        if (!user) {
            return {
                success: false,
                error: 'Invalid email or password',
            }
        }

        // Verify password
        const isValid = await verifyPassword(password, user.passwordHash)

        if (!isValid) {
            return {
                success: false,
                error: 'Invalid email or password',
            }
        }

        // Create new session
        const session = await createSession(user.id)

        // Set session cookie
        await setSessionCookie(session.token)

        return {
            success: true,
            user: {
                userId: user.id,
                email: user.email,
                name: user.name,
                sessionId: session.id,
            },
        }
    } catch (error) {
        console.error('Sign in error:', error)
        return {
            success: false,
            error: 'Authentication failed. Please try again.',
        }
    }
}

/**
 * Sign out the current user
 * Deletes the session from database and removes cookie
 */
export async function signOut(): Promise<void> {
    try {
        const sessionToken = await getSessionToken()

        if (sessionToken) {
            const hashedToken = hashToken(sessionToken)

            // Delete session from database
            await prisma.session.delete({
                where: { token: hashedToken },
            }).catch(() => {
                // Session may already be deleted, ignore error
            })
        }

        // Remove cookie
        await deleteSessionCookie()
    } catch (error) {
        console.error('Sign out error:', error)
        // Still delete cookie even if database operation fails
        await deleteSessionCookie()
    }
}

/**
 * Get the current authenticated user from session
 *
 * @returns SessionData if authenticated, null otherwise
 */
export async function getCurrentUser(): Promise<SessionData | null> {
    try {
        const sessionToken = await getSessionToken()

        if (!sessionToken) {
            return null
        }

        const hashedToken = hashToken(sessionToken)

        // Find session and include user data
        const session = await prisma.session.findUnique({
            where: { token: hashedToken },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        })

        if (!session) {
            // Invalid session, remove cookie
            await deleteSessionCookie()
            return null
        }

        // Check if session is expired
        if (session.expiresAt < new Date()) {
            // Delete expired session
            await prisma.session.delete({
                where: { id: session.id },
            })
            await deleteSessionCookie()
            return null
        }

        return {
            userId: session.user.id,
            email: session.user.email,
            name: session.user.name,
            sessionId: session.id,
        }
    } catch (error) {
        console.error('Get current user error:', error)
        return null
    }
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in Server Actions that require auth
 *
 * @returns SessionData
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<SessionData> {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Authentication required')
    }

    return user
}

/**
 * Create a new session for a user
 *
 * @param userId - User ID
 * @returns Created session
 */
async function createSession(userId: string): Promise<Session> {
    // Generate secure random token
    const token = generateSecureToken(32)
    const hashedToken = hashToken(token)

    // Calculate expiration
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + SESSION_MAX_AGE)

    // Create session in database
    const session = await prisma.session.create({
        data: {
            userId,
            token: hashedToken,
            expiresAt,
            ipAddress: null, // Could capture from request headers
            userAgent: null, // Could capture from request headers
        },
    })

    // Store unhashed token in session for cookie
    // We'll store the plain token in the cookie, but hashed version in DB
    return {
        ...session,
        token, // Return unhashed token for cookie
    }
}

/**
 * Get session token from cookie
 *
 * @returns Session token or null
 */
async function getSessionToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(SESSION_COOKIE_NAME)
    return cookie?.value || null
}

/**
 * Set session cookie
 *
 * @param token - Session token to store in cookie
 */
async function setSessionCookie(token: string): Promise<void> {
    const cookieStore = await cookies()

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true, // Prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // CSRF protection
        maxAge: SESSION_MAX_AGE,
        path: '/',
    })
}

/**
 * Delete session cookie
 */
async function deleteSessionCookie(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Clean up expired sessions (run periodically)
 * Should be called by a cron job or scheduled task
 */
export async function cleanupExpiredSessions(): Promise<number> {
    try {
        const result = await prisma.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        })

        console.log(`Cleaned up ${result.count} expired sessions`)
        return result.count
    } catch (error) {
        console.error('Session cleanup error:', error)
        return 0
    }
}

/**
 * Get all active sessions for a user
 * Useful for "active sessions" management UI
 *
 * @param userId - User ID
 * @returns Array of active sessions
 */
export async function getUserSessions(userId: string): Promise<Session[]> {
    return await prisma.session.findMany({
        where: {
            userId,
            expiresAt: {
                gt: new Date(),
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })
}

/**
 * Revoke a specific session
 *
 * @param sessionId - Session ID to revoke
 * @param userId - User ID (for authorization)
 */
export async function revokeSession(sessionId: string, userId: string): Promise<boolean> {
    try {
        await prisma.session.delete({
            where: {
                id: sessionId,
                userId, // Ensure user can only revoke their own sessions
            },
        })
        return true
    } catch (error) {
        console.error('Revoke session error:', error)
        return false
    }
}
