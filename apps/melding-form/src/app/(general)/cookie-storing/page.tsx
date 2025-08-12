import NextLink from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Heading, Paragraph, StandaloneLink } from '@meldingen/ui'

export const generateMetadata = async () => {
  const t = await getTranslations('cookies-storing')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const t = await getTranslations('cookies-storing')

  return (
    <>
      <Heading level={1} className="ams-mb-l">
        {t('title')}
      </Heading>
      <Paragraph className="ams-mb-m" size="large">
        {t('description')}
      </Paragraph>
      <NextLink href="/" legacyBehavior passHref>
        <StandaloneLink className="ams-mb-m">{t('link')}</StandaloneLink>
      </NextLink>
    </>
  )
}
