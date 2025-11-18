import { ReactNode } from 'react'

import { Footer, Grid, Header, Page } from '@meldingen/ui'

const GeneralLayout = ({ children }: { children: ReactNode }) => (
  <Page>
    <Header />
    <Grid paddingBottom="x-large">
      <Grid.Cell span={{ medium: 6, narrow: 4, wide: 6 }} start={{ medium: 2, narrow: 1, wide: 3 }}>
        {children}
      </Grid.Cell>
    </Grid>
    <Footer />
  </Page>
)

export default GeneralLayout
