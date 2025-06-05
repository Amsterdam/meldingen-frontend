import { cookies } from 'next/headers'
import NextLink from 'next/link'
import { getTranslations } from 'next-intl/server'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Heading, StandaloneLink } from '@meldingen/ui'

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

  if (!publicId || !createdAt) return undefined

  const date = new Date(createdAt).toLocaleDateString('nl-NL')
  const time = new Date(createdAt).toLocaleTimeString('nl-NL', { timeStyle: 'short' })

  return (
    <>
      <Heading className="ams-mb-m" level={1}>
        {t('title')}
      </Heading>
      <MarkdownToHtml className="ams-mb-m">{t('description', { publicId, date, time })}</MarkdownToHtml>
      <NextLink href="/" legacyBehavior passHref>
        <StandaloneLink href="dummy-href">{t('link')}</StandaloneLink>
      </NextLink>
    </>
  )
}
