import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  output: 'standalone',
  compiler: {
    removeConsole: false,
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
