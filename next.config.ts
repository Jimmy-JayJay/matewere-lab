import type { NextConfig } from 'next'

// Same setup as matewere-data. cacheComponents (the scaffold default) is off: experiments are
// plain pages, and an experiment that needs it can opt in on its own.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
