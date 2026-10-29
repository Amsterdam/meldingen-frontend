import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  distDir: process.env.PLAYWRIGHT_TEST === '1' ? '.next-e2e' : '.next',
  output: 'standalone',
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
