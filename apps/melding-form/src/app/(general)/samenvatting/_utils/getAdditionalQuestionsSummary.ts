import type { GetMeldingByMeldingIdAnswersMelderResponses, ValueLabelObject } from '@meldingen/api-client'

import { getFormClassificationByClassificationId, getMeldingByMeldingIdAnswersMelder } from '@meldingen/api-client'

import { getFilteredAnswersByKey } from '../../_utils/conditions/getFilteredAnswersByKey'
import { isPanelComponentOutput } from '../../_utils/typeGuards'
import { TOP_ANCHOR_ID } from '~/constants'
import { handleApiError } from '~/handleApiError'

const getDescription = (answer: GetMeldingByMeldingIdAnswersMelderResponses['200'][number]) => {
  switch (answer.type) {
    case 'date':
      return answer.date.label
    case 'text':
      return answer.text
    case 'time':
      // If the Time value is null, it means the melder selected 'do not know' for a question about time.
      // In that case, we want to show "Weet ik niet" instead of an empty string.
      if (answer.time === null) return 'Weet ik niet'

      return answer.time
    case 'value_label':
      return answer.values_and_labels.map((option: ValueLabelObject) => option.label).join(', ')
    default:
      return ''
  }
}

export const getAdditionalQuestionsSummary = async (meldingId: string, token: string, classificationId?: number) => {
  if (!classificationId) return { data: [], staleAnswerIds: [] }

  const { data: formComponents, error: formError } = await getFormClassificationByClassificationId({
    path: { classification_id: classificationId },
  })

  if (formError) {
    // Not Found error is returned when the classification does not have additional questions
    if (handleApiError(formError) === 'Not Found') return { data: [], staleAnswerIds: [] }

    throw new Error('Failed to fetch form by classification.')
  }

  const { data, error } = await getMeldingByMeldingIdAnswersMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) throw new Error('Failed to fetch additional questions data.')

  const panels = formComponents.components.filter(isPanelComponentOutput)
  const answersByKey = getFilteredAnswersByKey(formComponents, data)

  const componentByQuestionId = new Map(
    panels.flatMap((panel) => panel.components.map((component) => [component.question, component])),
  )

  const meetsCondition = (answer: GetMeldingByMeldingIdAnswersMelderResponses['200'][number]) => {
    const component = componentByQuestionId.get(answer.question.id)
    return component ? component.key in answersByKey : true
  }

  const panelIdByQuestionId = new Map(
    panels.flatMap((panel) => panel.components.map((component) => [component.question, panel.key])),
  )

  const toSummaryItem = (answer: GetMeldingByMeldingIdAnswersMelderResponses['200'][number]) => {
    const panelId = panelIdByQuestionId.get(answer.question.id)

    return {
      description: getDescription(answer),
      key: `${answer.question.id}`,
      link: panelId ? `/aanvullende-vragen/${classificationId}/${panelId}#${TOP_ANCHOR_ID}` : `/#${TOP_ANCHOR_ID}`,
      term: answer.original_question_text,
    }
  }

  const includedAnswers = data.filter(meetsCondition).map(toSummaryItem)
  const staleAnswerIds = data.filter((answer) => !meetsCondition(answer)).map((answer) => answer.id)

  return {
    data: includedAnswers,
    staleAnswerIds,
  }
}
