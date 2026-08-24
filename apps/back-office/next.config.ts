import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  experimental: {
    serverActions: {
      // Expect client to catch file sizes within reasonable limits
      bodySizeLimit: '50mb',
    },
  },
  output: 'standalone',
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
