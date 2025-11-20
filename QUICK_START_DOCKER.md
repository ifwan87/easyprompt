# Quick Start with Docker (PostgreSQL + Redis)

## 🚀 Super Fast Setup (3 Minutes)

This guide gets you up and running with Docker containers for PostgreSQL and Redis.

## Prerequisites

- Docker Desktop installed and running
- Node.js 20.9.0 or higher
- npm 10.0.0 or higher

## Step 1: Start Databases (30 seconds)

```bash
# Start PostgreSQL and Redis
npm run db:start

# Or with web management tools (PgAdmin + Redis Commander)
npm run db:start:tools
```

You should see:
```
✅ Services started successfully!

📊 Service Status:
PostgreSQL:  Running on localhost:5432
Redis:       Running on localhost:6379
```

## Step 2: Run Database Migrations (30 seconds)

```bash
# Generate Prisma client and run migrations
npm run setup:dev
```

This will:
1. Start databases (if not running)
2. Generate Prisma client
3. Create database tables

## Step 3: Start Development Server (10 seconds)

```bash
npm run dev
```

Open http://localhost:3000 🎉

## ✅ You're Ready!

Test the system:
1. Click "Sign Up" to create an account
2. Add a provider configuration
3. Try optimizing a prompt

## 📊 Useful Commands

### Database Management

```bash
# Check status
npm run db:status

# View logs
npm run db:logs                  # All services
npm run db:logs postgres         # Just PostgreSQL
npm run db:logs redis            # Just Redis

# Connect to databases
npm run db:psql                  # PostgreSQL CLI
./scripts/dev-db.sh redis-cli    # Redis CLI

# Prisma tools
npm run prisma:studio            # Visual database editor
npm run prisma:generate          # Regenerate Prisma client
npm run prisma:migrate           # Create new migration

# Backup
npm run db:backup                # Create SQL backup

# Stop/Restart
npm run db:stop                  # Stop containers
npm run db:restart               # Restart containers

# Clean up
npm run db:clean                 # Remove containers + data (⚠️ destructive)
npm run db:reset                 # Reset database only (⚠️ destructive)
```

## 🌐 Web Management Tools

If you started with `npm run db:start:tools`, you can access:

### PgAdmin (PostgreSQL Manager)
- URL: http://localhost:5050
- Email: `admin@easyprompt.local`
- Password: `admin`

**First Time Setup:**
1. Click "Add New Server"
2. General Tab:
   - Name: `EasyPrompt Dev`
3. Connection Tab:
   - Host: `postgres` (or `host.docker.internal` on Mac/Windows)
   - Port: `5432`
   - Database: `easyprompt_dev`
   - Username: `postgres`
   - Password: `password`
4. Click Save

### Redis Commander (Redis Manager)
- URL: http://localhost:8081
- No login required
- Browse keys, view data, monitor commands

## 🔍 Verify Everything Works

### Check Database Connection

```bash
npm run db:psql
```

Once connected, try:
```sql
-- List all tables
\dt

-- Check User table
SELECT * FROM users;

-- Check ProviderConfig table
SELECT id, "userId", "providerName", "isEnabled" FROM provider_configs;

-- Exit
\q
```

### Check Redis Connection

```bash
./scripts/dev-db.sh redis-cli
```

Once connected, try:
```
AUTH devpassword
PING
SET test "Hello Redis"
GET test
QUIT
```

### Check Prisma Studio

```bash
npm run prisma:studio
```

Opens http://localhost:5555 - Visual database browser

## 🔧 Connection Details

### PostgreSQL
```bash
Host:     localhost
Port:     5432
Database: easyprompt_dev
User:     postgres
Password: password
URL:      postgresql://postgres:password@localhost:5432/easyprompt_dev
```

### Redis
```bash
Host:     localhost
Port:     6379
Password: devpassword
URL:      redis://localhost:6379
```

These are configured in `.env.local`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/easyprompt_dev
UPSTASH_REDIS_REST_URL=redis://localhost:6379
UPSTASH_REDIS_REST_TOKEN=devpassword
USE_MEMORY_RATE_LIMIT=false
```

## 🐳 Docker Compose Services

The `docker-compose.dev.yml` file defines:

### Core Services (Always Start)
- **postgres** - PostgreSQL 16 database
- **redis** - Redis 7 cache and rate limiting

### Optional Tools (Start with `--tools`)
- **pgadmin** - Web UI for PostgreSQL (port 5050)
- **redis-commander** - Web UI for Redis (port 8081)

### Data Persistence

Data is persisted in Docker volumes:
- `easyprompt_postgres_data` - Database files
- `easyprompt_redis_data` - Redis snapshots
- `easyprompt_pgadmin_data` - PgAdmin settings

Even if you stop containers, your data persists!

## 🔄 Common Workflows

### Fresh Start
```bash
npm run db:start
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Daily Development
```bash
npm run db:status          # Check if running
npm run dev                # Start Next.js
```

### After Schema Changes
```bash
npm run prisma:migrate     # Create migration
npm run prisma:generate    # Update Prisma client
npm run dev                # Restart Next.js
```

### Complete Reset
```bash
npm run db:clean           # ⚠️ Removes all data
npm run setup:dev          # Recreate everything
npm run dev
```

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `port 5432 already allocated`

**Solution:**
```bash
# Check what's using the port
lsof -i :5432        # PostgreSQL
lsof -i :6379        # Redis

# Stop existing service
brew services stop postgresql  # macOS
sudo systemctl stop postgresql # Linux

# Or change port in docker-compose.dev.yml
```

### Docker Not Running

**Error:** `Cannot connect to Docker daemon`

**Solution:**
- Start Docker Desktop
- Wait for it to fully start (whale icon in menu bar)
- Try again

### Permission Denied

**Error:** `permission denied: ./scripts/dev-db.sh`

**Solution:**
```bash
chmod +x scripts/dev-db.sh
```

### Database Connection Failed

**Error:** `Can't reach database server`

**Solution:**
```bash
# Check containers are running
npm run db:status

# Restart if needed
npm run db:restart

# View logs
npm run db:logs postgres
```

### Prisma Client Out of Sync

**Error:** `Prisma Client is not generated`

**Solution:**
```bash
npm run prisma:generate
```

## 📈 Performance Tips

### Use Redis for Rate Limiting

Edit `.env.local`:
```env
USE_MEMORY_RATE_LIMIT=false
```

Benefits:
- Persistent rate limits across restarts
- Production-like behavior
- Shared state if running multiple processes

### Connection Pooling

For production, use PgBouncer or Prisma Data Proxy for connection pooling.

## 🎯 Next Steps

1. ✅ Databases running
2. ✅ Migrations applied
3. ✅ Dev server started
4. 📝 Create your first account
5. 🔑 Add provider configuration
6. 🚀 Optimize your first prompt!

## 📚 Additional Resources

- Full Setup Guide: `SETUP_GUIDE.md`
- Implementation Details: `IMPLEMENTATION_SUMMARY.md`
- Docker Compose Config: `docker-compose.dev.yml`
- Database Script: `scripts/dev-db.sh`

---

**Time to Production**: < 3 minutes ⚡️
**Databases**: PostgreSQL + Redis 🐘 + 🔴
**Management Tools**: PgAdmin + Redis Commander 🛠️
