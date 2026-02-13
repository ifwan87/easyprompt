import type { Metadata } from 'next'
import './globals.css'
import { LayoutClient } from './layout-client'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
