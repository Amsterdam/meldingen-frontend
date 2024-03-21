'use client'

import {
  Footer as ADSFooter,
  Grid,
  Heading,
  Link,
  PageMenu,
  Paragraph,
  VisuallyHidden,
  Column,
} from '@amsterdam/design-system-react'

export function Footer() {
  return (
    <ADSFooter>
      <ADSFooter.Top>
        <VisuallyHidden>
          <Heading>Colofon</Heading>
        </VisuallyHidden>
        <Grid gapVertical="large" paddingVertical="medium">
          <Grid.Cell span={{ narrow: 3, medium: 4, wide: 4 }}>
            <Column gap="small">
              <Heading level={2} size="level-4" inverseColor>
                Contact
              </Heading>
              <Paragraph size="small" inverseColor>
                Lukt het niet om een melding te doen? Bel het telefoonnummer{' '}
                <Link href="tel:+3114020" onBackground="dark" variant="inline">
                  14 020
                </Link>
                .
              </Paragraph>
              <Paragraph size="small" inverseColor>
                Wij zijn bereikbaar van maandag tot en met vrijdag van 08.00 tot 18.00 uur.
              </Paragraph>
            </Column>
          </Grid.Cell>
        </Grid>
      </ADSFooter.Top>
      <ADSFooter.Bottom>
        <VisuallyHidden>
          <Heading level={2}>Over deze website</Heading>
        </VisuallyHidden>
        <Grid paddingVertical="small">
          <Grid.Cell span="all">
            <PageMenu>
              <PageMenu.Link href="#">Over deze site</PageMenu.Link>
              <PageMenu.Link href="#">Privacy</PageMenu.Link>
              <PageMenu.Link href="#">Toegankelijkheid</PageMenu.Link>
            </PageMenu>
          </Grid.Cell>
        </Grid>
      </ADSFooter.Bottom>
    </ADSFooter>
  )
}
