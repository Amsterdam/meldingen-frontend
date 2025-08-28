import { ReactNode } from 'react'

import { Footer, Grid, Header, Page } from '@meldingen/ui'

const GeneralLayout = ({ children }: { children: ReactNode }) => (
  <Page>
    <Header />
    <Grid paddingBottom="x-large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        {children}
      </Grid.Cell>
    </Grid>
    <Footer />
  </Page>
)

export default GeneralLayout
