'use client'

import { Button, Grid, Heading, Page, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { Footer, Header } from '@meldingen/ui'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  const t = useTranslations('error')

  return (
    <Page>
      <title>{t('metadata.title')}</title>
      <Header />
      <Grid paddingBottom="2x-large" paddingTop="x-large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
          <main>
            <Heading className="ams-mb-m" level={1} size="level-2">
              {t('title')}
            </Heading>
            <Button className="ams-mb-m" onClick={() => window.location.reload()}>
              {t('button')}
            </Button>
            <Paragraph className="ams-mb-m">{t('description')}</Paragraph>
          </main>
        </Grid.Cell>
      </Grid>
      <Footer />
    </Page>
  )
}
