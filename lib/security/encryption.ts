/**
 * Encryption Service for API Keys
 *
 * Uses AES-256-GCM encryption for securing sensitive data at rest.
 * Each encrypted value has its own initialization vector (IV) and authentication tag.
 *
 * Security Features:
 * - AES-256-GCM (Galois/Counter Mode) - Authenticated encryption
 * - Unique IV per encryption operation
 * - Authentication tags to prevent tampering
 * - Constant-time comparison for token validation
 */

import crypto from 'crypto'

// Encryption configuration
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16 // 128 bits
const AUTH_TAG_LENGTH = 16 // 128 bits
const KEY_LENGTH = 32 // 256 bits

/**
 * Encrypted data structure
 */
export interface EncryptedData {
    encrypted: string // Base64 encoded encrypted data
    iv: string // Base64 encoded initialization vector
    authTag: string // Base64 encoded authentication tag
}

/**
 * Get the master encryption key from environment
 * @throws Error if key is missing or invalid
 */
function getMasterKey(): Buffer {
    const key = process.env.ENCRYPTION_MASTER_KEY

    if (!key) {
        throw new Error(
            'ENCRYPTION_MASTER_KEY is not set in environment variables. ' +
            'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
        )
    }

    // Key must be 64 hex characters (32 bytes)
    if (!/^[0-9a-f]{64}$/i.test(key)) {
        throw new Error(
            'ENCRYPTION_MASTER_KEY must be a 64-character hexadecimal string (32 bytes). ' +
            'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
        )
    }

    return Buffer.from(key, 'hex')
}

/**
 * Encrypt a plaintext string
 *
 * @param plaintext - The data to encrypt
 * @returns EncryptedData object containing encrypted data, IV, and auth tag
 * @throws Error if encryption fails
 */
export function encrypt(plaintext: string): EncryptedData {
    if (!plaintext) {
        throw new Error('Cannot encrypt empty string')
    }

    try {
        const masterKey = getMasterKey()

        // Generate a random IV for this encryption operation
        const iv = crypto.randomBytes(IV_LENGTH)

        // Create cipher
        const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv)

        // Encrypt the data
        const encrypted = Buffer.concat([
            cipher.update(plaintext, 'utf8'),
            cipher.final(),
        ])

        // Get the authentication tag
        const authTag = cipher.getAuthTag()

        return {
            encrypted: encrypted.toString('base64'),
            iv: iv.toString('base64'),
            authTag: authTag.toString('base64'),
        }
    } catch (error) {
        throw new Error(
            `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
    }
}

/**
 * Decrypt an encrypted string
 *
 * @param encryptedData - The EncryptedData object to decrypt
 * @returns The decrypted plaintext string
 * @throws Error if decryption fails or data is tampered
 */
export function decrypt(encryptedData: EncryptedData): string {
    if (!encryptedData.encrypted || !encryptedData.iv || !encryptedData.authTag) {
        throw new Error('Invalid encrypted data: missing required fields')
    }

    try {
        const masterKey = getMasterKey()

        // Decode from base64
        const encrypted = Buffer.from(encryptedData.encrypted, 'base64')
        const iv = Buffer.from(encryptedData.iv, 'base64')
        const authTag = Buffer.from(encryptedData.authTag, 'base64')

        // Validate lengths
        if (iv.length !== IV_LENGTH) {
            throw new Error('Invalid IV length')
        }
        if (authTag.length !== AUTH_TAG_LENGTH) {
            throw new Error('Invalid authentication tag length')
        }

        // Create decipher
        const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv)
        decipher.setAuthTag(authTag)

        // Decrypt the data
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ])

        return decrypted.toString('utf8')
    } catch (error) {
        // This could indicate tampering or corrupted data
        throw new Error(
            `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
            'Data may have been tampered with or encryption key may have changed.'
        )
    }
}

/**
 * Hash a token for secure storage (e.g., session tokens)
 * Uses SHA-256 for one-way hashing
 *
 * @param token - The token to hash
 * @returns Hex-encoded SHA-256 hash
 */
export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Generate a cryptographically secure random token
 *
 * @param bytes - Number of random bytes to generate (default: 32)
 * @returns Hex-encoded random token
 */
export function generateSecureToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex')
}

/**
 * Constant-time string comparison to prevent timing attacks
 *
 * @param a - First string
 * @param b - Second string
 * @returns true if strings are equal, false otherwise
 */
export function secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false
    }

    // Use crypto.timingSafeEqual for constant-time comparison
    const bufA = Buffer.from(a, 'utf8')
    const bufB = Buffer.from(b, 'utf8')

    try {
        return crypto.timingSafeEqual(bufA, bufB)
    } catch {
        return false
    }
}

/**
 * Validate that the encryption system is properly configured
 * Call this on application startup
 *
 * @throws Error if encryption system is not properly configured
 */
export function validateEncryptionConfig(): void {
    try {
        const masterKey = getMasterKey()

        // Verify key length
        if (masterKey.length !== KEY_LENGTH) {
            throw new Error(`Master key must be ${KEY_LENGTH} bytes`)
        }

        // Test encryption/decryption
        const testData = 'encryption-test-' + Date.now()
        const encrypted = encrypt(testData)
        const decrypted = decrypt(encrypted)

        if (decrypted !== testData) {
            throw new Error('Encryption test failed: decrypted data does not match original')
        }

        console.log('✓ Encryption system validated successfully')
    } catch (error) {
        console.error('✗ Encryption system validation failed:', error)
        throw error
    }
}

/**
 * Re-encrypt data with a new master key
 * Used during key rotation
 *
 * @param encryptedData - Data encrypted with old key
 * @param oldKey - The old master key (hex string)
 * @returns EncryptedData object encrypted with current master key
 */
export function reEncrypt(encryptedData: EncryptedData, oldKey: string): EncryptedData {
    // Temporarily set old key
    const currentKey = process.env.ENCRYPTION_MASTER_KEY
    process.env.ENCRYPTION_MASTER_KEY = oldKey

    try {
        // Decrypt with old key
        const plaintext = decrypt(encryptedData)

        // Restore current key
        process.env.ENCRYPTION_MASTER_KEY = currentKey

        // Encrypt with current key
        return encrypt(plaintext)
    } catch (error) {
        // Restore current key on error
        process.env.ENCRYPTION_MASTER_KEY = currentKey
        throw error
    }
}
