import type { PanelComponentsConditions } from './shouldLinkToPanel'

import { getPreviousPanelPath } from './getPreviousPanelPath'
import { TOP_ANCHOR_ID } from '~/constants'

const mockPanel = (key: string, conditions: PanelComponentsConditions['componentsConditions'] = []) => ({
  componentsConditions: conditions,
  key,
})

const doNotRenderWhenValueIsOne = { conditional: { eq: 'one', show: false, when: 'questionKey' }, key: 'key' }

const beforePath = '/before'

describe('getPreviousPanelPath', () => {
  const panels = [mockPanel('panel-1'), mockPanel('panel-2', [doNotRenderWhenValueIsOne]), mockPanel('panel-3')]
  const classificationId = 1

  it('returns the previous panel that should be linked to', () => {
    expect(getPreviousPanelPath(classificationId, 2, panels, {}, beforePath)).toBe(
      `/aanvullende-vragen/1/panel-2#${TOP_ANCHOR_ID}`,
    )
  })

  it('skips a hidden panel and returns the one before', () => {
    expect(getPreviousPanelPath(classificationId, 2, panels, { questionKey: 'one' }, beforePath)).toBe(
      `/aanvullende-vragen/1/panel-1#${TOP_ANCHOR_ID}`,
    )
  })

  it('skips multiple consecutive hidden panels', () => {
    const allHidden = [
      mockPanel('panel-1'),
      mockPanel('panel-2', [doNotRenderWhenValueIsOne]),
      mockPanel('panel-3', [doNotRenderWhenValueIsOne]),
      mockPanel('panel-4'),
    ]
    expect(getPreviousPanelPath(classificationId, 3, allHidden, { questionKey: 'one' }, beforePath)).toBe(
      `/aanvullende-vragen/1/panel-1#${TOP_ANCHOR_ID}`,
    )
  })

  it('returns beforePath when all preceding panels are hidden', () => {
    const allHiddenBefore = [mockPanel('panel-1', [doNotRenderWhenValueIsOne]), mockPanel('panel-2')]
    expect(getPreviousPanelPath(classificationId, 1, allHiddenBefore, { questionKey: 'one' }, beforePath)).toBe(
      beforePath,
    )
  })

  it('returns beforePath when already on the first panel', () => {
    expect(getPreviousPanelPath(classificationId, 0, panels, {}, beforePath)).toBe(beforePath)
  })
})
