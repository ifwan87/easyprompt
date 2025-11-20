# Provider Management Portal - Implementation Plan

## 🎯 Goal
Allow users to manage their AI provider API keys and endpoints through a web portal instead of `.env` files.

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                               │
│  Settings UI → Server Actions → Auth Check → Provider Service   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                              │
│  User → Session → ProviderConfig (encrypted) → AuditLog          │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                      PROVIDER LAYER                               │
│  Per-Request Provider Instances (with user-specific keys)        │
└──────────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

### 1. User Table
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  passwordHash  String   // bcrypt hashed
  emailVerified DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  sessions      Session[]
  providers     ProviderConfig[]
  auditLogs     AuditLog[]

  @@index([email])
}
```

### 2. Session Table (for authentication)
```prisma
model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique  // SHA-256 hashed session token
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  ipAddress    String?
  userAgent    String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
  @@index([expiresAt])
}
```

### 3. ProviderConfig Table (ENCRYPTED)
```prisma
model ProviderConfig {
  id                  String   @id @default(cuid())
  userId              String
  providerName        String   // 'anthropic', 'openai', 'google', 'ollama', etc.

  // ENCRYPTED FIELDS (using AES-256-GCM)
  encryptedApiKey     String?  // Base64 encoded encrypted data
  apiKeyIv            String?  // Initialization vector for API key
  apiKeyAuthTag       String?  // Authentication tag for API key

  encryptedEndpoint   String?  // For Ollama, custom endpoints
  endpointIv          String?
  endpointAuthTag     String?

  // Metadata
  isEnabled           Boolean  @default(true)
  displayName         String?  // User-friendly name
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  lastUsedAt          DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, providerName])
  @@index([userId])
  @@index([providerName])
}
```

### 4. AuditLog Table (Security & Compliance)
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  action      String   // 'provider.create', 'provider.update', 'provider.delete', 'provider.use'
  entityType  String   // 'ProviderConfig'
  entityId    String?
  details     Json?    // Additional context (never includes sensitive data)
  ipAddress   String?
  userAgent   String?
  success     Boolean  @default(true)
  errorMessage String?
  createdAt   DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

## 🔐 Encryption Strategy

### Technology Stack
- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Derivation**: PBKDF2 or dedicated KMS
- **Key Storage**: Environment variable `ENCRYPTION_MASTER_KEY` (32-byte hex)
- **Libraries**: Node.js built-in `crypto` module

### Encryption Flow
```typescript
// Encrypt
const iv = crypto.randomBytes(16)
const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv)
const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
const authTag = cipher.getAuthTag()

// Store: base64(encrypted), base64(iv), base64(authTag)

// Decrypt
const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv)
decipher.setAuthTag(authTag)
const decrypted = Buffer.concat([
  decipher.update(encrypted),
  decipher.final()
]).toString('utf8')
```

### Key Rotation Strategy
- Master key stored in env (can be rotated)
- Each encrypted value has its own IV
- Re-encryption process when rotating keys

## 🔑 Authentication System

### Technology: NextAuth.js v5 (Auth.js)
- Industry standard for Next.js
- Built-in CSRF protection
- Session management
- Secure by default

### Authentication Flow
1. User registers/logs in
2. Session token generated (SHA-256 hashed)
3. Session stored in database
4. HTTP-only cookie sent to browser
5. Every request validates session

### Security Features
- Password hashing: bcrypt (cost factor 12)
- Session tokens: Cryptographically random
- Session expiry: 30 days (configurable)
- HTTP-only cookies: Prevents XSS
- Secure cookies: HTTPS only in production
- CSRF tokens: Built into Next.js

## 🏭 Provider Factory Refactor

### Current Issue
```typescript
// Singleton - all users share same provider instances
class ProviderFactory {
  private static instance: ProviderFactory
  private providers: Map<ProviderType, AIProvider>
}
```

### New Design
```typescript
// Per-request factory with user context
class ProviderFactory {
  static async createProvider(
    providerName: ProviderType,
    userId: string
  ): Promise<AIProvider> {
    // 1. Fetch user's provider config from database
    // 2. Decrypt API keys
    // 3. Create provider instance with user-specific config
    // 4. Return instance (not cached)
  }
}
```

### Implementation Details
- No singleton pattern
- Each Server Action creates fresh provider instances
- Provider instances scoped to request lifecycle
- Automatic cleanup after request completes

## 🛣️ Server Actions & API Structure

### New Server Actions (in `lib/actions/`)

#### 1. `auth.ts` - Authentication
```typescript
'use server'
export async function signup(email, password, name)
export async function login(email, password)
export async function logout()
export async function getSession()
```

#### 2. `provider-config.ts` - Provider Management
```typescript
'use server'
export async function saveProviderConfig(providerName, apiKey, endpoint?)
export async function getProviderConfigs()
export async function updateProviderConfig(id, updates)
export async function deleteProviderConfig(id)
export async function toggleProviderConfig(id, enabled)
```

#### 3. Modified `providers.ts`
```typescript
'use server'
// Now includes user context
export async function getProviders(userId?: string)
```

### Security Middleware
Every Server Action will use:
```typescript
async function requireAuth(): Promise<{ userId: string }> {
  const session = await getSession()
  if (!session) throw new AuthenticationError()
  return { userId: session.userId }
}
```

## 🎨 UI Components

### New Pages/Components

#### 1. `/app/auth/login/page.tsx`
- Email/password form
- Link to signup
- "Forgot password" link

#### 2. `/app/auth/signup/page.tsx`
- Registration form
- Email verification flow

#### 3. `/app/settings/page.tsx`
- Main settings page
- Provider configuration list
- Add/edit/delete providers

#### 4. `/components/features/ProviderConfigForm.tsx`
- Form to add/edit provider configs
- API key input (password field)
- Endpoint URL input (for Ollama)
- Enable/disable toggle
- Validation

#### 5. `/components/features/ProviderConfigList.tsx`
- List of configured providers
- Status indicators (enabled/disabled)
- Last used timestamp
- Edit/delete actions

## 🔄 Migration Strategy

### Phase 1: Backward Compatibility
- Keep existing `.env` support
- Add database as fallback
- Priority: Database > Environment variables

### Phase 2: Hybrid Mode
```typescript
async function getProviderKey(providerName, userId?) {
  if (userId) {
    // Try database first
    const config = await db.providerConfig.findUnique({
      where: { userId_providerName: { userId, providerName } }
    })
    if (config?.encryptedApiKey) {
      return await decrypt(config)
    }
  }

  // Fallback to environment variables
  return process.env[`${providerName.toUpperCase()}_API_KEY`]
}
```

### Phase 3: Migration Tool
- Admin command to import `.env` to database
- Export database configs to `.env` format
- Bulk re-encryption tool

## 📋 Implementation Steps

### Step 1: Database Setup (2-4 hours)
1. Install Prisma: `npm install prisma @prisma/client`
2. Initialize Prisma: `npx prisma init`
3. Create schema in `prisma/schema.prisma`
4. Run migration: `npx prisma migrate dev`
5. Generate client: `npx prisma generate`

### Step 2: Encryption Service (2-3 hours)
1. Create `lib/security/encryption.ts`
2. Implement encrypt/decrypt functions
3. Add master key validation
4. Create key rotation utilities
5. Unit tests

### Step 3: Authentication System (4-6 hours)
1. Install NextAuth: `npm install next-auth@beta`
2. Configure `auth.ts`
3. Create auth Server Actions
4. Build login/signup pages
5. Add session middleware

### Step 4: Provider Refactor (4-5 hours)
1. Refactor ProviderFactory to non-singleton
2. Add user context to all provider methods
3. Update Server Actions to pass userId
4. Create provider config service
5. Update existing providers

### Step 5: Server Actions (3-4 hours)
1. Create `provider-config.ts` actions
2. Add authentication checks
3. Implement CRUD operations
4. Add validation and error handling

### Step 6: UI Components (4-6 hours)
1. Build login/signup forms
2. Create settings page
3. Build provider config form
4. Add provider list component
5. Update navigation with auth state

### Step 7: Security & Audit (3-4 hours)
1. Implement audit logging
2. Add rate limiting for sensitive operations
3. Security review
4. Penetration testing
5. Add security headers

### Step 8: Migration & Documentation (2-3 hours)
1. Create migration script
2. Update README
3. Add deployment guide
4. Create security documentation

**Total Estimated Time: 24-35 hours**

## 🚨 Security Checklist

- [ ] Master encryption key in environment (never committed)
- [ ] API keys encrypted at rest (AES-256-GCM)
- [ ] Passwords hashed (bcrypt, cost 12+)
- [ ] Session tokens cryptographically random
- [ ] HTTP-only cookies for sessions
- [ ] CSRF protection enabled
- [ ] Rate limiting on auth endpoints
- [ ] Audit logging for all provider operations
- [ ] SQL injection prevention (Prisma parameterized queries)
- [ ] XSS prevention (React auto-escaping)
- [ ] Input validation on all forms
- [ ] No sensitive data in logs
- [ ] Secure password reset flow
- [ ] Email verification
- [ ] Account lockout after failed attempts

## 📦 New Dependencies

```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta",
    "@prisma/client": "^5.x",
    "bcrypt": "^5.1.1",
    "@types/bcrypt": "^5.0.2"
  },
  "devDependencies": {
    "prisma": "^5.x"
  }
}
```

## 🔧 Environment Variables

```env
# Existing variables remain unchanged
# New variables:

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/easyprompt"

# Encryption
ENCRYPTION_MASTER_KEY="<64-character-hex-string>"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<random-secret-key>"

# Email (optional, for verification)
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@easyprompt.com"
```

## 🎯 Success Criteria

1. ✅ Users can register and login securely
2. ✅ Users can add/edit/delete provider configs via UI
3. ✅ API keys are encrypted in database
4. ✅ Provider factory uses user-specific configs
5. ✅ Backward compatibility with `.env` files
6. ✅ Audit logs track all provider operations
7. ✅ No API keys visible in client/network traffic
8. ✅ Session management works correctly
9. ✅ All security checklist items passed
10. ✅ Documentation updated

## 🚀 Next Steps

Ready to implement? I'll proceed with:
1. Setting up Prisma and database schema
2. Implementing encryption service
3. Adding authentication system
4. Refactoring provider factory
5. Building UI components

**Shall I begin implementation?**
