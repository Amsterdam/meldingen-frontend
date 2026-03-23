import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import NextLink from 'next/link'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Heading, StandaloneLink } from '@meldingen/ui'

import { COOKIES, TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'

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

  const publicId = cookieStore.get(COOKIES.PUBLIC_ID)?.value
  const createdAt = cookieStore.get(COOKIES.CREATED_AT)?.value

  const date = createdAt ? new Date(createdAt).toLocaleDateString('nl-NL') : undefined
  const time = createdAt ? new Date(createdAt).toLocaleTimeString('nl-NL', { timeStyle: 'short' }) : undefined

  const description = t('description', { date, publicId, time })

  const backOfficeBaseUrl = process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL
  const source = cookieStore.get(COOKIES.SOURCE)?.value
  const returnLink = source === 'back-office' ? `${backOfficeBaseUrl}/melden` : `/#${TOP_ANCHOR_ID}`

  return (
    <main>
      <Heading className="ams-mb-m" level={1}>
        {t('title')}
      </Heading>
      <MarkdownToHtml className="ams-mb-m">{description}</MarkdownToHtml>
      <NextLink href={returnLink} legacyBehavior passHref>
        <StandaloneLink href="dummy-href">{t('link')}</StandaloneLink>
      </NextLink>
    </main>
  )
}
