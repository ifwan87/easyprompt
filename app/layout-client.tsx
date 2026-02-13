'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, GitCompare, BookTemplate, Activity, BookOpen } from 'lucide-react'
import { AuthNav } from '@/components/features/AuthNav'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'

  // Update body background color based on page
  useEffect(() => {
    if (isLandingPage) {
      document.body.style.backgroundColor = '#0a0a0a' // Dark background for landing
    } else {
      document.body.style.backgroundColor = '#ffffff' // White background for app
    }
  }, [isLandingPage])

  return (
    <>
      {!isLandingPage && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center justify-between h-14">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-base group transition-colors"
              >
                <Sparkles className="h-4 w-4 text-gray-700 group-hover:text-gray-900 transition-colors" />
                <span className="text-gray-900">EasyPrompt</span>
              </Link>

              <div className="flex items-center gap-1">
                <NavLink href="/app" icon={Sparkles}>
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
                <AuthNav />
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="animate-in">{children}</main>

      {!isLandingPage && (
        <footer className="border-t border-gray-200 mt-24">
          <div className="max-w-[1200px] mx-auto px-6 py-12">
            <div className="text-center">
              <p className="mb-2 text-sm text-gray-600">
                <strong className="font-semibold text-gray-900">EasyPrompt</strong> - AI Prompt
                Optimization Platform
              </p>
              <p className="text-gray-500 text-xs mb-4">
                Built with Next.js 16, React 19, TypeScript, and Tailwind CSS
              </p>
              <div className="flex justify-center gap-6 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-900 transition-colors">
                  GitHub
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Documentation
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  )
}

function NavLink({
  href,
  icon: Icon,
  children,
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
