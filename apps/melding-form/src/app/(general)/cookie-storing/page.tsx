import { getTranslations } from 'next-intl/server'
import NextLink from 'next/link'

import { Heading, Paragraph, StandaloneLink } from '@meldingen/ui'

import { TOP_ANCHOR_ID } from '~/constants'

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
      <Heading className="ams-mb-m" level={1}>
        {t('title')}
      </Heading>
      <NextLink href={`/#${TOP_ANCHOR_ID}`} legacyBehavior passHref>
        <StandaloneLink className="ams-mb-m">{t('link')}</StandaloneLink>
      </NextLink>
      <Paragraph>{t('description')}</Paragraph>
    </main>
  )
}
