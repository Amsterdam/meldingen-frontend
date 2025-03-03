'use client'

import { Paragraph } from '@amsterdam/design-system-react'
import { FormRenderer } from '@meldingen/form-renderer'
import { Grid } from '@meldingen/ui'
import { useActionState } from 'react'

import type { StaticFormTextAreaComponentOutput } from 'apps/public/src/apiClientProxy'

import { postPrimaryForm } from './actions'

const initialState: { message?: string } = {}

export const Home = ({ formData }: { formData: StaticFormTextAreaComponentOutput[] }) => {
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
