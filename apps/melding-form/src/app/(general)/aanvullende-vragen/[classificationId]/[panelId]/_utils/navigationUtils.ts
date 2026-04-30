import type { AnswersByKey } from '~/app/(general)/_utils/conditions/getFilteredAnswersByKey'

import { shouldRenderComponent } from '~/app/(general)/_utils/conditions/shouldRenderComponent'
import { TOP_ANCHOR_ID } from '~/constants'

import type { FormIoConditional } from '@meldingen/api-client'

export type PanelComponentsConditions = {
  componentsConditions: Array<{ conditional?: FormIoConditional | null; key: string }>
  key: string
}

export const BEFORE_ADDITIONAL_QUESTIONS_PATH = `/#${TOP_ANCHOR_ID}`
export const AFTER_ADDITIONAL_QUESTIONS_PATH = `/locatie#${TOP_ANCHOR_ID}`

// If a panel has at least one rendered component, we should link to it. Otherwise, we should skip it.
export const shouldLinkToPanel = (panel: PanelComponentsConditions, answersByKey: AnswersByKey) =>
  panel.componentsConditions.length === 0 ||
  panel.componentsConditions.some((component) => shouldRenderComponent(component, answersByKey))

export const getNextPanelPath = (
  classificationId: number,
  currentPanelIndex: number,
  panels: PanelComponentsConditions[],
  answersByKey: AnswersByKey,
) => {
  for (let i = currentPanelIndex + 1; i < panels.length; i++) {
    if (shouldLinkToPanel(panels[i], answersByKey)) {
      return `/aanvullende-vragen/${classificationId}/${panels[i].key}#${TOP_ANCHOR_ID}`
    }
  }
  return AFTER_ADDITIONAL_QUESTIONS_PATH
}

export const getPreviousPanelPath = (
  classificationId: number,
  currentPanelIndex: number,
  panels: PanelComponentsConditions[],
  answersByKey: AnswersByKey,
) => {
  for (let i = currentPanelIndex - 1; i >= 0; i--) {
    if (shouldLinkToPanel(panels[i], answersByKey)) {
      return `/aanvullende-vragen/${classificationId}/${panels[i].key}#${TOP_ANCHOR_ID}`
    }
  }
  return BEFORE_ADDITIONAL_QUESTIONS_PATH
}

export const refilterAnswersByKey = (panels: PanelComponentsConditions[], answers: AnswersByKey): AnswersByKey => {
  const result: AnswersByKey = {}
  for (const { componentsConditions } of panels) {
    for (const component of componentsConditions) {
      if (!shouldRenderComponent(component, result)) continue
      if (component.key in answers) result[component.key] = answers[component.key]
    }
  }
  return result
}
