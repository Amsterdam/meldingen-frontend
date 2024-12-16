'use client'

import type { StaticFormPanelComponentOutput, StaticFormTextFieldInputComponentOutput } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'
import { Grid } from '@meldingen/ui'

import { postPrimaryForm } from './actions'

type Component = StaticFormPanelComponentOutput | StaticFormTextFieldInputComponentOutput

export const Home = ({ formData }: { formData: Component[] }) => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <FormRenderer formData={formData} action={postPrimaryForm} />
    </Grid.Cell>
  </Grid>
)
