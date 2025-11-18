import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Turbopack is enabled by default when using --turbo flag
    turbo: {},
  },

  // TypeScript configuration
  typescript: {
    // Fail build on type errors (strict mode)
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Fail build on lint errors
    ignoreDuringBuilds: false,
  },

  // Optimize images
  images: {
    remotePatterns: [],
  },

  // Environment variables exposed to browser
  env: {
    APP_NAME: 'EasyPrompt',
    APP_VERSION: '1.0.0',
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
