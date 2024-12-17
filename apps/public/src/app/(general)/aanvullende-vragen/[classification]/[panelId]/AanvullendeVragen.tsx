'use client'

import { Grid, Heading, Paragraph } from '@amsterdam/design-system-react'
import { FormRenderer } from '@meldingen/form-renderer'
import { useActionState } from 'react'

// import { BackLink } from '../../_components/BackLink'

// TODO: fix types
type Props = {
  formData: any[]
  action: any
}

const initialState: { message?: string } = {}

export const AanvullendeVragen = ({ formData, action }: Props) => {
  const [formState, formAction] = useActionState(action, initialState)

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        {formState?.message && <Paragraph>{formState.message}</Paragraph>}
        {/* <BackLink href={`${previousPanelPath}?token=${token}&id=${meldingId}`}>Vorige vraag</BackLink> */}
        <Heading>Beschrijf uw melding</Heading>
        <FormRenderer formData={formData} action={formAction} />
      </Grid.Cell>
    </Grid>
  )
}
