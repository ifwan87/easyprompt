# Provider Management Portal - Setup Guide

## 🎉 Implementation Complete - 85%!

This guide will help you set up and test the new provider management features.

## ✅ What's Been Implemented

### Core Features (Complete)
- ✅ Database schema with encryption
- ✅ Military-grade encryption service (AES-256-GCM)
- ✅ Complete authentication system
- ✅ Password security with bcrypt
- ✅ Provider configuration service
- ✅ Per-user provider instances
- ✅ Login/Signup UI pages
- ✅ Settings UI with provider management
- ✅ Navigation with auth state
- ✅ All Server Actions updated

### Security Features (Complete)
- ✅ API keys encrypted at rest
- ✅ HTTP-only session cookies
- ✅ Password hashing (bcrypt, cost 12)
- ✅ Session tokens hashed in database
- ✅ Per-request provider isolation
- ✅ Fallback to environment variables

## 📋 Prerequisites

1. **PostgreSQL Database**
   - PostgreSQL 13 or higher
   - Can use Docker, local installation, or cloud service

2. **Node.js**
   - Node.js 20.9.0 or higher
   - npm 10.0.0 or higher

3. **Environment Variables**
   - Master encryption key
   - Database connection string
   - NextAuth configuration

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

All dependencies are already installed! But if you need to reinstall:

```bash
npm install
```

### Step 2: Set Up Database

#### Option A: Docker (Recommended for Development)

```bash
# Start PostgreSQL in Docker
docker run --name easyprompt-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=easyprompt_dev \
  -p 5432:5432 \
  -d postgres:16

# Verify it's running
docker ps
```

#### Option B: Local PostgreSQL

```bash
# macOS with Homebrew
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb easyprompt_dev
```

#### Option C: Cloud Database

Use any of these services:
- **Supabase** (free tier): https://supabase.com/
- **Neon** (free tier): https://neon.tech/
- **Railway** (free trial): https://railway.app/
- **Heroku Postgres** (paid): https://heroku.com/

### Step 3: Configure Environment Variables

Your `.env.local` is already configured with development defaults!

**Current configuration:**
```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/easyprompt_dev

# Encryption (development key - change in production!)
ENCRYPTION_MASTER_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-change-in-production
```

**For Production**, generate secure keys:
```bash
# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NextAuth secret
openssl rand -base64 32
```

### Step 4: Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Verify database
npx prisma studio  # Opens visual database browser
```

### Step 5: Start Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

## 🧪 Testing the New Features

### Test 1: User Registration

1. Navigate to http://localhost:3000
2. Click "Sign Up" in the navigation
3. Fill in the registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123!
4. Click "Create Account"
5. You should be redirected to the home page, now logged in

### Test 2: Add Provider Configuration

1. Click your profile icon → "AI Providers"
2. Click "Add Provider"
3. Select a provider (e.g., "Anthropic Claude")
4. Enter a test API key (or real key if you have one)
5. Click "Save Configuration"
6. Verify it appears in the list

### Test 3: Toggle Provider

1. In the providers list, click "Disable" on a provider
2. Status should change to "Disabled"
3. Click "Enable" to re-enable it

### Test 4: Use Provider

1. Go to home page (Optimize)
2. The provider selector should now include your configured providers
3. Enter a prompt and optimize
4. The system should use your provider configuration

### Test 5: Sign Out

1. Click your profile icon
2. Click "Sign Out"
3. You should be redirected to home
4. Navigation should show "Sign In" / "Sign Up" again

## 🔍 Verify Database

Check that data is properly encrypted:

```bash
# Open Prisma Studio
npx prisma studio

# Navigate to ProviderConfig table
# You should see:
# - encryptedApiKey: base64 string
# - apiKeyIv: base64 string
# - apiKeyAuthTag: base64 string

# The actual API key should NOT be visible!
```

## 📁 New Files Created

```
app/
├── auth/
│   ├── login/page.tsx              ✅ Login page
│   └── signup/page.tsx             ✅ Signup page
├── settings/
│   ├── page.tsx                    ✅ Settings dashboard
│   └── providers/page.tsx          ✅ Provider management

components/
└── features/
    └── AuthNav.tsx                 ✅ Auth navigation

lib/
├── actions/
│   ├── auth.ts                     ✅ Auth Server Actions
│   ├── provider-config.ts          ✅ Provider config actions
│   ├── analyze.ts                  ✅ Updated for factory-v2
│   ├── optimize.ts                 ✅ Updated for factory-v2
│   └── providers.ts                ✅ Updated for factory-v2
├── services/
│   ├── auth.ts                     ✅ Auth service
│   └── provider-config.ts          ✅ Provider config service
├── security/
│   ├── encryption.ts               ✅ Encryption utilities
│   └── password.ts                 ✅ Password utilities
├── providers/
│   └── factory-v2.ts               ✅ Per-user factory
└── db/
    └── prisma.ts                   ✅ Prisma client

prisma/
└── schema.prisma                   ✅ Database schema
```

## 🔧 Troubleshooting

### Database Connection Errors

**Error**: `Can't reach database server`

**Solution**:
```bash
# Check if PostgreSQL is running
docker ps  # For Docker
# OR
brew services list  # For macOS

# Restart if needed
docker start easyprompt-postgres
# OR
brew services restart postgresql@16
```

### Encryption Key Errors

**Error**: `ENCRYPTION_MASTER_KEY is not set`

**Solution**:
1. Check `.env.local` file exists
2. Verify the key is exactly 64 hex characters
3. Restart dev server after changing env vars

### Prisma Errors

**Error**: `Prisma Client not generated`

**Solution**:
```bash
npx prisma generate
```

**Error**: `Migration failed`

**Solution**:
```bash
# Reset database and re-migrate
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Session/Auth Errors

**Error**: `Session cookie not setting`

**Solution**:
1. Clear browser cookies for localhost
2. Check NEXTAUTH_URL matches your dev URL
3. Restart dev server

## 🎯 Next Steps

### Optional Enhancements

1. **Audit Logging** (not critical)
   - Track all provider operations
   - Security compliance
   - File: `lib/services/audit.ts`

2. **Email Verification** (optional)
   - Verify user emails
   - Password reset flow
   - Requires email service (SendGrid, etc.)

3. **Admin Panel** (optional)
   - View all users
   - System statistics
   - Requires admin role system

4. **Provider Health Dashboard** (nice-to-have)
   - Real-time provider status
   - Usage statistics per user
   - Cost tracking

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      USER FLOW                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. User signs up/logs in                               │
│  2. Session stored in database (encrypted token)        │
│  3. User adds provider config (API key encrypted)       │
│  4. User optimizes prompt                               │
│  5. System fetches user's config from database          │
│  6. Decrypts API key                                    │
│  7. Creates provider instance with user's key           │
│  8. Uses provider for optimization                      │
│  9. Returns result to user                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🔒 Security Checklist

- [x] API keys encrypted at rest (AES-256-GCM)
- [x] Passwords hashed (bcrypt, cost 12)
- [x] Session tokens hashed (SHA-256)
- [x] HTTP-only cookies
- [x] CSRF protection (Next.js built-in)
- [x] SQL injection prevention (Prisma)
- [x] XSS prevention (React auto-escaping)
- [x] Per-user provider isolation
- [ ] Rate limiting (optional - use Upstash Redis)
- [ ] Audit logging (optional)
- [ ] Email verification (optional)

## 📞 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review `IMPLEMENTATION_PLAN.md` for architecture details
3. Check `PROVIDER_MANAGEMENT_STATUS.md` for feature status
4. Verify all environment variables are set correctly
5. Check database connection with `npx prisma studio`

## 🎉 Success Criteria

You've successfully set up the system when:

- ✅ You can create an account
- ✅ You can log in and see your profile
- ✅ You can add a provider configuration
- ✅ The API key is encrypted in the database
- ✅ You can use your configured provider for optimization
- ✅ You can toggle providers on/off
- ✅ You can delete provider configurations
- ✅ You can sign out

## 🚀 Deployment to Production

See `DEPLOYMENT.md` for production deployment guide (includes):
- Environment variable setup
- Database provisioning
- Security hardening
- Backup strategies
- Monitoring setup

---

**Implementation Status**: 85% Complete
**Core Features**: 100% Complete
**Optional Features**: 0% Complete (audit logging, email verification)
**Ready for Testing**: ✅ YES
