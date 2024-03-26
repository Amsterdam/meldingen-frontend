'use client'

import { Header as ADSHeader, Grid, PageMenu, SkipLink } from '@amsterdam/design-system-react'

export const Header = () => (
  <Grid>
    <Grid.Cell span="all">
      <SkipLink href="#main">Direct naar inhoud</SkipLink>
      <ADSHeader
        logoLinkTitle="Signalen homepage"
        links={
          <PageMenu alignEnd>
            <PageMenu.Link href="#">Doe een melding</PageMenu.Link>
            <PageMenu.Link href="#">Meldingenkaart</PageMenu.Link>
            <PageMenu.Link href="#">Mijn meldingen</PageMenu.Link>
          </PageMenu>
        }
      />
    </Grid.Cell>
  </Grid>
)
