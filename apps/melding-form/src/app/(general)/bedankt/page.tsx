import { getTranslations } from 'next-intl/server'
import NextLink from 'next/link'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Heading, StandaloneLink } from '@meldingen/ui'

import { TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'

// The "description" translation also accepts undefined values for conditional rendering
type TWithUndefined = (key: string, values?: Record<string, string | number | Date | undefined>) => string

export const generateMetadata = async () => {
  const t = await getTranslations('thanks')

  return {
    title: t('metadata.title'),
  }
}

export default async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
  const t = (await getTranslations('thanks')) as TWithUndefined

  const { created_at: createdAt, id, public_id: publicId, source } = await searchParams

  const createdAtDate = createdAt ? new Date(createdAt) : undefined
  const date = createdAtDate?.toLocaleDateString('nl-NL')
  const time = createdAtDate?.toLocaleTimeString('nl-NL', { timeStyle: 'short' })

  const backOfficeBaseUrl = process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL

  const publicIdLinkOrText =
    source === 'back-office' && publicId && id && backOfficeBaseUrl
      ? `[${publicId}](${backOfficeBaseUrl}/melding/${id}?id=${publicId})`
      : publicId

  const description = t('description', { date, publicId: publicIdLinkOrText, time })

  const returnLink = source === 'back-office' ? `${backOfficeBaseUrl}/melden` : `/#${TOP_ANCHOR_ID}`

  return (
    <main>
      <Heading className="ams-mb-m" level={1}>
        {t('title')}
      </Heading>
      <MarkdownToHtml className="ams-mb-s">{description}</MarkdownToHtml>
      <NextLink href={returnLink} legacyBehavior passHref>
        <StandaloneLink href="dummy-href">{t('link')}</StandaloneLink>
      </NextLink>
    </main>
  )
}
