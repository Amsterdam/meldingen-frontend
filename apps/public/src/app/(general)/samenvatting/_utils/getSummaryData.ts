import type { GetMeldingByMeldingIdAnswersResponse, MeldingOutput } from '@meldingen/api-client'

import type { Coordinates } from 'apps/public/src/types'

type Props = {
  melding: MeldingOutput
  primaryFormLabel: string
  additionalQuestionsAnswers: GetMeldingByMeldingIdAnswersResponse
  location: {
    name: string
    coordinates: Coordinates
  }
}

export type SummaryData = {
  key: string
  term: string
  description: string[]
}[]

export const getSummaryData = ({ melding, primaryFormLabel, additionalQuestionsAnswers, location }: Props) => {
  const primaryFormSummary = {
    key: 'primary',
    term: primaryFormLabel,
    description: [melding.text],
  }

  const additionalQuestionsSummary = additionalQuestionsAnswers
    .map((answer) => {
      if (answer.text !== null && answer.text !== undefined) {
        return {
          key: `${answer.question.id}`,
          term: answer.question.text,
          description: [answer.text],
        }
      }
      return undefined
    })
    .filter((item) => item !== undefined) // Filter out undefined items

  const locationSummary = {
    key: 'location',
    term: 'Waar is het?',
    description: [location?.name],
  }

  const contactSummary = {
    key: 'contact',
    term: 'Wat zijn uw contactgegevens?',
    description: [melding.email, melding.phone].filter((item) => item !== undefined && item !== null), // Filter out undefined or null items
  }

  return [
    melding.text ? primaryFormSummary : undefined,
    ...additionalQuestionsSummary,
    location?.name ? locationSummary : undefined,
    melding.email || melding.phone ? contactSummary : undefined,
  ].filter((item) => item !== undefined) // Filter out undefined items
}
