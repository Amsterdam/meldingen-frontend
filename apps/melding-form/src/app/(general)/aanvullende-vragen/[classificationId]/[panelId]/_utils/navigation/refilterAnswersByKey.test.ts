import type { PanelComponentsConditions } from './shouldLinkToPanel'

import { refilterAnswersByKey } from './refilterAnswersByKey'

const mockPanel = (key: string, conditions: PanelComponentsConditions['componentsConditions'] = []) => ({
  componentsConditions: conditions,
  key,
})

describe('refilterAnswersByKey', () => {
  const panels: PanelComponentsConditions[] = [
    mockPanel('panel-1', [{ key: 'key1' }, { conditional: { eq: 'one', show: true, when: 'key1' }, key: 'key2' }]),
    mockPanel('panel-2', [{ key: 'key3' }]),
  ]

  it('returns only answers for components that should be rendered', () => {
    const answers = { key1: 'two', key2: 'answer2', key3: 'answer3' }
    expect(refilterAnswersByKey(panels, answers)).toEqual({ key1: 'two', key3: 'answer3' })
  })

  it('returns an empty object when answers contain no matching keys', () => {
    const answers = { key4: 'answer4', key5: 'answer5', key6: 'answer6' }
    expect(refilterAnswersByKey(panels, answers)).toEqual({})
  })

  it('returns all answers when all components should be rendered', () => {
    const answers = { key1: 'one', key2: 'answer2', key3: 'answer3' }
    expect(refilterAnswersByKey(panels, answers)).toEqual({ key1: 'one', key2: 'answer2', key3: 'answer3' })
  })
})
