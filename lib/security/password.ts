/**
 * Password Hashing and Validation
 *
 * Uses bcrypt for secure password hashing with adaptive cost factor.
 * Implements industry best practices for password security.
 */

import bcrypt from 'bcrypt'

// Bcrypt cost factor (number of rounds)
// 12 rounds = ~250ms per hash (good balance between security and UX)
// Each increment doubles the time required
const SALT_ROUNDS = 12

// Password requirements
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 128

/**
 * Password validation result
 */
export interface PasswordValidation {
    isValid: boolean
    errors: string[]
}

/**
 * Hash a plaintext password using bcrypt
 *
 * @param password - The plaintext password to hash
 * @returns Promise resolving to the hashed password
 * @throws Error if hashing fails
 */
export async function hashPassword(password: string): Promise<string> {
    if (!password) {
        throw new Error('Password cannot be empty')
    }

    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS)
        return hash
    } catch (error) {
        throw new Error(
            `Password hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
    }
}

/**
 * Verify a plaintext password against a bcrypt hash
 *
 * @param password - The plaintext password to verify
 * @param hash - The bcrypt hash to compare against
 * @returns Promise resolving to true if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
        return false
    }

    try {
        return await bcrypt.compare(password, hash)
    } catch (error) {
        console.error('Password verification error:', error)
        return false
    }
}

/**
 * Validate password strength and requirements
 *
 * @param password - The password to validate
 * @returns PasswordValidation object with validation results
 */
export function validatePassword(password: string): PasswordValidation {
    const errors: string[] = []

    if (!password) {
        return {
            isValid: false,
            errors: ['Password is required'],
        }
    }

    // Length checks
    if (password.length < PASSWORD_MIN_LENGTH) {
        errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
    }

    if (password.length > PASSWORD_MAX_LENGTH) {
        errors.push(`Password must be no more than ${PASSWORD_MAX_LENGTH} characters long`)
    }

    // Strength checks
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

    // Require at least 3 out of 4 character types for flexibility
    const characterTypeCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
        Boolean
    ).length

    if (characterTypeCount < 3) {
        errors.push(
            'Password must contain at least 3 of the following: uppercase letter, lowercase letter, number, special character'
        )
    }

    // Check for common weak passwords
    const commonWeakPasswords = [
        'password',
        'password123',
        '12345678',
        'qwerty123',
        'admin123',
        'letmein',
    ]

    if (commonWeakPasswords.includes(password.toLowerCase())) {
        errors.push('This password is too common and easily guessed')
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}

/**
 * Validate email format
 *
 * @param email - The email to validate
 * @returns true if email format is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
    if (!email) {
        return false
    }

    // Basic email regex - not perfect but good enough for most cases
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Generate a password reset token
 * Uses crypto.randomBytes for cryptographic security
 *
 * @returns A secure random token (hex string)
 */
export function generateResetToken(): string {
    const crypto = require('crypto')
    return crypto.randomBytes(32).toString('hex')
}

/**
 * Check if a password has been compromised in known breaches
 * (Optional - requires integration with Have I Been Pwned API)
 *
 * @param password - The password to check
 * @returns Promise resolving to true if compromised, false otherwise
 */
export async function isPasswordCompromised(password: string): Promise<boolean> {
    // For now, just check against common passwords
    // In production, you could integrate with Have I Been Pwned API
    const validation = validatePassword(password)
    return validation.errors.some(error => error.includes('too common'))
}
