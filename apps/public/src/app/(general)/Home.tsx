'use client'

import { Paragraph } from '@amsterdam/design-system-react'
import type { StaticFormPanelComponentOutput, StaticFormTextFieldInputComponentOutput } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'
import { Grid } from '@meldingen/ui'
import { useActionState } from 'react'

import { postPrimaryForm } from './actions'

type Component = StaticFormPanelComponentOutput | StaticFormTextFieldInputComponentOutput

const initialState: { message?: string } = {}

export const Home = ({ formData }: { formData: Component[] }) => {
  const [formState, formAction] = useActionState(postPrimaryForm, initialState)

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        {formState?.message && <Paragraph>{formState.message}</Paragraph>}
        <FormRenderer formData={formData} action={formAction} />
      </Grid.Cell>
    </Grid>
  )
}
