/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Add metadata configuration
  metadata: {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    title: 'CodeTask',
    description: 'A task management application for developers',
    keywords: ['task management', 'code', 'productivity'],
    authors: [{ name: 'CodeTask Team' }],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      siteName: 'CodeTask',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'CodeTask',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CodeTask',
      description: 'A task management application for developers',
      images: ['/twitter-image.png'],
    },
  },

  // Add security headers
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
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; object-src 'none'; connect-src 'self' https://*.supabase.co;",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: [],
  },

  // Image optimization
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Webpack configuration
  webpack: (config) => {
    // Add any webpack customizations here
    return config;
  },
}

module.exports = nextConfig 