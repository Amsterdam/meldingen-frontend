import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: {
  output: string
  logging: { fetches: { fullUrl: boolean } }
  experimental: { allowDevelopmentBuild: boolean }
} = {
  output: 'standalone',
  experimental: {
    allowDevelopmentBuild: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
