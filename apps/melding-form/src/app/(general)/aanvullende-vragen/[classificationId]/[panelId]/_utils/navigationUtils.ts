import type {
  FormIoConditional,
  FormOutput,
  FormPanelComponentOutput,
  GetMeldingByMeldingIdAnswersMelderResponses,
} from '@meldingen/api-client'

export type PanelKeyWithComponentsConditions = {
  componentsConditions: Array<{ conditional?: FormIoConditional | null; key: string }>
  key: string
}

export const BEFORE_ADDITIONAL_QUESTIONS_PATH = '/'
export const AFTER_ADDITIONAL_QUESTIONS_PATH = '/locatie'

const isComponentVisible = (
  { conditional }: { conditional?: FormIoConditional | null; key: string },
  answersByKey: Record<string, string | null>,
) => {
  if (!conditional || conditional.when === null || conditional.eq === null || conditional.show === null) return true

  const answerValue = answersByKey[conditional.when] ?? null
  const conditionMet = answerValue !== null && answerValue === String(conditional.eq)

  return conditionMet ? conditional.show : !conditional.show
}

// If a panel has at least one visible component, the panel is visible. Otherwise, the panel is hidden.
export const isPanelVisible = (panel: PanelKeyWithComponentsConditions, answersByKey: Record<string, string | null>) =>
  panel.componentsConditions.some((component) => isComponentVisible(component, answersByKey))

export const getNextPanelPath = (
  classificationId: number,
  currentPanelIndex: number,
  panels: PanelKeyWithComponentsConditions[],
  answersByKey: Record<string, string | null>,
) => {
  for (let i = currentPanelIndex + 1; i < panels.length; i++) {
    if (isPanelVisible(panels[i], answersByKey)) {
      return `/aanvullende-vragen/${classificationId}/${panels[i].key}`
    }
  }
  return AFTER_ADDITIONAL_QUESTIONS_PATH
}

export const getPreviousPanelPath = (
  classificationId: number,
  currentPanelIndex: number,
  panels: PanelKeyWithComponentsConditions[],
  answersByKey: Record<string, string | null>,
) => {
  for (let i = currentPanelIndex - 1; i >= 0; i--) {
    if (isPanelVisible(panels[i], answersByKey)) {
      return `/aanvullende-vragen/${classificationId}/${panels[i].key}`
    }
  }
  return BEFORE_ADDITIONAL_QUESTIONS_PATH
}

export const getPreviousAnswersByKey = (
  formData: FormOutput,
  answers: GetMeldingByMeldingIdAnswersMelderResponses['200'] | undefined,
) => {
  const result: Record<string, string | null> = {}

  for (const panel of formData.components as FormPanelComponentOutput[]) {
    for (const component of panel.components) {
      const answer = answers?.find((a) => a.question.id === component.question)

      if (!answer) {
        result[component.key] = null
      } else if (answer.type === 'text') {
        result[component.key] = answer.text ?? null
      } else if (answer.type === 'time') {
        result[component.key] = answer.time ?? null
      } else if (answer.type === 'value_label') {
        result[component.key] = answer.values_and_labels?.[0]?.value ?? null
      } else {
        result[component.key] = null
      }
    }
  }

  return result
}
