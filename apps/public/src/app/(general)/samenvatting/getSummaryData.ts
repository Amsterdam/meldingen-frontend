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

export const getSummaryData = ({ melding, primaryFormLabel, additionalQuestionsAnswers, location }: Props) => {
  const primaryFormSummary = {
    key: 'primary',
    term: primaryFormLabel,
    description: [melding.text],
  }

  const additionalQuestionsSummary = additionalQuestionsAnswers.map((answer) => ({
    key: answer.question.id,
    term: answer.question.text,
    description: [answer.text],
  }))

  const locationSummary = {
    key: 'location',
    term: 'Waar is het?', // TODO: use i18n slug here
    description: [location.name],
  }

  const contactSummary = {
    key: 'contact',
    term: 'Wat zijn uw contactgegevens?', // TODO: use i18n slug here
    description: [melding.email, melding.phone],
  }

  return [
    primaryFormSummary,
    ...additionalQuestionsSummary,
    location && locationSummary,
    (melding.email || melding.phone) && contactSummary,
  ].filter((item) => item) // Filter out undefined items
}
