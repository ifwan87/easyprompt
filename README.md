# EasyPrompt

<div align="center">

### AI Prompt Optimization Platform with Multi-Provider Support

Transform your AI prompts from amateur to professional with instant optimization across multiple AI providers.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

[![Status](https://img.shields.io/badge/Status-Beta-green?style=for-the-badge)](./STATUS.md)
[![Tests](https://img.shields.io/badge/Tests-13_Passing-success?style=for-the-badge)](./docs/internal/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](./DEPLOYMENT.md)

[🚀 Quick Start](#quick-start) •
[📖 Documentation](#documentation) •
[✨ Features](#features) •
[🤝 Contributing](./CONTRIBUTING.md) •
[📋 Status](./STATUS.md)

</div>

---

## ✨ Features

### 🤖 Multi-Provider AI Support

Connect to **7 different AI providers** with a unified interface:

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
- **Category browsing** - Organized by use case

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

---

### 🔒 Privacy & Security

- ✅ **100% Local Option** - Run Ollama for complete privacy (no data leaves your machine)
- ✅ **API Key Protection** - All keys stored in environment variables
- ✅ **Input Validation** - Length limits (10-5000 chars) to prevent abuse
- ✅ **Rate Limiting** - Built-in protection (20 requests/min) via Redis
- ✅ **No Data Storage** - Prompts are not saved or logged
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

```bash
# Clone and install
git clone https://github.com/amanasmuei/easyprompt.git
cd easyprompt
npm install

# Configure (choose at least one provider)
cp .env.example .env.local
# Edit .env.local with your API keys

# Run
npm run dev
```

**Open** [http://localhost:3000](http://localhost:3000)

**📚 New to EasyPrompt?** Read the [**Getting Started Guide**](./GETTING_STARTED.md) for detailed setup instructions.

### Prerequisites

- Node.js 20.9.0+ and npm 10.0.0+
- At least ONE AI provider:
  - 🆓 **Ollama** (free, local, private) - [Setup Guide](./GETTING_STARTED.md#option-1-free--local-ollama-)
  - 💰 **Anthropic/OpenAI/Google** (paid, cloud) - [API Keys](./GETTING_STARTED.md#provider-setup)

---

## Environment Setup

### Option 1: Free & Local (Ollama)

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
```

### Option 2: Commercial Providers

Get API keys from:
- [Anthropic Claude](https://console.anthropic.com)
- [OpenAI](https://platform.openai.com/api-keys)
- [Google AI Studio](https://aistudio.google.com/app/apikey)

In `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
```

### Option 3: Open-Source Cloud

Get API keys from:
- [Hugging Face](https://huggingface.co/settings/tokens) (free tier)
- [Together AI](https://api.together.xyz)
- [Replicate](https://replicate.com/account/api-tokens)

In `.env.local`:
```env
HUGGINGFACE_API_KEY=hf_...
TOGETHER_API_KEY=...
REPLICATE_API_KEY=r8_...
```

---

## Usage

### Basic Prompt Optimization

1. Visit **EasyPrompt**
2. Select your AI provider
3. Enter your prompt
4. Click "Optimize My Prompt"
5. See optimized version with improvements explained
6. Copy and use!

### Multi-Provider Comparison

1. Go to **Compare** page
2. Enter your prompt
3. Click "Compare Across All Providers"
4. See how different AIs optimize differently
5. Choose the best optimization

### Using Templates

1. Visit **Templates** page
2. Browse categories (Writing, Coding, Analysis, etc.)
3. Click template to use
4. Customize for your needs

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (Turbopack, React 19.2) |
| Language | TypeScript 5.1+ |
| Styling | Tailwind CSS 4 |
| UI Components | Shadcn/UI, Radix UI |
| AI SDKs | Anthropic, OpenAI, Google, Ollama, Hugging Face |
| Rate Limiting | Upstash Redis |
| Deployment | Vercel |

---

## Project Structure

```
easyprompt/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── compare/           # Multi-provider comparison
│   ├── providers/         # Provider status
│   ├── guide/             # Best practices
│   └── templates/         # Prompt templates
├── components/
│   ├── server/            # Server Components
│   └── client/            # Client Components
├── lib/
│   ├── actions/           # Server Actions
│   ├── providers/         # AI Provider adapters
│   │   ├── commercial/    # Anthropic, OpenAI, Google
│   │   └── open-source/   # Ollama, Hugging Face
│   └── prompts/           # System prompts
└── proxy.ts               # Rate limiting
```

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

# Analysis
npm run analyze          # Analyze bundle size
```

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

**Required:**
- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` or `GOOGLE_API_KEY` or Ollama running
- `UPSTASH_REDIS_REST_URL` (for rate limiting)
- `UPSTASH_REDIS_REST_TOKEN` (for rate limiting)

**Optional:**
- `HUGGINGFACE_API_KEY`
- `TOGETHER_API_KEY`
- `REPLICATE_API_KEY`

---

## Configuration

### Next.js 16 Features

This project uses the latest Next.js 16 features:

- ✅ **Turbopack** - 10x faster bundling
- ✅ **"use cache"** - Component-level caching
- ✅ **proxy.ts** - Rate limiting (replaces middleware.ts)
- ✅ **React 19.2** - View Transitions
- ✅ **React Compiler** - Automatic memoization

### Rate Limiting

Default: 20 requests per minute per IP

Configure in `proxy.ts`:
```typescript
limiter: Ratelimit.slidingWindow(20, '60 s')
```

---

## 📖 Documentation

### For Users
- **[Getting Started](./GETTING_STARTED.md)** - Complete setup guide for beginners
- **[Project Status](./STATUS.md)** - Current development status
- **[Changelog](./CHANGELOG.md)** - Version history and updates

### For Developers
- **[Architecture](./ARCHITECTURE.md)** - Technical architecture and design
- **[Contributing](./CONTRIBUTING.md)** - How to contribute to the project
- **[Deployment](./DEPLOYMENT.md)** - Production deployment guide

### For Advanced Users
- **[Documentation Index](./docs/)** - All documentation
- **[Internal Docs](./docs/internal/)** - Development reports and analysis

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

- Check Upstash Redis connection
- Verify environment variables
- For development, set `USE_MEMORY_RATE_LIMIT=true`

### Build errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 20.9.0+
```

---

## Performance

Target metrics:
- Page Load: < 1.5s
- Optimization Time: < 3s
- Lighthouse Score: 95+
- Mobile Performance: 95+

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

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
- **Documentation:** [Architecture Guide](./ARCHITECTURE.md)

---

**Made with ❤️ for better AI prompts**
