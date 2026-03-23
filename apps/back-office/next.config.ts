import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  output: 'standalone',
  redirects: async () => [
    {
      destination: '/melden/locatie/:path*',
      permanent: false,
      source: '/locatie/:path*',
    },
    {
      destination: '/melden/aanvullende-vragen/:path*',
      permanent: false,
      source: '/aanvullende-vragen/:path*',
    },
    {
      destination: '/melden/bijlage',
      permanent: false,
      source: '/bijlage',
    },
    {
      destination: '/melden/contact',
      permanent: false,
      source: '/contact',
    },
    {
      destination: '/melden/samenvatting',
      permanent: false,
      source: '/samenvatting',
    },
    {
      destination: '/melden/cookie-storing',
      permanent: false,
      source: '/cookie-storing',
    },
    {
      destination: '/melden/bedankt',
      permanent: false,
      source: '/bedankt',
    },
  ],
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
