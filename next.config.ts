import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // TypeScript configuration
  typescript: {
    // Fail build on type errors (strict mode)
    ignoreBuildErrors: false,
  },

  // Output configuration - disable static export for now
  output: 'standalone',



  // Optimize images
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables exposed to browser
  env: {
    APP_NAME: 'EasyPrompt',
    APP_VERSION: '1.0.0',
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
