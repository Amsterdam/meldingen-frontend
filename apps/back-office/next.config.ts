import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
