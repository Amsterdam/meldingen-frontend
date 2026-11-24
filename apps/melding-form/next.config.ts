import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  agentRules: false,
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  output: 'standalone',
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
