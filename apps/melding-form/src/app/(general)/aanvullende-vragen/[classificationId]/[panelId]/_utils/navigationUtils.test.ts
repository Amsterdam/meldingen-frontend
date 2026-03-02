import {
  AFTER_ADDITIONAL_QUESTIONS_PATH,
  BEFORE_ADDITIONAL_QUESTIONS_PATH,
  getNextPanelPath,
  getPreviousPanelPath,
  isPanelVisible,
  PanelKeyWithComponentsConditions,
} from './navigationUtils'

const mockPanel = (key: string, conditions: PanelKeyWithComponentsConditions['componentsConditions'] = []) => ({
  componentsConditions: conditions,
  key,
})

const hiddenWhenValueIsOne = { conditional: { eq: 'one', show: false, when: 'questionKey' }, key: 'key' }
const shownWhenValueIsOne = { conditional: { eq: 'one', show: true, when: 'questionKey' }, key: 'key' }

describe('isPanelVisible', () => {
  it('returns true when a component has no conditions', () => {
    expect(isPanelVisible(mockPanel('test', [{ conditional: null, key: 'not-used' }]), {})).toBe(true)
  })

  it('returns false when all components are hidden (show:false, condition met)', () => {
    expect(isPanelVisible(mockPanel('test', [hiddenWhenValueIsOne]), { questionKey: 'one' })).toBe(false)
  })

  it('returns true when at least one component is visible', () => {
    expect(isPanelVisible(mockPanel('test', [hiddenWhenValueIsOne, shownWhenValueIsOne]), { questionKey: 'one' })).toBe(
      true,
    )
  })

  it('returns true when show:false but condition is not met', () => {
    expect(isPanelVisible(mockPanel('test', [hiddenWhenValueIsOne]), { questionKey: 'two' })).toBe(true)
  })

  it('returns true when show:true and condition is met', () => {
    expect(isPanelVisible(mockPanel('test', [shownWhenValueIsOne]), { questionKey: 'one' })).toBe(true)
  })

  it('returns false when show:true but condition is not met', () => {
    expect(isPanelVisible(mockPanel('test', [shownWhenValueIsOne]), { questionKey: 'two' })).toBe(false)
  })

  it('returns true when answer is missing (cannot evaluate conditional)', () => {
    expect(isPanelVisible(mockPanel('test', [hiddenWhenValueIsOne]), {})).toBe(true)
  })
})

describe('getNextPanelPath', () => {
  const panels = [mockPanel('panel-1'), mockPanel('panel-2', [hiddenWhenValueIsOne]), mockPanel('panel-3')]
  const classificationId = 1
  const currentPanelIndex = 0

  it('returns the next visible panel', () => {
    expect(getNextPanelPath(classificationId, currentPanelIndex, panels, {})).toBe('/aanvullende-vragen/1/panel-2')
  })

  it('skips a hidden panel and returns the one after', () => {
    expect(getNextPanelPath(classificationId, currentPanelIndex, panels, { questionKey: 'one' })).toBe(
      '/aanvullende-vragen/1/panel-3',
    )
  })

  it('skips multiple consecutive hidden panels', () => {
    const allHidden = [
      mockPanel('panel-1'),
      mockPanel('panel-2', [hiddenWhenValueIsOne]),
      mockPanel('panel-3', [hiddenWhenValueIsOne]),
      mockPanel('panel-4'),
    ]
    expect(getNextPanelPath(classificationId, currentPanelIndex, allHidden, { questionKey: 'one' })).toBe(
      '/aanvullende-vragen/1/panel-4',
    )
  })

  it('returns AFTER_ADDITIONAL_QUESTIONS_PATH when all remaining panels are hidden', () => {
    const allHiddenAfter = [mockPanel('panel-1'), mockPanel('panel-2', [hiddenWhenValueIsOne])]
    expect(getNextPanelPath(classificationId, currentPanelIndex, allHiddenAfter, { questionKey: 'one' })).toBe(
      AFTER_ADDITIONAL_QUESTIONS_PATH,
    )
  })

  it('returns AFTER_ADDITIONAL_QUESTIONS_PATH when already on the last panel', () => {
    expect(getNextPanelPath(classificationId, 2, panels, {})).toBe(AFTER_ADDITIONAL_QUESTIONS_PATH)
  })
})

describe('getPreviousPanelPath', () => {
  const panels = [mockPanel('panel-1'), mockPanel('panel-2', [hiddenWhenValueIsOne]), mockPanel('panel-3')]
  const classificationId = 1

  it('returns the previous visible panel', () => {
    expect(getPreviousPanelPath(classificationId, 2, panels, {})).toBe('/aanvullende-vragen/1/panel-2')
  })

  it('skips a hidden panel and returns the one before', () => {
    expect(getPreviousPanelPath(classificationId, 2, panels, { questionKey: 'one' })).toBe(
      '/aanvullende-vragen/1/panel-1',
    )
  })

  it('skips multiple consecutive hidden panels', () => {
    const allHidden = [
      mockPanel('panel-1'),
      mockPanel('panel-2', [hiddenWhenValueIsOne]),
      mockPanel('panel-3', [hiddenWhenValueIsOne]),
      mockPanel('panel-4'),
    ]
    expect(getPreviousPanelPath(classificationId, 3, allHidden, { questionKey: 'one' })).toBe(
      '/aanvullende-vragen/1/panel-1',
    )
  })

  it('returns BEFORE_ADDITIONAL_QUESTIONS_PATH when all preceding panels are hidden', () => {
    const allHiddenBefore = [mockPanel('panel-1', [hiddenWhenValueIsOne]), mockPanel('panel-2')]
    expect(getPreviousPanelPath(classificationId, 1, allHiddenBefore, { questionKey: 'one' })).toBe(
      BEFORE_ADDITIONAL_QUESTIONS_PATH,
    )
  })

  it('returns BEFORE_ADDITIONAL_QUESTIONS_PATH when already on the first panel', () => {
    expect(getPreviousPanelPath(classificationId, 0, panels, {})).toBe(BEFORE_ADDITIONAL_QUESTIONS_PATH)
  })
})
