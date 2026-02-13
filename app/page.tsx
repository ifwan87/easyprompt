'use client'

import Link from 'next/link'
import { 
  Sparkles, Menu, Bot, BrainCircuit, Zap, Code2,
  Wand2, ShieldCheck, PlayCircle, Twitter, Github
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Header */}
      <header className="relative z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center justify-between mt-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg border group-hover:border-white/30 transition-colors bg-white/10 border-white/10">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm tracking-tight">EasyPrompt</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1 border rounded-full p-1 backdrop-blur-md bg-white/5 border-white/10">
              <a href="#features" className="px-4 py-1.5 text-xs font-medium transition-colors rounded-full text-white/70 hover:text-white hover:bg-white/5">Features</a>
              <a href="#models" className="px-4 py-1.5 text-xs font-medium transition-colors rounded-full text-white/70 hover:text-white hover:bg-white/5">Models</a>
              <a href="#pricing" className="px-4 py-1.5 text-xs font-medium transition-colors rounded-full text-white/70 hover:text-white hover:bg-white/5">Plans</a>
              <div className="pl-1">
                <Link href="/app" className="relative group inline-flex items-center justify-center overflow-hidden rounded-full p-[1px] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(74,222,128,0.5)] focus:outline-none active:scale-95">
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#4ade80_50%,#00000000)]"></span>
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-3xl transition-colors group-hover:bg-neutral-900 gap-2">
                    Try Optimizer
                    <Sparkles className="w-3 h-3 text-green-400" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 border rounded-lg backdrop-blur text-white/70 hover:text-white bg-white/5 border-white/10">
              <Menu className="w-5 h-5" />
            </button>
          </nav>

          {/* Hero Section */}
          <section className="relative z-10 text-center max-w-4xl mx-auto pt-24 pb-20 md:pt-32 md:pb-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 text-indigo-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-indigo-400"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[11px] uppercase font-medium tracking-wide">New: OpenRouter Integration with Free Models</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tighter mb-6 leading-[1.1]">
              Transform your AI prompts into{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                high-performing
              </span>{' '}
              instructions.
            </h1>

            <p className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 text-white/60 leading-relaxed">
              Analyze and optimize prompts for ChatGPT, Claude, and Gemini using scientifically-proven engineering techniques. Stop guessing, start engineering.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                href="/app"
                className="group inline-flex min-w-[160px] cursor-pointer overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-green-500 font-medium text-white bg-green-600 rounded-full px-8 py-3.5 items-center justify-center"
              >
                <span className="mr-2">Start Optimizing</span>
                <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
              </Link>
              <button className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium border rounded-full transition-all backdrop-blur-sm text-white/80 bg-white/5 border-white/10 hover:bg-white/10">
                <PlayCircle className="w-4 h-4" />
                Watch Demo
              </button>
            </div>
          </section>
        </div>
      </header>

      {/* Social Proof */}
      <section className="max-w-7xl mx-auto px-6 pb-20 border-b border-white/5">
        <p className="text-center text-xs font-medium uppercase tracking-widest mb-8 text-white/30">
          Optimized for output on
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Bot className="w-6 h-6" /> OpenAI
          </div>
          <div className="flex items-center gap-2 font-semibold text-lg">
            <BrainCircuit className="w-6 h-6" /> Anthropic
          </div>
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Zap className="w-6 h-6" /> Google DeepMind
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
            Built for Prompt Engineers
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Professional-grade tools to analyze, optimize, and test your prompts across multiple AI models.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
              <Wand2 className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Intelligent Analysis</h3>
            <p className="text-white/60 text-sm">
              AI-powered analysis identifies clarity issues, ambiguity, and optimization opportunities in your prompts.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Model Support</h3>
            <p className="text-white/60 text-sm">
              Test and optimize for OpenAI, Anthropic, Google, OpenRouter, and local Ollama models.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p className="text-white/60 text-sm">
              Your prompts stay private. Self-host or use our secure cloud with end-to-end encryption.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
          Ready to engineer better prompts?
        </h2>
        <p className="text-white/60 mb-8 text-lg">
          Join thousands of developers optimizing their AI interactions.
        </p>
        <Link
          href="/app"
          className="group inline-flex cursor-pointer overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-green-500 font-medium text-white bg-green-600 rounded-full px-8 py-4 items-center justify-center text-lg"
        >
          <span className="mr-2">Get Started Free</span>
          <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm">EasyPrompt</span>
          </div>
          <p className="text-white/40 text-sm">
            © 2026 EasyPrompt. Built with GitHub Copilot CLI.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/ifwan87/easyprompt-react" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
