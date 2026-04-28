import { describe, expect, it } from 'vitest'

import type { Component } from './types'

import { form } from './mocks/data'
import {
  isRadio,
  isSelect,
  isSelectboxes,
  isTextarea,
  isTextfield,
  isTimeInput,
  refilterValues,
  shouldRender,
} from './utils'

describe('type guards', () => {
  it('isTimeInput should return true for type "time"', () => {
    expect(isTimeInput(form.components[0].components[5])).toBe(true)
  })

  it('isRadio should return true for type "radio"', () => {
    expect(isRadio(form.components[0].components[4])).toBe(true)
  })

  it('isSelect should return true for type "select"', () => {
    expect(isSelect(form.components[0].components[3])).toBe(true)
  })

  it('isSelectboxes should return true for type "selectboxes"', () => {
    expect(isSelectboxes(form.components[0].components[2])).toBe(true)
  })

  it('isTextarea should return true for type "textarea"', () => {
    expect(isTextarea(form.components[0].components[1])).toBe(true)
  })

  it('isTextfield should return true for type "textfield"', () => {
    expect(isTextfield(form.components[0].components[0])).toBe(true)
  })

  it('returns false for all guards if type is unknown', () => {
    const unknownComponent = {
      defaultValue: 'oops',
      key: 'bad',
      type: 'unknown',
    } as Component

    expect(isTimeInput(unknownComponent)).toBe(false)
    expect(isRadio(unknownComponent)).toBe(false)
    expect(isSelect(unknownComponent)).toBe(false)
    expect(isSelectboxes(unknownComponent)).toBe(false)
    expect(isTextarea(unknownComponent)).toBe(false)
    expect(isTextfield(unknownComponent)).toBe(false)
  })
})

describe('shouldRender', () => {
  it('returns true when there is no usable condition', () => {
    const componentWithoutConditional = { ...form.components[0].components[0] }

    expect(shouldRender(componentWithoutConditional, {})).toBe(true)

    const componentWithEmptyConditional = {
      ...form.components[0].components[0],
      conditional: { eq: '', show: null, when: '' },
    }

    expect(shouldRender(componentWithEmptyConditional, {})).toBe(true)
  })

  it('evaluates conditions against string values', () => {
    const component = {
      ...form.components[0].components[0],
      conditional: { eq: 'yes', show: true, when: 'controller' },
    }

    expect(shouldRender(component, { controller: 'no' })).toBe(false)
    expect(shouldRender(component, { controller: 'yes' })).toBe(true)
  })

  it('evaluates conditions against values that are an array of strings and inverts when show is false', () => {
    const component = {
      ...form.components[0].components[0],
      conditional: { eq: 'one', show: false, when: 'boxes' },
    }

    expect(shouldRender(component, { boxes: ['one'] })).toBe(false)
    expect(shouldRender(component, { boxes: ['two'] })).toBe(true)
  })

  it('returns false when the component key used in the condition is not present in the values', () => {
    const component = {
      ...form.components[0].components[0],
      conditional: { eq: 'yes', show: true, when: 'unknown-component-key' },
    }

    expect(shouldRender(component, {})).toBe(false)
  })
})

describe('refilterValues', () => {
  it('returns values for components that should render, and omits values for those that should not', () => {
    const components = form.components[0].components.slice(0, 3).map((component, index) => ({
      ...component,
      conditional: index === 2 ? { eq: 'yes', show: true, when: 'component-0' } : undefined,
      key: `component-${index}`,
    }))

    const previousAnswersByKey = {
      'component-0': 'no',
      'component-1': 'previous value 1',
      'component-2': 'previous value 2',
    }

    const current = {
      'component-0': 'yes',
      'component-1': 'current value 1',
      'component-2': 'current value 2',
    }

    const result = refilterValues(components, previousAnswersByKey, current)

    expect(result['component-0']).toBe('yes') // No condition, should take current value
    expect(result['component-1']).toBe('current value 1') // No condition, should take current value
    expect(result['component-2']).toBe('current value 2') // Condition met, should take current value

    // If we change component-0 to a value that doesn't meet the condition for component-2, component-2 should return undefined
    const currentWithUnmetCondition = {
      ...current,
      'component-0': 'no',
    }

    const resultWithUnmetCondition = refilterValues(components, previousAnswersByKey, currentWithUnmetCondition)

    expect(resultWithUnmetCondition['component-2']).toBe(undefined) // Condition not met, should return undefined
  })
})
