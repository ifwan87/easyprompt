/**
 * Authentication Server Actions
 *
 * These are the public-facing actions that the UI calls.
 * All authentication logic is delegated to the auth service.
 */

'use server'

import { signUp as signUpService, signIn as signInService, signOut as signOutService, getCurrentUser, AuthResult } from '@/lib/services/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Sign up action - creates a new user account
 *
 * @param email - User's email
 * @param password - User's password
 * @param name - User's display name (optional)
 * @returns AuthResult
 */
export async function signup(
    email: string,
    password: string,
    name?: string
): Promise<AuthResult> {
    try {
        const result = await signUpService(email, password, name)

        if (result.success) {
            // Revalidate paths that show auth state
            revalidatePath('/')
            revalidatePath('/settings')
        }

        return result
    } catch (error) {
        console.error('Signup action error:', error)
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.',
        }
    }
}

/**
 * Sign in action - authenticates an existing user
 *
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResult
 */
export async function signin(email: string, password: string): Promise<AuthResult> {
    try {
        const result = await signInService(email, password)

        if (result.success) {
            // Revalidate paths that show auth state
            revalidatePath('/')
            revalidatePath('/settings')
        }

        return result
    } catch (error) {
        console.error('Sign in action error:', error)
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.',
        }
    }
}

/**
 * Sign out action - ends the current session
 */
export async function signout(): Promise<void> {
    try {
        await signOutService()

        // Revalidate paths that show auth state
        revalidatePath('/')

        // Redirect to home page
        redirect('/')
    } catch (error) {
        console.error('Sign out action error:', error)
        // Still redirect even if there's an error
        redirect('/')
    }
}

/**
 * Get the current authenticated user
 *
 * @returns User session data or null
 */
export async function getSession() {
    try {
        return await getCurrentUser()
    } catch (error) {
        console.error('Get session error:', error)
        return null
    }
}

/**
 * Check if user is authenticated
 *
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser()
    return user !== null
}
