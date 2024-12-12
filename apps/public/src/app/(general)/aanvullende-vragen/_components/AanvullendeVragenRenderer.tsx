'use client'

import { Grid, Heading } from '@amsterdam/design-system-react'
import { postMeldingByMeldingIdQuestionByQuestionId } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'

import { BackLink } from '../../_components/BackLink'

import { mergeCheckboxAnswers } from './mergeCheckboxAnswers'

// TODO: fix formData type
type Props = {
  formData: any[]
  nextPanelPath: string
  previousPanelPath: string
}

export const AanvullendeVragenRenderer = ({ formData, nextPanelPath, previousPanelPath }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const meldingId = searchParams?.get('id')
  const token = searchParams?.get('token')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const data = new FormData(e.target as HTMLFormElement)
    const answerObject = Object.fromEntries(data)
    const answers = Object.entries(answerObject)

    // Checkbox answers are stored as separate key-value pairs in the FormData object.
    // This function merges these answers into a single string value per question, using an identifier in the Checkbox component.
    // TODO: This isn't the most robust solution.
    const answersWithMergedCheckboxes = Object.entries(mergeCheckboxAnswers(answers))

    answersWithMergedCheckboxes.forEach(([key, value]) => {
      if (value instanceof File) return undefined

      // // Filter out empty answers
      if (value.length === 0) return undefined

      const questionId = formData.find((component) => component.key === key)?.question

      if (!meldingId || !questionId || !token) return undefined

      return postMeldingByMeldingIdQuestionByQuestionId({
        meldingId: parseInt(meldingId, 10),
        questionId,
        token,
        requestBody: { text: value },
      })
    })

    router.push(`${nextPanelPath}?token=${token}&id=${meldingId}`)
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <BackLink href={`${previousPanelPath}?token=${token}&id=${meldingId}`}>Vorige vraag</BackLink>
        <Heading>Beschrijf uw melding</Heading>
        <FormRenderer formData={formData} onSubmit={handleSubmit} />
      </Grid.Cell>
    </Grid>
  )
}
