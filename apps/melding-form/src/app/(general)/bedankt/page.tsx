import { cookies } from 'next/headers'
import NextLink from 'next/link'
import { getTranslations } from 'next-intl/server'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Heading, StandaloneLink } from '@meldingen/ui'

// The "description" translation also accepts undefined values for conditional rendering
type TWithUndefined = (key: string, values?: Record<string, string | number | Date | undefined>) => string

export const generateMetadata = async () => {
  const t = await getTranslations('thanks')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const t = (await getTranslations('thanks')) as TWithUndefined

  const cookieStore = await cookies()

  const publicId = cookieStore.get('public_id')?.value
  const createdAt = cookieStore.get('created_at')?.value

  const date = createdAt ? new Date(createdAt).toLocaleDateString('nl-NL') : undefined
  const time = createdAt ? new Date(createdAt).toLocaleTimeString('nl-NL', { timeStyle: 'short' }) : undefined

  const description = t('description', { publicId, date, time })

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
