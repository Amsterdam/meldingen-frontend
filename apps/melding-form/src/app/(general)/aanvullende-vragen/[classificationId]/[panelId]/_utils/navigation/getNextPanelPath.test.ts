import type { PanelComponentsConditions } from './shouldLinkToPanel'

import { AFTER_ADDITIONAL_QUESTIONS_PATH, getNextPanelPath } from './getNextPanelPath'
import { TOP_ANCHOR_ID } from '~/constants'

const mockPanel = (key: string, conditions: PanelComponentsConditions['componentsConditions'] = []) => ({
  componentsConditions: conditions,
  key,
})

const doNotRenderWhenValueIsOne = { conditional: { eq: 'one', show: false, when: 'questionKey' }, key: 'key' }

describe('getNextPanelPath', () => {
  const panels = [mockPanel('panel-1'), mockPanel('panel-2', [doNotRenderWhenValueIsOne]), mockPanel('panel-3')]
  const classificationId = 1
  const currentPanelIndex = 0

  it('returns the next panel that should be linked to', () => {
    expect(getNextPanelPath(classificationId, currentPanelIndex, panels, {})).toBe(
      `/aanvullende-vragen/1/panel-2#${TOP_ANCHOR_ID}`,
    )
  })

  it('skips a hidden panel and returns the one after', () => {
    expect(getNextPanelPath(classificationId, currentPanelIndex, panels, { questionKey: 'one' })).toBe(
      `/aanvullende-vragen/1/panel-3#${TOP_ANCHOR_ID}`,
    )
  })

  it('skips multiple consecutive hidden panels', () => {
    const allHidden = [
      mockPanel('panel-1'),
      mockPanel('panel-2', [doNotRenderWhenValueIsOne]),
      mockPanel('panel-3', [doNotRenderWhenValueIsOne]),
      mockPanel('panel-4'),
    ]
    expect(getNextPanelPath(classificationId, currentPanelIndex, allHidden, { questionKey: 'one' })).toBe(
      `/aanvullende-vragen/1/panel-4#${TOP_ANCHOR_ID}`,
    )
  })

  it('returns AFTER_ADDITIONAL_QUESTIONS_PATH when all remaining panels are hidden', () => {
    const allHiddenAfter = [mockPanel('panel-1'), mockPanel('panel-2', [doNotRenderWhenValueIsOne])]
    expect(getNextPanelPath(classificationId, currentPanelIndex, allHiddenAfter, { questionKey: 'one' })).toBe(
      AFTER_ADDITIONAL_QUESTIONS_PATH,
    )
  })

  it('returns AFTER_ADDITIONAL_QUESTIONS_PATH when already on the last panel', () => {
    expect(getNextPanelPath(classificationId, 2, panels, {})).toBe(AFTER_ADDITIONAL_QUESTIONS_PATH)
  })
})
