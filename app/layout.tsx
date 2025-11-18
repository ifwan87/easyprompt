import type { Metadata } from 'next'
import './globals.css'

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
      <body className="antialiased">{children}</body>
    </html>
  )
}
