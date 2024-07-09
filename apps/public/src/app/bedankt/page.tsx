'use client'

import { Heading } from '@amsterdam/design-system-react'

import { Grid } from '@meldingen/ui'

const Bedankt = () => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <Heading>Bedankt</Heading>
    </Grid.Cell>
  </Grid>
)

export default Bedankt
