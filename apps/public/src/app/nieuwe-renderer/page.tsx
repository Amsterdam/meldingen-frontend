'use client'

// eslint-disable-next-line import/order
import { Heading } from '@amsterdam/design-system-react'

// eslint-disable-next-line import/order
import { FormRenderer } from '@meldingen/form-renderer'
import { Grid } from '@meldingen/ui'

const NewRender = () => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <Heading>Test</Heading>
      <FormRenderer />
    </Grid.Cell>
  </Grid>
)

export default NewRender
