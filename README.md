# EasyPrompt - AI Prompt Optimization Platform

> **Transform amateur prompts into professional-grade AI instructions in seconds**

EasyPrompt is a production-ready platform that analyzes, optimizes, and compares AI prompts across multiple providers. Built with Next.js 16, React 19, and TypeScript, it democratizes prompt engineering expertise, turning anyone into an effective AI user.

## 🎯 Overview

Stop wasting time and tokens on ineffective prompts. EasyPrompt uses scientifically-proven prompt engineering techniques to transform your AI interactions across ChatGPT, Claude, Gemini, and other Large Language Models.

## ✨ Key Features

**🧠 Deep Analysis Engine**
- Analyzes 7 critical metrics: clarity, specificity, structure, context, constraints, output format, and edge cases
- Provides actionable feedback with improvement scores (0-100)
- Scientific rubric used by professional prompt engineers

**🎨 Smart Optimization**
- AI-powered rewriting preserving your intent
- Uses advanced techniques: chain-of-thought, few-shot learning, role-playing
- Explains what changed and why it matters

**🔄 Multi-Provider Support**
- Supports 4 major AI providers: Anthropic Claude, OpenAI GPT, Google Gemini, Ollama
- Real-time provider health monitoring with latency tracking
- Side-by-side comparison to find the best provider for your use case

**📚 Professional Template Library**
- 7 battle-tested templates for common use cases
- Code review, content creation, data analysis, technical writing, and more
- Instant starting points for complex tasks

**🔒 Enterprise-Grade Security**
- Rate limiting (100 requests/min) with Upstash Redis
- Comprehensive security headers (CSP, HSTS, X-Frame-Options)
- Input validation and sanitization
- Secure API key management

**📊 Provider Insights**
- Real-time health checks and status monitoring
- Latency tracking across providers
- Model availability and pricing information

## ✨ Features

- **Multi-Provider Support**: Works with Anthropic Claude, OpenAI, Google Gemini, Ollama, and more (7 providers total)
- **Intelligent Analysis**: Analyzes prompt quality, clarity, structure, and specificity with detailed scoring
- **Smart Optimization**: Automatically rewrites prompts using best practices with explanations
- **Real-time Feedback**: Get instant suggestions and improvements as you work
- **Provider Comparison**: Compare optimization results across multiple AI providers side-by-side
- **Template Library**: 7 professional templates for code review, content creation, data analysis, and more
- **Provider Monitoring**: Real-time health checks, latency tracking, and model availability
- **Security First**: Rate limiting, input validation, and secure API key management

## 🚀 Quick Start

### Prerequisites

- Node.js v20.9+ (recommended: v22.x)
- npm v10+
- API keys for your preferred AI provider(s)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/ifwan87/easyprompt-react.git
cd easyprompt-react
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` and add your API keys:
\`\`\`env
DATABASE_URL=file:./dev.db
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
USE_MEMORY_RATE_LIMIT=true
ENABLE_ANTHROPIC=true
\`\`\`

4. Initialize the database:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.3 (with Turbopack)
- **UI**: React 19.2.0
- **Database**: SQLite with Prisma ORM 5.22.0
- **AI Providers**: 
  - Anthropic Claude API
  - OpenAI API
  - Google Gemini API
  - Ollama (local)
- **Styling**: CSS Modules
- **Authentication**: Custom auth system

## 📖 Usage

1. **Enter Your Prompt**: Type or paste your prompt in the input field
2. **Select AI Provider**: Choose from Claude, GPT, Gemini, or Ollama
3. **Analyze**: Click "Analyze" to get a quality score and detailed feedback
4. **Optimize**: Click "Optimize" to get an improved version of your prompt
5. **Compare**: Review the improvements and reasoning
6. **Use**: Copy the optimized prompt for your AI interactions

## 🔑 API Keys

### Anthropic Claude
- Sign up at [console.anthropic.com](https://console.anthropic.com)
- Free tier includes Claude 3 Haiku model
- Paid tier unlocks Claude 3.5 Sonnet and Claude 3 Opus

### OpenAI
- Sign up at [platform.openai.com](https://platform.openai.com)
- Supports GPT-4, GPT-3.5, and other models

### Google Gemini
- Get API key from [ai.google.dev](https://ai.google.dev)

### Ollama (Local)
- Install from [ollama.ai](https://ollama.ai)
- No API key required - runs locally

## 📁 Project Structure

\`\`\`
easyprompt/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/
│   ├── actions/           # Server actions
│   ├── providers/         # AI provider implementations
│   ├── services/          # Business logic
│   └── prompts/           # System prompts
├── prisma/                # Database schema
├── public/                # Static assets
└── types/                 # TypeScript types
\`\`\`

## �� Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- Claude 3.5 Sonnet and Opus require paid Anthropic API tier
- Free tier Anthropic keys only support Claude 3 Haiku

## 📧 Support

For issues and questions, please open an issue on GitHub.


---

Made with ❤️ for better AI interactions
