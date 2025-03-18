'use client'

import { Paragraph } from '@amsterdam/design-system-react'

import { Grid } from '@meldingen/ui'

export const Overview = () => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
      <Paragraph>Back Office</Paragraph>
    </Grid.Cell>
  </Grid>
)
