import type {
  FormOutput,
  FormPanelComponentOutput,
  GetMeldingByMeldingIdAnswersMelderResponses,
} from '@meldingen/api-client'

export type AnswersByKey = Record<string, string | string[] | null>

export const isPanelComponentOutput = (
  component: FormOutput['components'][number],
): component is FormPanelComponentOutput => component.type === 'panel'

export const getAnswersByKey = (
  formData: FormOutput,
  answers: GetMeldingByMeldingIdAnswersMelderResponses['200'] | undefined,
) => {
  const result: AnswersByKey = {}

  for (const panel of formData.components) {
    if (!isPanelComponentOutput(panel)) continue
    for (const component of panel.components) {
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
