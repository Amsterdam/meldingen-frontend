import type { FormOutput, GetMeldingByMeldingIdAnswersMelderResponses } from '@meldingen/api-client'

import { isPanelComponentOutput } from '../typeGuards'
import { shouldRenderComponent } from './shouldRenderComponent'

export type AnswersByKey = Record<string, string | string[] | null>

export const getFilteredAnswersByKey = (
  formData: FormOutput,
  answers: GetMeldingByMeldingIdAnswersMelderResponses['200'] | undefined,
) => {
  const result: AnswersByKey = {}

  for (const panel of formData.components) {
    if (!isPanelComponentOutput(panel)) continue
    for (const component of panel.components) {
      // Do not return answers for components that have an unmet condition
      if (!shouldRenderComponent(component, result)) {
        continue
      }

      const answer = answers?.find((a) => a.question.id === component.question)

      if (!answer) {
        result[component.key] = null
      } else if (answer.type === 'text') {
        result[component.key] = answer.text ?? null
      } else if (answer.type === 'time') {
        result[component.key] = answer.time ?? null
      } else if (answer.type === 'value_label') {
        result[component.key] = answer.values_and_labels?.map(({ value }) => value) ?? null
      } else {
        result[component.key] = null
      }
    }
  }

  return result
}
