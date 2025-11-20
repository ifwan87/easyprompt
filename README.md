# EasyPrompt

<div align="center">

### AI Prompt Optimization Platform with Multi-Provider Support

Transform your AI prompts from amateur to professional with instant optimization across multiple AI providers.

> **⚠️ Beta Release (v1.0.0-beta.1)**: EasyPrompt is currently in beta testing. Core features are stable and production-ready, but you may encounter issues. We welcome feedback and bug reports!

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

[![Status](https://img.shields.io/badge/Status-Beta-green?style=for-the-badge)](./STATUS.md)
[![Tests](https://img.shields.io/badge/Tests-13_Passing-success?style=for-the-badge)](./docs/archive/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](./docs/guides/deployment.md)

[🚀 Quick Start](#quick-start) •
[📖 Documentation](#documentation) •
[✨ Features](#features) •
[🤝 Contributing](./docs/guides/contributing.md)

</div>

---

## ✨ Features

### 🤖 Multi-Provider AI Support

Connect to **7 AI providers** with a unified interface:

**Commercial Providers:**
- 🧠 **Anthropic Claude** - Sonnet 4 & Opus (latest models)
- 🤖 **OpenAI GPT** - GPT-4 Turbo & GPT-4o
- 🌐 **Google Gemini** - Gemini 1.5 Pro & Flash

**Open-Source Providers:**
- 🦙 **Ollama** - Run Llama, Mistral, Phi locally (100% private)
- 🤗 **Hugging Face** - Access 1000+ open-source models
- 🚀 **Together AI** - Fast inference for open models
- 🔁 **Replicate** - Run models via API

All providers work through a **single, consistent interface** - write once, run anywhere!

---

### ⚡ Core Features

#### 1. 🎯 Smart Prompt Analysis
- **Real-time quality scoring** (0-100 scale)
- **Issue detection** - Identifies vague language, missing context, poor structure
- **Improvement suggestions** - Actionable recommendations
- **Scoring breakdown** - Clarity, specificity, structure, context analysis

#### 2. ✨ Automatic Optimization
- **AI-powered rewriting** - Transform amateur prompts to professional
- **Context enhancement** - Add missing details automatically
- **Structure improvement** - Organize prompts for better results
- **Best practices application** - Apply proven prompt engineering techniques
- **Before/After comparison** - See exactly what changed and why

#### 3. 🔄 Multi-Provider Comparison
- **Side-by-side comparison** - Run same prompt across all providers
- **Performance metrics** - Compare response quality, speed, cost
- **Provider recommendations** - Get suggestions for best provider for your use case
- **Real-world testing** - See actual AI responses, not just theory

#### 4. 📚 Professional Template Library
- **50+ ready-to-use templates** across 5 categories:
  - ✍️ **Writing** - Blog posts, emails, copywriting, social media
  - 💻 **Coding** - Code reviews, documentation, debugging, refactoring
  - 📊 **Analysis** - Data analysis, research, summarization
  - 🎨 **Creative** - Storytelling, brainstorming, content ideas
  - 🎓 **Education** - Lesson plans, explanations, tutoring
- **Search & Filter** - Find templates by keyword, category, or tag
- **Copy & Customize** - One-click copy or auto-fill in optimizer

#### 5. 🏥 Provider Health Monitoring
- **Real-time status checks** - See which providers are online
- **Latency tracking** - Monitor response times
- **Model availability** - Know which models are accessible
- **Auto-discovery** - Automatically detect Ollama models on your system
- **Connection diagnostics** - Troubleshoot provider issues

#### 6. 📖 Educational Guide
- **Prompt engineering principles** - Learn the fundamentals
- **Best practices** - Industry-standard techniques
- **Good vs Bad examples** - See what works and what doesn't
- **Provider-specific tips** - Optimize for each AI
- **Advanced techniques** - Chain-of-thought, few-shot learning, role-playing

#### 7. 🔐 User Authentication & Provider Management
- **Secure user accounts** - Email/password authentication
- **Encrypted API key storage** - AES-256-GCM encryption
- **Per-user configurations** - Each user manages their own API keys
- **Provider toggle** - Enable/disable providers per user
- **Session management** - Secure HTTP-only cookies

---

### 🔒 Privacy & Security

- ✅ **100% Local Option** - Run Ollama for complete privacy (no data leaves your machine)
- ✅ **API Key Encryption** - Military-grade AES-256-GCM encryption for stored keys
- ✅ **Password Security** - Bcrypt hashing with cost factor 12
- ✅ **Input Validation** - Length limits (10-5000 chars) to prevent abuse
- ✅ **Rate Limiting** - Built-in protection (100 requests/min) via Redis
- ✅ **No Data Logging** - Prompts are not saved or logged
- ✅ **Security Headers** - CSP, X-Frame-Options, HSTS configured
- ✅ **Type Safety** - Full TypeScript for reliability

---

### 💰 Cost Flexibility

**Free Options:**
- 🆓 **Ollama** - Completely free, runs locally
- 🆓 **Hugging Face** - Free tier available
- 🆓 **Google Gemini** - Generous free quota

**Paid Options:**
- 💰 **Anthropic Claude** - ~$3-15 per 1M tokens (highest quality)
- 💰 **OpenAI GPT** - ~$0.50-15 per 1M tokens (most popular)
- 💰 **Together AI** - ~$0.20-1 per 1M tokens (fast & affordable)
- 💰 **Replicate** - Pay-per-use pricing

**Mix & Match:** Use free providers for testing, paid for production!

---

### 🚀 Performance & Reliability

- ⚡ **Fast Loading** - < 1.5s page load with Next.js 16 Turbopack
- ⚡ **Quick Optimization** - < 3s average optimization time
- 📱 **Mobile Optimized** - Responsive design, works on all devices
- 🎨 **Modern UI** - Tailwind CSS 4 with Shadcn components
- 🔄 **React 19** - Latest features including Suspense & Transitions
- 🧪 **Tested** - 13 automated tests, TypeScript strict mode
- 📦 **Production Ready** - One-click Vercel deployment

---

## 🚀 Quick Start

### Option 1: Docker (Easiest - No Database Required) 🐳

**Using Pre-built Image (Fastest):**

```bash
# Pull and run from Docker Hub
docker pull amanasmuei/easyprompt:latest

# Run with your API key(s) - No database needed!
docker run -d -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your-key \
  -e ENABLE_ANTHROPIC=true \
  -e USE_MEMORY_RATE_LIMIT=true \
  amanasmuei/easyprompt:latest

# Open browser
open http://localhost:3000
```

**📖 Complete Docker Guide:** See [docs/getting-started/docker-setup.md](./docs/getting-started/docker-setup.md)

### Option 2: Node.js (No Database Required)

```bash
# Clone and install
git clone https://github.com/amanasmuei/easyprompt.git
cd easyprompt
npm install

# Configure (choose at least one provider)
cp .env.example .env.local
# Edit .env.local with your API keys

# Run - works immediately without database!
npm run dev
```

**Open** [http://localhost:3000](http://localhost:3000)

**Note:** Database is **optional**. The app works perfectly with environment variables only. Add database later if you want user authentication and per-user API key management.

### Option 3: With Database (Optional - For Multi-User & API Key Management)

**When you want user authentication and encrypted API key storage:**

```bash
# Start database services
npm run db:start

# Setup database
npm run setup:dev

# Start application
npm run dev
```

**Database enables:**
- 🔐 User authentication (signup/login)
- 🔑 Per-user encrypted API key storage
- 👥 Multi-user support
- ⚙️ Provider management UI

**📚 Detailed Setup Guide:** See [docs/getting-started/README.md](./docs/getting-started/README.md)

---

## Prerequisites

**Required (for basic usage):**
- **Docker:** Docker 20.10+ and Docker Compose 2.0+, OR
- **Node.js:** Node.js 20.9.0+ and npm 10.0.0+
- **At least ONE AI provider:**
  - 🆓 **Ollama** (free, local, private) - No API key needed
  - 💰 **Anthropic/OpenAI/Google** (paid, cloud) - API key required

**Optional (for advanced features):**
- **PostgreSQL 13+** - For user authentication and per-user API key storage
- **Redis 7+** - For production rate limiting (development uses in-memory)
- **Docker** - Makes database setup one-command easy

---

## Environment Setup

### Free & Local (Ollama)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.2

# Start Ollama
ollama serve
```

In `.env.local`:
```env
OLLAMA_ENDPOINT=http://127.0.0.1:11434
ENABLE_OLLAMA=true
USE_MEMORY_RATE_LIMIT=true
```

### Commercial Providers

Get API keys from:
- [Anthropic Claude](https://console.anthropic.com)
- [OpenAI](https://platform.openai.com/api-keys)
- [Google AI Studio](https://aistudio.google.com/app/apikey)

In `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
ENABLE_ANTHROPIC=true
ENABLE_OPENAI=true
ENABLE_GOOGLE=true
USE_MEMORY_RATE_LIMIT=true
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (Turbopack, React 19.2) |
| Language | TypeScript 5.7+ |
| Styling | Tailwind CSS 4 |
| UI Components | Shadcn/UI, Radix UI |
| Database | PostgreSQL 16, Prisma ORM |
| Caching | Redis 7 |
| AI SDKs | Anthropic, OpenAI, Google, Ollama, Hugging Face |
| Rate Limiting | Upstash Redis |
| Authentication | NextAuth v5 |
| Deployment | Vercel, Docker |

---

## Project Structure

```
easyprompt/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Home page (optimizer)
│   ├── auth/                  # Authentication pages
│   ├── settings/              # User settings & provider management
│   ├── compare/               # Multi-provider comparison
│   ├── providers/             # Provider status dashboard
│   ├── guide/                 # Best practices guide
│   └── templates/             # Prompt templates library
│
├── components/
│   ├── features/              # Feature components
│   ├── hooks/                 # Custom React hooks
│   └── ui/                    # UI components (Shadcn)
│
├── lib/
│   ├── actions/               # Server Actions
│   ├── providers/             # AI Provider adapters
│   │   ├── commercial/        # Anthropic, OpenAI, Google
│   │   └── open-source/       # Ollama, Hugging Face
│   ├── services/              # Business logic services
│   ├── security/              # Encryption & password utilities
│   ├── prompts/               # System prompts
│   └── db/                    # Database client
│
├── docs/                       # Documentation
│   ├── getting-started/       # Setup guides
│   ├── guides/                # User guides
│   ├── architecture/          # Technical architecture
│   └── archive/               # Historical docs
│
├── prisma/                     # Database schema
├── scripts/                    # Utility scripts
└── __tests__/                  # Test files
```

---

## 📖 Documentation

### Getting Started
- **[Quick Start Guide](./docs/getting-started/README.md)** - Complete setup guide
- **[Docker Setup](./docs/getting-started/docker-setup.md)** - Docker deployment guide
- **[Project Status](./STATUS.md)** - Current development status
- **[Changelog](./CHANGELOG.md)** - Version history

### Guides
- **[Contributing Guide](./docs/guides/contributing.md)** - How to contribute
- **[Deployment Guide](./docs/guides/deployment.md)** - Production deployment

### Architecture
- **[Technical Architecture](./docs/architecture/README.md)** - System design and architecture

---

## Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
npm run format           # Format with Prettier

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Database (if using database features)
npm run db:start         # Start PostgreSQL + Redis
npm run db:stop          # Stop database services
npm run db:status        # Check service status
npm run prisma:studio    # Visual database editor
npm run prisma:migrate   # Run database migrations
```

---

## Deployment

### Docker (Production Ready)

See [docs/getting-started/docker-setup.md](./docs/getting-started/docker-setup.md) for complete Docker deployment guide.

### Vercel (Serverless)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

Set environment variables in Vercel Dashboard → Settings → Environment Variables.

See [docs/guides/deployment.md](./docs/guides/deployment.md) for complete deployment guide.

---

## Troubleshooting

### Ollama not connecting

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Pull a model if needed
ollama pull llama3.2
```

### Rate limit errors

- Check Redis connection
- For development, set `USE_MEMORY_RATE_LIMIT=true`

### Build errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
```

### Database connection errors

```bash
# Check if services are running
npm run db:status

# Restart services
npm run db:restart
```

**More troubleshooting:** See [docs/getting-started/docker-setup.md#troubleshooting](./docs/getting-started/docker-setup.md#troubleshooting)

---

## Contributing

Contributions are welcome! Please read [docs/guides/contributing.md](./docs/guides/contributing.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](./LICENSE) file for details

---

## Acknowledgments

- Built with [Next.js 16](https://nextjs.org/)
- Powered by [Anthropic Claude](https://anthropic.com), [OpenAI](https://openai.com), [Google Gemini](https://ai.google.dev/), [Ollama](https://ollama.ai), [Hugging Face](https://huggingface.co)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/amanasmuei/easyprompt/issues)
- **Discussions:** [GitHub Discussions](https://github.com/amanasmuei/easyprompt/discussions)
- **Documentation:** [Full Docs](./docs/)

---

**Made with ❤️ for better AI prompts**
