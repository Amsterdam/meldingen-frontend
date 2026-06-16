import type { PanelComponentsConditions } from './shouldLinkToPanel'

import { shouldLinkToPanel } from './shouldLinkToPanel'

const mockPanel = (key: string, conditions: PanelComponentsConditions['componentsConditions'] = []) => ({
  componentsConditions: conditions,
  key,
})

const doNotRenderWhenValueIsOne = { conditional: { eq: 'one', show: false, when: 'questionKey' }, key: 'key' }
const renderWhenValueIsOne = { conditional: { eq: 'one', show: true, when: 'questionKey' }, key: 'key' }

describe('shouldLinkToPanel', () => {
  it('returns true when a component has no conditions', () => {
    expect(shouldLinkToPanel(mockPanel('test', [{ conditional: null, key: 'not-used' }]), {})).toBe(true)
  })

  it('returns false when no components are rendered (show:false, condition met)', () => {
    expect(shouldLinkToPanel(mockPanel('test', [doNotRenderWhenValueIsOne]), { questionKey: 'one' })).toBe(false)
  })

  it('returns true when at least one component is rendered', () => {
    expect(
      shouldLinkToPanel(mockPanel('test', [doNotRenderWhenValueIsOne, renderWhenValueIsOne]), { questionKey: 'one' }),
    ).toBe(true)
  })

  it('returns true when show:false but condition is not met', () => {
    expect(shouldLinkToPanel(mockPanel('test', [doNotRenderWhenValueIsOne]), { questionKey: 'two' })).toBe(true)
  })

  it('returns true when show:true and condition is met', () => {
    expect(shouldLinkToPanel(mockPanel('test', [renderWhenValueIsOne]), { questionKey: 'one' })).toBe(true)
  })

  it('returns false when show:true but condition is not met', () => {
    expect(shouldLinkToPanel(mockPanel('test', [renderWhenValueIsOne]), { questionKey: 'two' })).toBe(false)
  })

  it('returns true when answer is missing (cannot evaluate condition)', () => {
    expect(shouldLinkToPanel(mockPanel('test', [doNotRenderWhenValueIsOne]), {})).toBe(true)
  })

  it('returns true when show:true, condition is met and answer is an array containing the value', () => {
    expect(shouldLinkToPanel(mockPanel('test', [renderWhenValueIsOne]), { questionKey: ['one', 'two'] })).toBe(true)
  })

  it('returns false when show:true, condition is not met and answer is an array not containing the value', () => {
    expect(shouldLinkToPanel(mockPanel('test', [renderWhenValueIsOne]), { questionKey: ['two', 'three'] })).toBe(false)
  })

  it('returns false when show:false, condition is met and answer is an array containing the value', () => {
    expect(shouldLinkToPanel(mockPanel('test', [doNotRenderWhenValueIsOne]), { questionKey: ['one', 'two'] })).toBe(
      false,
    )
  })
})
