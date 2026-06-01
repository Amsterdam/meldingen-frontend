'use client'

import { Button, Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  const t = useTranslations('error')

  return (
    <main>
      <title>{t('metadata.title')}</title>
      <Heading className="ams-mb-m" level={1}>
        {t('title')}
      </Heading>
      <Button className="ams-mb-m" onClick={() => window.location.reload()}>
        {t('button')}
      </Button>
      <Paragraph>{t('description')}</Paragraph>
    </main>
  )
}
