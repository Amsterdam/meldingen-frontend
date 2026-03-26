import type { FormOutput, GetMeldingByMeldingIdAnswersMelderResponses } from '@meldingen/api-client'

import type { PanelComponentsConditions } from './navigationUtils'

import {
  AFTER_ADDITIONAL_QUESTIONS_PATH,
  BEFORE_ADDITIONAL_QUESTIONS_PATH,
  getNextPanelPath,
  getPreviousAnswersByKey,
  getPreviousPanelPath,
  shouldLinkToPanel,
} from './navigationUtils'
import { TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'

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

  it('returns true when answer is missing (cannot evaluate conditional)', () => {
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

describe('getPreviousPanelPath', () => {
  const panels = [mockPanel('panel-1'), mockPanel('panel-2', [doNotRenderWhenValueIsOne]), mockPanel('panel-3')]
  const classificationId = 1

  it('returns the previous panel that should be linked to', () => {
    expect(getPreviousPanelPath(classificationId, 2, panels, {})).toBe(`/aanvullende-vragen/1/panel-2#${TOP_ANCHOR_ID}`)
  })

  it('skips a hidden panel and returns the one before', () => {
    expect(getPreviousPanelPath(classificationId, 2, panels, { questionKey: 'one' })).toBe(
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
    expect(getPreviousPanelPath(classificationId, 3, allHidden, { questionKey: 'one' })).toBe(
      `/aanvullende-vragen/1/panel-1#${TOP_ANCHOR_ID}`,
    )
  })

  it('returns BEFORE_ADDITIONAL_QUESTIONS_PATH when all preceding panels are hidden', () => {
    const allHiddenBefore = [mockPanel('panel-1', [doNotRenderWhenValueIsOne]), mockPanel('panel-2')]
    expect(getPreviousPanelPath(classificationId, 1, allHiddenBefore, { questionKey: 'one' })).toBe(
      BEFORE_ADDITIONAL_QUESTIONS_PATH,
    )
  })

  it('returns BEFORE_ADDITIONAL_QUESTIONS_PATH when already on the first panel', () => {
    expect(getPreviousPanelPath(classificationId, 0, panels, {})).toBe(BEFORE_ADDITIONAL_QUESTIONS_PATH)
  })
})

describe('getPreviousAnswersByKey', () => {
  const formData = {
    components: [{ components: [{ key: 'field-1', question: 1 }], key: 'panel-1', type: 'panel' }],
  } as unknown as FormOutput

  it('skips non-panel components', () => {
    const formDataWithNonPanel = {
      components: [
        { key: 'submit-button', type: 'button' },
        { components: [{ key: 'field-1', question: 1 }], key: 'panel-1', type: 'panel' },
      ],
    } as unknown as FormOutput

    expect(getPreviousAnswersByKey(formDataWithNonPanel, [])).toEqual({ 'field-1': null })
  })

  it('sets null when no answer is found for a component', () => {
    expect(getPreviousAnswersByKey(formData, [])).toEqual({ 'field-1': null })
  })

  it('sets null for an answer with an unhandled type', () => {
    const answers = [
      { question: { id: 1 }, type: 'unknown' },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getPreviousAnswersByKey(formData, answers)).toEqual({ 'field-1': null })
  })

  it('sets the text value for an answer with type "text"', () => {
    const answers = [
      { question: { id: 1 }, text: 'some text', type: 'text' },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getPreviousAnswersByKey(formData, answers)).toEqual({ 'field-1': 'some text' })
  })

  it('sets null for a "text" answer when text is null', () => {
    const answers = [
      { question: { id: 1 }, text: null, type: 'text' },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getPreviousAnswersByKey(formData, answers)).toEqual({ 'field-1': null })
  })

  it('sets the time value for an answer with type "time"', () => {
    const answers = [
      { question: { id: 1 }, time: '12:30', type: 'time' },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getPreviousAnswersByKey(formData, answers)).toEqual({ 'field-1': '12:30' })
  })

  it('sets null for a "time" answer when time is null', () => {
    const answers = [
      { question: { id: 1 }, time: null, type: 'time' },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getPreviousAnswersByKey(formData, answers)).toEqual({ 'field-1': null })
  })

  it('sets an array of values for an answer with type "value_label"', () => {
    const answers = [
      {
        question: { id: 1 },
        type: 'value_label',
        values_and_labels: [
          { label: 'Label 1', value: 'value-1' },
          { label: 'Label 2', value: 'value-2' },
        ],
      },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getPreviousAnswersByKey(formData, answers)).toEqual({ 'field-1': ['value-1', 'value-2'] })
  })

  it('sets null for a "value_label" answer when values_and_labels is null', () => {
    const answers = [
      { question: { id: 1 }, type: 'value_label', values_and_labels: null },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getPreviousAnswersByKey(formData, answers)).toEqual({ 'field-1': null })
  })
})
