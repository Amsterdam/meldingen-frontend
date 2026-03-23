import { ReactNode } from 'react'

import { Grid, Page } from '@meldingen/ui'

import { TOP_ANCHOR_ID } from '../../constants'

const BackOfficeLayout = ({ children }: { children: ReactNode }) => (
  <Page id={TOP_ANCHOR_ID}>
    <Grid paddingBottom="2x-large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        {children}
      </Grid.Cell>
    </Grid>
  </Page>
)

export default BackOfficeLayout
