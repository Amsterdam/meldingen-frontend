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

const transformAnswer = (answer: string | { [key: string]: string }) => {
  if (typeof answer === 'object') {
    const checkedAnswers = Object.keys(answer).filter((key) => answer[key])

    return checkedAnswers.join(', ')
  }

  return answer
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

    answers.forEach(([key, value]) => {
      if (value instanceof File) return undefined

      // Transform all answers to strings (including checkbox objects)
      const answerString = transformAnswer(value)

      // // Filter out empty answers
      if (answerString.length === 0) return undefined

      const questionId = formData.find((component) => component.key === key)?.question

      if (!meldingId || !questionId || !token) return undefined

      return postMeldingByMeldingIdQuestionByQuestionId({
        meldingId: parseInt(meldingId, 10),
        questionId,
        token,
        requestBody: { text: answerString },
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
