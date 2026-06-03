import type { PanelComponentsConditions } from './shouldLinkToPanel'
import type { AnswersByKey } from '~/app/(general)/_utils/conditions'

import { shouldRenderComponent } from '~/app/(general)/_utils/conditions'

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
