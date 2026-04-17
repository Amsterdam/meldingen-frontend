import type { FormOutput, GetMeldingByMeldingIdAnswersMelderResponses } from '@meldingen/api-client'

import { getAnswersByKey } from './getAnswersByKey'

describe('getAnswersByKey', () => {
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

    expect(getAnswersByKey(formDataWithNonPanel, [])).toEqual({ 'field-1': null })
  })

  it('sets null when no answer is found for a component', () => {
    expect(getAnswersByKey(formData, [])).toEqual({ 'field-1': null })
  })

  it('sets null for an answer with an unhandled type', () => {
    const answers = [
      { question: { id: 1 }, type: 'unknown' },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getAnswersByKey(formData, answers)).toEqual({ 'field-1': null })
  })

  it('sets the text value for an answer with type "text"', () => {
    const answers = [
      { question: { id: 1 }, text: 'some text', type: 'text' },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getAnswersByKey(formData, answers)).toEqual({ 'field-1': 'some text' })
  })

  it('sets null for a "text" answer when text is null', () => {
    const answers = [
      { question: { id: 1 }, text: null, type: 'text' },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getAnswersByKey(formData, answers)).toEqual({ 'field-1': null })
  })

  it('sets the time value for an answer with type "time"', () => {
    const answers = [
      { question: { id: 1 }, time: '12:30', type: 'time' },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getAnswersByKey(formData, answers)).toEqual({ 'field-1': '12:30' })
  })

  it('sets null for a "time" answer when time is null', () => {
    const answers = [
      { question: { id: 1 }, time: null, type: 'time' },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getAnswersByKey(formData, answers)).toEqual({ 'field-1': null })
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

    expect(getAnswersByKey(formData, answers)).toEqual({ 'field-1': ['value-1', 'value-2'] })
  })

  it('sets null for a "value_label" answer when values_and_labels is null', () => {
    const answers = [
      { question: { id: 1 }, type: 'value_label', values_and_labels: null },
    ] as unknown as GetMeldingByMeldingIdAnswersMelderResponses['200']

    expect(getAnswersByKey(formData, answers)).toEqual({ 'field-1': null })
  })
})
