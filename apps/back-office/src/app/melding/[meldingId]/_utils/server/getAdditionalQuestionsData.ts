import type { GetMeldingByMeldingIdAnswersMelderResponses, ValueLabelObject } from '@meldingen/api-client'

import { formatDateString } from '@meldingen/utils'

import { getMeldingByMeldingIdAnswers } from '~/app/_api-client/proxy'
import { handleApiError } from '~/app/_utils/handleApiError'

const getDescription = (answer: GetMeldingByMeldingIdAnswersMelderResponses['200'][number]) => {
  switch (answer.type) {
    case 'date':
      // If converted date is null, it means the melder selected "Weet ik niet" for a date question
      // In that case, we want to show the 'do not know' label ("Weet ik niet") instead of an empty string.
      // This also catches in the edgecase that converted_date cannot be returned, the label which is formatted as "gisteren augustus 5"
      return answer.date.converted_date ? formatDateString(answer.date.converted_date).date : answer.date.label

    case 'text':
      return answer.text
    case 'time':
      // If the Time value is null, it means the melder selected 'do not know' for a question about time.
      // In that case, we want to show "Weet ik niet" instead of an empty string.
      if (answer.time === null) return 'Weet ik niet'

      return answer.time
    case 'value_label':
      return answer.values_and_labels.map((option: ValueLabelObject) => option.label).join(', ')
    default: {
      const _exhaustive: never = answer
      return ''
    }
  }
}

export const getAdditionalQuestionsData = async (meldingId: number) => {
  const { data, error } = await getMeldingByMeldingIdAnswers({
    path: { melding_id: meldingId },
  })

  if (error) return { error: handleApiError(error) }

  return {
    data: data.map((answer) => ({
      description: getDescription(answer),
      key: String(answer.question.id),
      term: answer.original_question_text,
    })),
  }
}
