# Docker Development Environment

## 🎯 What's Included

This Docker setup provides a complete development environment with:

- **PostgreSQL 16** - User authentication and provider configurations
- **Redis 7** - Rate limiting and caching
- **PgAdmin** (optional) - Web-based PostgreSQL management
- **Redis Commander** (optional) - Web-based Redis management

## 🚀 Quick Start (3 Commands)

```bash
# 1. Start databases
npm run db:start

# 2. Setup database tables
npm run setup:dev

# 3. Start development server
npm run dev
```

Open http://localhost:3000 🎉

## 📋 Available Commands

### Database Management

| Command | Description |
|---------|-------------|
| `npm run db:start` | Start PostgreSQL + Redis |
| `npm run db:start:tools` | Start with PgAdmin + Redis Commander |
| `npm run db:stop` | Stop all containers |
| `npm run db:restart` | Restart containers |
| `npm run db:status` | Show status and connection details |
| `npm run db:logs` | View logs (all services) |
| `npm run db:clean` | Remove containers + data ⚠️ |
| `npm run db:reset` | Reset database only ⚠️ |
| `npm run db:psql` | Connect to PostgreSQL CLI |
| `npm run db:backup` | Create SQL backup |

### Prisma Tools

| Command | Description |
|---------|-------------|
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Create/apply migrations |
| `npm run prisma:studio` | Open visual database editor |
| `npm run prisma:reset` | Reset database + migrations ⚠️ |

### One-Command Setup

| Command | Description |
|---------|-------------|
| `npm run setup:dev` | Start DB + Generate + Migrate (all in one) |

## 🔌 Connection Details

### PostgreSQL
```
Host:     localhost
Port:     5432
Database: easyprompt_dev
User:     postgres
Password: password
URL:      postgresql://postgres:password@localhost:5432/easyprompt_dev
```

### Redis
```
Host:     localhost
Port:     6379
Password: devpassword
URL:      redis://localhost:6379
```

### PgAdmin (when using `--tools`)
```
URL:      http://localhost:5050
Email:    admin@easyprompt.local
Password: admin
```

### Redis Commander (when using `--tools`)
```
URL:      http://localhost:8081
```

## 📊 Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Application                         │
│                  (npm run dev - Port 3000)                   │
└─────────────────────────────────────────────────────────────┘
                         │         │
              ┌──────────┘         └──────────┐
              │                                │
              ▼                                ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│     PostgreSQL 16        │    │       Redis 7            │
│   (Port 5432)            │    │   (Port 6379)            │
│                          │    │                          │
│  • User accounts         │    │  • Rate limiting         │
│  • Sessions              │    │  • Caching               │
│  • Provider configs      │    │  • Session storage       │
│  • Encrypted API keys    │    │                          │
└──────────────────────────┘    └──────────────────────────┘
              │                                │
              │                                │
              ▼                                ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│      PgAdmin 4           │    │   Redis Commander        │
│   (Port 5050)            │    │   (Port 8081)            │
│   Optional: --tools      │    │   Optional: --tools      │
└──────────────────────────┘    └──────────────────────────┘
```

## 🔧 Configuration Files

### `docker-compose.dev.yml`
Main Docker Compose configuration defining all services.

### `.env.local`
Local environment variables:
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/easyprompt_dev

# Redis
UPSTASH_REDIS_REST_URL=redis://localhost:6379
UPSTASH_REDIS_REST_TOKEN=devpassword
USE_MEMORY_RATE_LIMIT=false

# Security
ENCRYPTION_MASTER_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-change-in-production
```

### `scripts/dev-db.sh`
Bash script for managing Docker containers with helpful commands.

## 💾 Data Persistence

All data is stored in Docker volumes:

```bash
# View volumes
docker volume ls | grep easyprompt

# Output:
# easyprompt_postgres_data
# easyprompt_redis_data
# easyprompt_pgadmin_data
```

Data persists even when containers are stopped!

### Backup Data

```bash
# Create database backup
npm run db:backup

# Creates: backup_YYYYMMDD_HHMMSS.sql
```

### Restore Data

```bash
# From backup file
docker exec -i easyprompt-postgres-dev psql -U postgres easyprompt_dev < backup.sql
```

## 🎓 Usage Examples

### First Time Setup

```bash
# 1. Start services
npm run db:start:tools  # With web UIs

# 2. Setup database
npm run prisma:generate
npm run prisma:migrate

# 3. Open tools
# - PgAdmin: http://localhost:5050
# - Redis Commander: http://localhost:8081
# - Prisma Studio: npm run prisma:studio

# 4. Start development
npm run dev
```

### Daily Development

```bash
# Check if services are running
npm run db:status

# Start if needed
npm run db:start

# Start development server
npm run dev
```

### After Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npm run prisma:migrate

# Migration asks for name:
# ? Enter a name for the new migration: › add_user_avatar

# 3. Prisma client auto-regenerated
# 4. Restart Next.js
npm run dev
```

### Testing Production-Like Behavior

```bash
# Use Redis for rate limiting
# Edit .env.local:
USE_MEMORY_RATE_LIMIT=false

# Test rate limiting
# Makes 10+ requests quickly to trigger rate limit
```

### Debugging

```bash
# View logs
npm run db:logs postgres     # PostgreSQL logs
npm run db:logs redis        # Redis logs
npm run db:logs             # All logs

# Connect to databases
npm run db:psql             # PostgreSQL CLI
./scripts/dev-db.sh redis-cli   # Redis CLI

# Check container status
docker ps

# Inspect container
docker inspect easyprompt-postgres-dev
```

## 🔄 Update Process

### Update Docker Images

```bash
# Pull latest images
docker-compose -f docker-compose.dev.yml pull

# Restart with new images
npm run db:restart
```

### Change PostgreSQL/Redis Versions

Edit `docker-compose.dev.yml`:
```yaml
postgres:
  image: postgres:17-alpine  # Update version

redis:
  image: redis:8-alpine      # Update version
```

Then restart:
```bash
npm run db:restart
```

## 🧪 Testing Checklist

### Verify PostgreSQL

```bash
# Connect
npm run db:psql

# Run queries
SELECT version();
\l                          # List databases
\dt                         # List tables
\d users                    # Describe users table
SELECT * FROM users;        # View users
\q                          # Quit
```

### Verify Redis

```bash
# Connect
./scripts/dev-db.sh redis-cli

# Test commands
AUTH devpassword
PING                        # Should return PONG
INFO                        # Server info
KEYS *                      # List all keys
SET test "value"            # Set value
GET test                    # Get value
DEL test                    # Delete key
QUIT                        # Exit
```

### Verify Prisma

```bash
# Open Prisma Studio
npm run prisma:studio

# Visit http://localhost:5555
# - Browse tables
# - View/edit data
# - Check encrypted fields
```

## 🐛 Common Issues

### Port Already in Use

```bash
# Error: Bind for 0.0.0.0:5432 failed: port is already allocated

# Solution 1: Stop conflicting service
brew services stop postgresql  # macOS
sudo systemctl stop postgresql # Linux

# Solution 2: Change port in docker-compose.dev.yml
ports:
  - "5433:5432"  # Use 5433 instead

# Update .env.local:
DATABASE_URL=postgresql://postgres:password@localhost:5433/easyprompt_dev
```

### Container Won't Start

```bash
# View logs
npm run db:logs postgres

# Common issues:
# 1. Previous container not removed
docker rm -f easyprompt-postgres-dev

# 2. Volume corruption
npm run db:clean  # ⚠️ Deletes data
npm run setup:dev
```

### Permission Issues

```bash
# Error: permission denied: ./scripts/dev-db.sh

# Solution:
chmod +x scripts/dev-db.sh
```

### Database Connection Timeout

```bash
# Wait for PostgreSQL to be ready
# Usually takes 5-10 seconds after starting

# Check if ready
docker exec easyprompt-postgres-dev pg_isready -U postgres

# Output should be:
# /var/run/postgresql:5432 - accepting connections
```

## 🚀 Production Deployment

For production, **DO NOT** use this Docker setup. Instead:

1. Use managed services:
   - **PostgreSQL**: Supabase, Neon, Railway, Heroku
   - **Redis**: Upstash, Redis Cloud, AWS ElastiCache

2. Or self-host with:
   - Proper security (TLS, firewall rules)
   - Backups (automated, off-site)
   - Monitoring (alerts, logs)
   - High availability (replication, failover)

See `DEPLOYMENT.md` for production setup.

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🎯 Benefits of This Setup

✅ **No Manual Installation** - Everything in containers
✅ **Consistent Environment** - Same setup for all developers
✅ **Easy Reset** - Clean slate with one command
✅ **Data Persistence** - Data survives container restarts
✅ **Web Tools** - Visual database management
✅ **Production-Like** - Test with real PostgreSQL + Redis
✅ **Isolated** - Won't conflict with other projects

---

**Start Time**: < 1 minute ⚡️
**Setup Time**: < 3 minutes 🚀
**Isolation**: Complete 🔒
