import { Metadata } from 'next'
import NextLink from 'next/link'

import { Heading, Paragraph, StandaloneLink } from '@meldingen/ui'

export const metadata: Metadata = {
  title: 'Er is iets mis gegaan - Gemeente Amsterdam',
}

export default async () => (
  <>
    <Heading level={1} className="ams-mb-l">
      Er is iets mis gegaan
    </Heading>
    <Paragraph className="ams-mb-m" size="large">
      De pagina die u probeert te bezoeken heeft een storing. De cookies die nodig zijn om het formulier af te maken
      missen.
    </Paragraph>
    <NextLink href="/" legacyBehavior passHref>
      <StandaloneLink className="ams-mb-m">Probeer de melding opnieuw te maken.</StandaloneLink>
    </NextLink>
  </>
)
