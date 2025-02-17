import type { GetMeldingByMeldingIdAnswersResponse, MeldingOutput } from '@meldingen/api-client'

import type { Coordinates } from 'apps/public/src/types'

type Props = {
  melding: MeldingOutput
  additionalQuestionsAnswers: GetMeldingByMeldingIdAnswersResponse
  location: {
    name: string
    coordinates: Coordinates
  }
}

export const getSummaryData = ({ melding, additionalQuestionsAnswers, location }: Props) => {
  const additionalQuestionsSummary = additionalQuestionsAnswers.map((answer) => ({
    key: answer.question.id,
    term: answer.question.text,
    description: answer.text,
  }))

  return [
    {
      key: 'primary',
      term: 'Wat wilt u melden?', // TODO: moet uit de API komen
      description: melding.text,
    },
    ...additionalQuestionsSummary,
    location && {
      key: 'location',
      term: 'Waar is het?', // TODO
      description: location.name,
    },
    (melding.email || melding.phone) && {
      key: 'contact',
      term: 'Wat zijn uw contactgegevens?', // TODO
      description: [melding.email, melding.phone],
    },
  ].filter((item) => item) // Filter out undefined items
}
