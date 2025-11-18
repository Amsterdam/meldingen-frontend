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
        <Grid.Cell span={{ medium: 6, narrow: 4, wide: 6 }} start={{ medium: 2, narrow: 1, wide: 3 }}>
          <main>
            <Heading className="ams-mb-m" level={1}>
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
