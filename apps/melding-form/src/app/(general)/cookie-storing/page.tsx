import NextLink from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Heading, Paragraph, StandaloneLink } from '@meldingen/ui'

export const generateMetadata = async () => {
  const t = await getTranslations('cookie-storing')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const t = await getTranslations('cookie-storing')

  return (
    <main>
      <Heading className="ams-mb-m" level={1} size="level-2">
        {t('title')}
      </Heading>
      <NextLink href="/" legacyBehavior passHref>
        <StandaloneLink className="ams-mb-m">{t('link')}</StandaloneLink>
      </NextLink>
      <Paragraph>{t('description')}</Paragraph>
    </main>
  )
}
