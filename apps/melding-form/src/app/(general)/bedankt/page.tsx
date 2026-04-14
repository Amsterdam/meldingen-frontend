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

  const createdAt = (await searchParams).created_at
  const publicId = (await searchParams).public_id

  const date = createdAt ? new Date(createdAt).toLocaleDateString('nl-NL') : undefined
  const time = createdAt ? new Date(createdAt).toLocaleTimeString('nl-NL', { timeStyle: 'short' }) : undefined

  const description = t('description', { date, publicId, time })

  return (
    <main>
      <Heading className="ams-mb-m" level={1}>
        {t('title')}
      </Heading>
      <MarkdownToHtml className="ams-mb-s">{description}</MarkdownToHtml>
      <NextLink href={`/#${TOP_ANCHOR_ID}`} legacyBehavior passHref>
        <StandaloneLink href="dummy-href">{t('link')}</StandaloneLink>
      </NextLink>
    </main>
  )
}
