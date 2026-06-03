import type { FormIoConditional } from '@meldingen/api-client'

import type { AnswersByKey } from '~/app/(general)/_utils/conditions'

import { shouldRenderComponent } from '~/app/(general)/_utils/conditions'

export type PanelComponentsConditions = {
  componentsConditions: Array<{ conditional?: FormIoConditional | null; key: string }>
  key: string
}

export const shouldLinkToPanel = (panel: PanelComponentsConditions, answersByKey: AnswersByKey) =>
  panel.componentsConditions.length === 0 ||
  panel.componentsConditions.some((component) => shouldRenderComponent(component, answersByKey))
