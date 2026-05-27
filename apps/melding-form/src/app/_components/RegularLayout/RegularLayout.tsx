import type { PropsWithChildren } from 'react'

import { Grid, Page } from '@meldingen/ui'

import { Footer, Header } from '~/app/_components'
import { TOP_ANCHOR_ID } from '~/constants'

export const RegularLayout = ({ children }: PropsWithChildren) => (
  <Page id={TOP_ANCHOR_ID}>
    <Header />
    <Grid paddingBottom="x-large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        {children}
      </Grid.Cell>
    </Grid>
    <Footer />
  </Page>
)
