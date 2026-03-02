import { describe, expect, it } from 'vitest'

import type { NavigationPanel } from './navigationUtils'

import {
  AFTER_ADDITIONAL_QUESTIONS_PATH,
  BEFORE_ADDITIONAL_QUESTIONS_PATH,
  getNextPanelPath,
  getPreviousPanelPath,
  isPanelVisible,
} from './navigationUtils'

const makePanel = (key: string, conditionals: NavigationPanel['componentConditionals'] = []): NavigationPanel => ({
  componentConditionals: conditionals,
  key,
})

const unconditional = { conditional: null, key: 'q' }
const hiddenWhenOne = { conditional: { eq: 'one', show: false, when: 'trigger' }, key: 'q' }
const shownWhenOne = { conditional: { eq: 'one', show: true, when: 'trigger' }, key: 'q' }

describe('isPanelVisible', () => {
  it('returns true when a component has no conditional', () => {
    expect(isPanelVisible(makePanel('p', [unconditional]), {})).toBe(true)
  })

  it('returns false when all components are hidden (show:false, condition met)', () => {
    expect(isPanelVisible(makePanel('p', [hiddenWhenOne]), { trigger: 'one' })).toBe(false)
  })

  it('returns true when at least one component is visible', () => {
    expect(isPanelVisible(makePanel('p', [hiddenWhenOne, unconditional]), { trigger: 'one' })).toBe(true)
  })

  it('returns true when show:false but condition is not met', () => {
    expect(isPanelVisible(makePanel('p', [hiddenWhenOne]), { trigger: 'two' })).toBe(true)
  })

  it('returns true when show:true and condition is met', () => {
    expect(isPanelVisible(makePanel('p', [shownWhenOne]), { trigger: 'one' })).toBe(true)
  })

  it('returns false when show:true but condition is not met', () => {
    expect(isPanelVisible(makePanel('p', [shownWhenOne]), { trigger: 'two' })).toBe(false)
  })

  it('returns true when answer is missing (cannot evaluate conditional)', () => {
    expect(isPanelVisible(makePanel('p', [hiddenWhenOne]), {})).toBe(true)
  })
})

describe('getNextPanelPath', () => {
  const panels = [makePanel('panel-1'), makePanel('panel-2', [hiddenWhenOne]), makePanel('panel-3')]

  it('returns the next visible panel', () => {
    expect(getNextPanelPath(1, 0, panels, {})).toBe('/aanvullende-vragen/1/panel-2')
  })

  it('skips a hidden panel and returns the one after', () => {
    expect(getNextPanelPath(1, 0, panels, { trigger: 'one' })).toBe('/aanvullende-vragen/1/panel-3')
  })

  it('skips multiple consecutive hidden panels', () => {
    const allHidden = [
      makePanel('panel-1'),
      makePanel('panel-2', [hiddenWhenOne]),
      makePanel('panel-3', [hiddenWhenOne]),
      makePanel('panel-4'),
    ]
    expect(getNextPanelPath(1, 0, allHidden, { trigger: 'one' })).toBe('/aanvullende-vragen/1/panel-4')
  })

  it('returns AFTER_ADDITIONAL_QUESTIONS_PATH when all remaining panels are hidden', () => {
    const allHiddenAfter = [makePanel('panel-1'), makePanel('panel-2', [hiddenWhenOne])]
    expect(getNextPanelPath(1, 0, allHiddenAfter, { trigger: 'one' })).toBe(AFTER_ADDITIONAL_QUESTIONS_PATH)
  })

  it('returns AFTER_ADDITIONAL_QUESTIONS_PATH when already on the last panel', () => {
    expect(getNextPanelPath(1, 2, panels, {})).toBe(AFTER_ADDITIONAL_QUESTIONS_PATH)
  })
})

describe('getPreviousPanelPath', () => {
  const panels = [makePanel('panel-1'), makePanel('panel-2', [hiddenWhenOne]), makePanel('panel-3')]

  it('returns the previous visible panel', () => {
    expect(getPreviousPanelPath(1, 2, panels, {})).toBe('/aanvullende-vragen/1/panel-2')
  })

  it('skips a hidden panel and returns the one before', () => {
    expect(getPreviousPanelPath(1, 2, panels, { trigger: 'one' })).toBe('/aanvullende-vragen/1/panel-1')
  })

  it('skips multiple consecutive hidden panels', () => {
    const allHidden = [
      makePanel('panel-1'),
      makePanel('panel-2', [hiddenWhenOne]),
      makePanel('panel-3', [hiddenWhenOne]),
      makePanel('panel-4'),
    ]
    expect(getPreviousPanelPath(1, 3, allHidden, { trigger: 'one' })).toBe('/aanvullende-vragen/1/panel-1')
  })

  it('returns BEFORE_ADDITIONAL_QUESTIONS_PATH when all preceding panels are hidden', () => {
    const allHiddenBefore = [makePanel('panel-1', [hiddenWhenOne]), makePanel('panel-2')]
    expect(getPreviousPanelPath(1, 1, allHiddenBefore, { trigger: 'one' })).toBe(BEFORE_ADDITIONAL_QUESTIONS_PATH)
  })

  it('returns BEFORE_ADDITIONAL_QUESTIONS_PATH when already on the first panel', () => {
    expect(getPreviousPanelPath(1, 0, panels, {})).toBe(BEFORE_ADDITIONAL_QUESTIONS_PATH)
  })
})
