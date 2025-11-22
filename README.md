# EasyPrompt - AI Prompt Optimization Platform

Transform your AI prompts into high-performing instructions with EasyPrompt. Analyze and optimize prompts for ChatGPT, Claude, Gemini, and other Large Language Models using scientifically-proven prompt engineering techniques.

## ✨ Features

- **Multi-Provider Support**: Works with Anthropic Claude, OpenAI, Google Gemini, Ollama, and more
- **Intelligent Analysis**: Analyzes prompt quality, clarity, structure, and specificity
- **Smart Optimization**: Automatically rewrites prompts using best practices
- **Real-time Feedback**: Get instant suggestions and improvements
- **Prompt History**: Track and compare your prompt iterations
- **User Authentication**: Secure user accounts with API key management

## 🚀 Getting Started

### Prerequisites

- Node.js v20.19+ (recommended: v20.19.5)
- npm v10+

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/ifwan87/easyprompt.git
cd easyprompt
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

## 🙏 Acknowledgments

- Original project by [amanasmuei](https://github.com/amanasmuei/EasyPrompt)
- Forked and enhanced by [ifwan87](https://github.com/ifwan87)

---

Made with ❤️ for better AI interactions
