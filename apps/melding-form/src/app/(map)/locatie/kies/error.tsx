'use client'

import { Grid, Heading, Page, Paragraph } from '@amsterdam/design-system-react'
import { useEffect } from 'react'

import { Footer, Header } from '@meldingen/ui'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Page>
      <title>Er is iets mis gegaan - Gemeente Amsterdam</title>
      <Header />
      <Grid paddingBottom="2x-large" paddingTop="x-large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
          <main>
            <Heading level={1} className="ams-mb-l">
              Er is iets mis gegaan
            </Heading>
            <Paragraph className="ams-mb-m" size="large">
              De pagina die u probeert te bezoeken heeft een storing.
            </Paragraph>
          </main>
        </Grid.Cell>
      </Grid>
      <Footer />
    </Page>
  )
}
