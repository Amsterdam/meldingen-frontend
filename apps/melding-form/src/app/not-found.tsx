import NextLink from 'next/link'

import { Footer, Grid, Header, Heading, Page, Paragraph, StandaloneLink } from '@meldingen/ui'

export default function NotFound() {
  return (
    <Page>
      <Header />
      <Grid paddingBottom="2x-large" paddingTop="x-large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
          <main>
            <Heading className="ams-mb-m" level={1} size="level-2">
              Pagina niet gevonden
            </Heading>
            <Paragraph className="ams-mb-m">
              Controleer of de link correct is. Als u de link heeft gekopieerd, controleer dan of u de gehele link heeft
              gekopieerd.
            </Paragraph>
            <Paragraph className="ams-mb-xs">Wilt u een melding van overlast in de openbare ruimte doen?</Paragraph>
            <NextLink href="/" legacyBehavior passHref>
              <StandaloneLink>Doe een melding</StandaloneLink>
            </NextLink>
          </main>
        </Grid.Cell>
      </Grid>
      <Footer />
    </Page>
  )
}
