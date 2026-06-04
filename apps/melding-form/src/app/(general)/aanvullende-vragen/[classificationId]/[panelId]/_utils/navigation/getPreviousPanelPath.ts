import type { PanelComponentsConditions } from './shouldLinkToPanel'
import type { AnswersByKey } from '~/app/(general)/_utils/conditions'

import { shouldLinkToPanel } from './shouldLinkToPanel'
import { TOP_ANCHOR_ID } from '~/constants'

export const getPreviousPanelPath = (
  classificationId: number,
  currentPanelIndex: number,
  panels: PanelComponentsConditions[],
  answersByKey: AnswersByKey,
  beforePath: string,
) => {
  for (let i = currentPanelIndex - 1; i >= 0; i--) {
    if (shouldLinkToPanel(panels[i], answersByKey)) {
      return `/aanvullende-vragen/${classificationId}/${panels[i].key}#${TOP_ANCHOR_ID}`
    }
  }
  return beforePath
}
