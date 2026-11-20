import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  agentRules: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  distDir: process.env.PLAYWRIGHT_TEST === '1' ? '.next-e2e' : '.next',
  output: 'standalone',
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
