'use client'

import { Heading } from '@amsterdam/design-system-react'
import { Grid } from '@meldingen/ui'

import { FileUpload } from './_components/FileUpload'

const Bijlagen = () => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <Heading>Bijlagen</Heading>
      <FileUpload />
    </Grid.Cell>
  </Grid>
)

export default Bijlagen
