import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  output: 'standalone',
  rewrites: async () => [
    {
      destination: `${process.env.MELDING_FORM_INTERNAL_URL}/bo/aanvullende-vragen/:path*`,
      source: '/aanvullende-vragen/:path*',
    },
    { destination: `${process.env.MELDING_FORM_INTERNAL_URL}/bo/bijlage`, source: '/bijlage' },
    { destination: `${process.env.MELDING_FORM_INTERNAL_URL}/bo/contact`, source: '/contact' },
    { destination: `${process.env.MELDING_FORM_INTERNAL_URL}/cookie-storing`, source: '/cookie-storing' },
    { destination: `${process.env.MELDING_FORM_INTERNAL_URL}/bo/locatie`, source: '/locatie' },
    { destination: `${process.env.MELDING_FORM_INTERNAL_URL}/locatie/kies`, source: '/locatie/kies' },
    { destination: `${process.env.MELDING_FORM_INTERNAL_URL}/bo/samenvatting`, source: '/samenvatting' },
    { destination: `${process.env.MELDING_FORM_INTERNAL_URL}/bo/bedankt`, source: '/bedankt' },
  ],
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
