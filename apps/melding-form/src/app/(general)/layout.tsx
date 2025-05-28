import { ReactNode } from 'react'

import { Footer, Grid, Header, Screen } from '@meldingen/ui'

const GeneralLayout = ({ children }: { children: ReactNode }) => (
  <Screen maxWidth="wide">
    <Header />
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <main>{children}</main>
      </Grid.Cell>
    </Grid>
    <Footer />
  </Screen>
)

export default GeneralLayout
