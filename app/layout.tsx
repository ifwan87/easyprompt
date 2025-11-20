import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Sparkles, GitCompare, BookTemplate, Activity, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'EasyPrompt - AI Prompt Optimization Platform',
  description:
    'Transform your AI prompts from amateur to professional with instant optimization across multiple AI providers.',
  keywords: [
    'AI',
    'prompt engineering',
    'prompt optimization',
    'ChatGPT',
    'Claude',
    'Gemini',
    'Ollama',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-white">
        {/* Minimal Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-base group transition-colors"
              >
                <Sparkles className="h-4 w-4 text-gray-700 group-hover:text-gray-900 transition-colors" />
                <span className="text-gray-900">
                  EasyPrompt
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-1">
                <NavLink href="/" icon={Sparkles}>
                  Optimize
                </NavLink>
                <NavLink href="/compare" icon={GitCompare}>
                  Compare
                </NavLink>
                <NavLink href="/templates" icon={BookTemplate}>
                  Templates
                </NavLink>
                <NavLink href="/providers" icon={Activity}>
                  Providers
                </NavLink>
                <NavLink href="/guide" icon={BookOpen}>
                  Guide
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="animate-in">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-gray-200 mt-24">
          <div className="max-w-[1200px] mx-auto px-6 py-12">
            <div className="text-center">
              <p className="mb-2 text-sm text-gray-600">
                <strong className="font-semibold text-gray-900">EasyPrompt</strong> - AI Prompt Optimization Platform
              </p>
              <p className="text-gray-500 text-xs mb-4">
                Built with Next.js 16, React 19, TypeScript, and Tailwind CSS
              </p>
              <div className="flex justify-center gap-6 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-900 transition-colors">GitHub</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Documentation</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

function NavLink({
  href,
  icon: Icon,
  children
}: {
  href: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150 font-medium"
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{children}</span>
    </Link>
  )
}
