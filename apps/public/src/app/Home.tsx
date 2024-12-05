'use client'

import type { StaticFormPanelComponentOutput, StaticFormTextFieldInputComponentOutput } from '@meldingen/api-client'
import { getFormClassificationByClassificationId, postMelding } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'
import { Grid } from '@meldingen/ui'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'

type Component = StaticFormPanelComponentOutput | StaticFormTextFieldInputComponentOutput

export const Home = ({ formData }: { formData: Component[] }) => {
  const router = useRouter()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    const data = new FormData(e.target as HTMLFormElement)
    const values = Object.fromEntries(data)
    const firstKey = Object.keys(values)[0]

    postMelding({ requestBody: { text: values[firstKey].toString() } }).then(async ({ id, token, classification }) => {
      if (classification) {
        const nextFormData = await getFormClassificationByClassificationId({ classificationId: classification })
        const nextFormFirstKey = nextFormData.components[0].key

        router.push(`/aanvullende-vragen/${classification}/${nextFormFirstKey}?token=${token}&id=${id}`)
      }
    })
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <FormRenderer formData={formData} onSubmit={onSubmit} />
      </Grid.Cell>
    </Grid>
  )
}
