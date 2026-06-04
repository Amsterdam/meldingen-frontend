import type { PanelComponentsConditions } from './shouldLinkToPanel'
import type { AnswersByKey } from '~/app/(general)/_utils/conditions'

import { shouldLinkToPanel } from './shouldLinkToPanel'
import { TOP_ANCHOR_ID } from '~/constants'

export const BEFORE_ADDITIONAL_QUESTIONS_PATH = `/#${TOP_ANCHOR_ID}`
export const AFTER_ADDITIONAL_QUESTIONS_PATH = `/locatie#${TOP_ANCHOR_ID}`

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
