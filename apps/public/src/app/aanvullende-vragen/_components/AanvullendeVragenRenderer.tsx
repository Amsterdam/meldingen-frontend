'use client'

import { Grid, Heading, Link } from '@amsterdam/design-system-react'
import { postMeldingByMeldingIdQuestionByQuestionId } from '@meldingen/api-client'
import { FormRenderer } from '@meldingen/form-renderer'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'

// TODO: fix formData type
type Props = {
  formData: any[]
  nextPanelPath: string
  previousPanelPath: string
}

type Answer = {
  [key: string]: string | File
}

type CheckboxAnswers = {
  [questionId: string]: string
}

// Checkbox answers are stored as separate key-value pairs in the FormData object.
// This function merges these answers into a single string value per question, using an identifier in the Checkbox component.
// TODO: This isn't the most robust solution.
const mergeCheckboxAnswers = (answers: [string, string | File][]): Answer => {
  const checkboxAnswers = answers.filter(([key]) => key.startsWith('checkbox___'))

  const groupedCheckboxAnswers = checkboxAnswers.reduce<CheckboxAnswers>((acc, [key, value]) => {
    const questionId = key.split('___')[1]

    if (!acc[questionId]) {
      acc[questionId] = ''
    }

    if (acc[questionId].length === 0) {
      acc[questionId] = value as string
    } else {
      acc[questionId] = `${acc[questionId]}, ${value}`
    }

    return acc
  }, {})

  const answerObjWithoutCheckboxes = Object.fromEntries(answers.filter(([key]) => !key.startsWith('checkbox___')))

  return { ...answerObjWithoutCheckboxes, ...groupedCheckboxAnswers }
}

export const AanvullendeVragenRenderer = ({ formData, nextPanelPath, previousPanelPath }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const meldingId = searchParams.get('id')
  const token = searchParams.get('token')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const data = new FormData(e.target as HTMLFormElement)
    const answerObject = Object.fromEntries(data)
    const answers = Object.entries(answerObject)

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
        <NextLink href={`${previousPanelPath}?token=${token}&id=${meldingId}`} legacyBehavior passHref>
          <Link className="ams-mb--xs" href="dummy-href">
            Vorige vraag
          </Link>
        </NextLink>
        <Heading>Beschrijf uw melding</Heading>
        <FormRenderer formData={formData} onSubmit={handleSubmit} />
      </Grid.Cell>
    </Grid>
  )
}
