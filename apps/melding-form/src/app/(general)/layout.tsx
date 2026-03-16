import { ReactNode } from 'react'

import { Grid, Page } from '@meldingen/ui'

import { Footer } from '../_components/Footer/Footer'
import { Header } from '../_components/Header/Header'

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
