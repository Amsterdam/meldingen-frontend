import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '',
  output: 'standalone',
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
