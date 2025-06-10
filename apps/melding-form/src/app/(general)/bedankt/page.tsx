import { cookies } from 'next/headers'
import NextLink from 'next/link'
import { getTranslations } from 'next-intl/server'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Heading, StandaloneLink } from '@meldingen/ui'

import { getDescription } from './utils'

export const generateMetadata = async () => {
  const t = await getTranslations('thanks')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const t = await getTranslations('thanks')

  const cookieStore = await cookies()

  const publicId = cookieStore.get('public_id')?.value
  const createdAt = cookieStore.get('created_at')?.value

  let description = getDescription(t, publicId, createdAt)

  return (
    <>
      <Heading className="ams-mb-m" level={1}>
        {t('title')}
      </Heading>
      <MarkdownToHtml className="ams-mb-m">{description}</MarkdownToHtml>
      <NextLink href="/" legacyBehavior passHref>
        <StandaloneLink href="dummy-href">{t('link')}</StandaloneLink>
      </NextLink>
    </>
  )
}
