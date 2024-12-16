'use client'

import { Grid, Heading } from '@amsterdam/design-system-react'
import { FormRenderer } from '@meldingen/form-renderer'

// import { BackLink } from '../../_components/BackLink'

// TODO: fix formData type
type Props = {
  formData: any[]
  action: (formData: FormData) => void
}

export const AanvullendeVragenRenderer = ({ formData, action }: Props) => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      {/* <BackLink href={`${previousPanelPath}?token=${token}&id=${meldingId}`}>Vorige vraag</BackLink> */}
      <Heading>Beschrijf uw melding</Heading>
      <FormRenderer formData={formData} action={action} />
    </Grid.Cell>
  </Grid>
)
