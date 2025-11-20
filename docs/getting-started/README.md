# Getting Started with EasyPrompt

Welcome! This guide will help you get EasyPrompt running in minutes.

---

## What is EasyPrompt?

EasyPrompt is an AI prompt optimization platform that transforms amateur AI prompts into professional ones instantly. It analyzes your prompts, identifies issues, and generates optimized versions across multiple AI providers.

**Perfect for:**
- Developers using AI APIs
- Content creators working with ChatGPT/Claude
- Anyone who wants better AI responses
- Teams optimizing prompt strategies

---

## Quick Start (30 Seconds)

**🎯 Choose Your Path:**

### Path 1: Simple & Fast (No Database Required)

```bash
# Using Docker
docker run -d -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your-key \
  -e ENABLE_ANTHROPIC=true \
  -e USE_MEMORY_RATE_LIMIT=true \
  amanasmuei/easyprompt:latest

# OR using Node.js
npm install && cp .env.example .env.local && npm run dev
```

**Open** http://localhost:3000 - Start optimizing immediately!

### Path 2: Full Features (With Database - Optional)

**Only needed if you want user authentication & per-user API key management:**

```bash
# Start database + app
npm run db:start && npm run setup:dev && npm run dev
```

**Open** http://localhost:3000 - Now with user accounts!

---

## Prerequisites

### 🚀 For Basic Usage (No Database Needed!)

**Choose ONE:**
- ✅ **Docker 20.10+** ([Download](https://docs.docker.com/get-docker/)), OR
- ✅ **Node.js 20.9.0+ and npm 10.0.0+** ([Download](https://nodejs.org/))

**Plus at least ONE AI provider:**
- 🆓 **Ollama** (free, local, no API key), OR
- 💰 **Anthropic/OpenAI/Google** (paid, requires API key)

### 🔐 For Advanced Features (Optional)

**Only if you want user authentication & per-user API key management:**
- ✅ **PostgreSQL 13+** - User database (Docker makes this easy!)
- ✅ **Redis 7+** - Production rate limiting (optional, uses in-memory otherwise)

**💡 Recommendation:** Start without database. Add it later when you need multi-user features!

---

## Installation

### Option 1: Docker (Fastest) ⚡

**Using Pre-built Image from Docker Hub:**

```bash
# Pull the latest image
docker pull amanasmuei/easyprompt:beta

# Run with your API key
docker run -d -p 3000:3000 \
  --name easyprompt \
  -e ANTHROPIC_API_KEY=your-key-here \
  -e ENABLE_ANTHROPIC=true \
  -e USE_MEMORY_RATE_LIMIT=true \
  amanasmuei/easyprompt:beta

# Open browser
open http://localhost:3000
```

**📖 More Docker Options:** See [docker-setup.md](./docker-setup.md) for complete Docker setup instructions.

### Option 2: Node.js (Traditional)

```bash
# 1. Clone the repository
git clone https://github.com/amanasmuei/easyprompt.git
cd easyprompt

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Edit .env.local with your settings
nano .env.local  # or use your preferred editor
```

---

## Provider Configuration

Choose **at least ONE** provider option below:

### Option 1: Free & Local (Ollama) 🆓

**Best for:** Privacy, zero cost, offline usage

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (e.g., Llama 3.2)
ollama pull llama3.2

# Start Ollama server
ollama serve
```

In `.env.local`:
```env
OLLAMA_ENDPOINT=http://127.0.0.1:11434
ENABLE_OLLAMA=true
USE_MEMORY_RATE_LIMIT=true
```

**Advantages:**
- ✅ Completely free
- ✅ 100% private (runs locally)
- ✅ No API keys needed
- ✅ Works offline

### Option 2: Anthropic Claude 🧠

**Best for:** Highest quality responses, advanced reasoning

1. Get API key: [console.anthropic.com](https://console.anthropic.com)
2. Add to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
ENABLE_ANTHROPIC=true
USE_MEMORY_RATE_LIMIT=true
```

**Pricing:** ~$3-15 per 1M tokens

### Option 3: OpenAI GPT 🤖

**Best for:** Most popular, widely supported

1. Get API key: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Add to `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here
ENABLE_OPENAI=true
USE_MEMORY_RATE_LIMIT=true
```

**Pricing:** ~$0.50-15 per 1M tokens

### Option 4: Google Gemini 🌐

**Best for:** Google ecosystem, competitive pricing

1. Get API key: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Add to `.env.local`:

```env
GOOGLE_API_KEY=your-key-here
ENABLE_GOOGLE=true
USE_MEMORY_RATE_LIMIT=true
```

**Pricing:** Free tier available, then ~$0.25-7 per 1M tokens

---

## Database Setup (Optional)

For user authentication and provider management features:

### Quick Setup with Docker

```bash
# Start PostgreSQL + Redis
npm run db:start

# Setup database tables
npm run setup:dev
```

### Manual Setup

See [docker-setup.md](./docker-setup.md#database-setup) for detailed database configuration.

---

## Running the Application

### Development Mode

```bash
# Without database
npm run dev

# With database (after db:start)
npm run setup:dev && npm run dev
```

**Output:**
```
✓ Starting...
✓ Ready in 1.5s
- Local:   http://localhost:3000
- Network: http://192.168.0.x:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Mode

```bash
npm run build
npm start
```

---

## Your First Prompt Optimization

### 1. Open the Application

Navigate to [http://localhost:3000](http://localhost:3000)

### 2. Select a Provider

Choose from the dropdown (e.g., "Ollama" or "Anthropic Claude")

### 3. Enter a Prompt

Try this example:
```
write a blog post about AI
```

### 4. Click "Optimize My Prompt"

EasyPrompt will:
- ✅ Analyze your prompt
- ✅ Identify issues (too vague, missing context)
- ✅ Generate an optimized version
- ✅ Show improvements

### 5. See the Results

You'll see:
- **Quality Score**: 45/100 → 95/100
- **Issues Found**: Lack of specificity, missing audience
- **Optimized Prompt**: Professional version with context
- **Improvements**: Clear explanation of changes

---

## Key Features

### 🔄 Compare Across Providers

1. Go to [localhost:3000/compare](http://localhost:3000/compare)
2. Enter your prompt
3. Click "Compare Across Providers"
4. See how different AIs optimize differently
5. Choose the best optimization

### 📚 Browse Templates

1. Go to [localhost:3000/templates](http://localhost:3000/templates)
2. Browse 50+ templates across 5 categories
3. Filter by category (Writing, Coding, Analysis, etc.)
4. Click to copy and customize

### 🏥 Monitor Provider Health

1. Go to [localhost:3000/providers](http://localhost:3000/providers)
2. See real-time status of all providers
3. Check latency and availability
4. Discover local Ollama models

### 📖 Learn Best Practices

1. Go to [localhost:3000/guide](http://localhost:3000/guide)
2. Read prompt engineering principles
3. See good vs bad examples
4. Learn provider-specific tips

---

## Common Commands

### Development

```bash
npm run dev              # Start dev server (Turbopack)
npm run build            # Build for production
npm start                # Start production server
```

### Code Quality

```bash
npm run lint             # Check code style
npm run lint:fix         # Fix code style issues
npm run type-check       # TypeScript validation
npm run format           # Format with Prettier
```

### Database Operations (if using database features)

```bash
npm run db:start         # Start PostgreSQL + Redis
npm run db:start:tools   # Start with web management UIs
npm run db:status        # Check service status
npm run db:stop          # Stop containers
npm run db:logs          # View logs
npm run db:psql          # Connect to PostgreSQL
npm run prisma:studio    # Visual database editor
```

---

## Troubleshooting

### Ollama Not Connecting

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it
ollama serve

# If no models, pull one
ollama pull llama3.2
```

### API Key Errors

- ✅ Check key is correct (no extra spaces)
- ✅ Verify provider is enabled in `.env.local`
- ✅ Restart dev server after changing `.env.local`

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

### Database Connection Errors

```bash
# Check if PostgreSQL is running
npm run db:status

# Restart containers
npm run db:restart

# View error logs
npm run db:logs
```

---

## Next Steps

### Add Multiple Providers

Edit `.env.local` to add multiple providers:

```env
# Multiple providers for comparison
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
OLLAMA_ENDPOINT=http://127.0.0.1:11434

# Enable all
ENABLE_ANTHROPIC=true
ENABLE_OPENAI=true
ENABLE_GOOGLE=true
ENABLE_OLLAMA=true
```

### Explore Documentation

- **[../guides/deployment.md](../guides/deployment.md)** - Production deployment
- **[../guides/contributing.md](../guides/contributing.md)** - Contributing guide
- **[../architecture/README.md](../architecture/README.md)** - Technical architecture
- **[docker-setup.md](./docker-setup.md)** - Complete Docker guide

### Enable User Authentication

```bash
# Start database services
npm run db:start

# Run database migrations
npm run setup:dev

# Start application
npm run dev
```

Now you can:
- ✅ Create user accounts
- ✅ Store encrypted API keys per user
- ✅ Manage provider configurations
- ✅ Share prompts and templates

---

## Support & Community

### Get Help

- **Issues**: [GitHub Issues](https://github.com/amanasmuei/easyprompt/issues)
- **Discussions**: [GitHub Discussions](https://github.com/amanasmuei/easyprompt/discussions)
- **Documentation**: [Full Documentation](../)

### Contributing

We welcome contributions! See [../guides/contributing.md](../guides/contributing.md)

---

## What's Next?

Now that you're set up:

1. ✅ Try optimizing different types of prompts
2. ✅ Compare results across providers
3. ✅ Explore the templates library
4. ✅ Read the guide for best practices
5. ✅ Share feedback or contribute

---

**Happy prompting!** 🚀

Need help? [Open an issue](https://github.com/amanasmuei/easyprompt/issues)
