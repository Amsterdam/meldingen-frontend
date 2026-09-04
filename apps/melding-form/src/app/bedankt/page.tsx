import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'
import NextLink from 'next/link'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Heading, StandaloneLink } from '@meldingen/ui'
import { formatDateString } from '@meldingen/utils'

import { BackOfficeLayout, RegularLayout } from '../_components'
import { TOP_ANCHOR_ID } from '~/constants'

// The "description" translation also accepts undefined values for conditional rendering
type TWithUndefined = (key: string, values?: Record<string, string | number | Date | undefined>) => string

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('thanks')

  return {
    title: t('metadata.title'),
  }
}

export default async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
  const t = (await getTranslations('thanks')) as TWithUndefined

  const { created_at: createdAt, id, public_id: publicId, source } = await searchParams

  const { date, time } = createdAt ? formatDateString(createdAt) : { date: undefined, time: undefined }

  const backOfficeBaseUrl = process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL
  const publicIdLinkOrText =
    source === 'back-office' && publicId && id && backOfficeBaseUrl
      ? `[${publicId}](${backOfficeBaseUrl}/melding/${id}?id=${encodeURIComponent(publicId)})`
      : publicId

  const description = t('description', { date, publicId: publicIdLinkOrText, time })

  const returnLink = source === 'back-office' ? `${backOfficeBaseUrl}/melden` : `/#${TOP_ANCHOR_ID}`

  const Layout = source === 'back-office' ? BackOfficeLayout : RegularLayout

  return (
    <Layout>
      <main>
        <Heading className="ams-mb-m" level={1}>
          {t('title')}
        </Heading>
        <MarkdownToHtml className="ams-mb-s">{description}</MarkdownToHtml>
        <StandaloneLink href={returnLink} linkComponent={NextLink}>
          {t('link')}
        </StandaloneLink>
      </main>
    </Layout>
  )
}
