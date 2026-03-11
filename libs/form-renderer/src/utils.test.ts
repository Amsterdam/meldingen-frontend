import { describe, expect, it } from 'vitest'

import type { Component } from './types'

import { form } from './mocks/data'
import { isRadio, isSelect, isSelectboxes, isTextarea, isTextfield, isTimeInput, isVisible } from './utils'

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

describe('isVisible', () => {
  it('returns true when there is no usable conditional', () => {
    const componentWithoutConditional = { ...form.components[0].components[0] }

    expect(isVisible(componentWithoutConditional, {})).toBe(true)

    const componentWithEmptyConditional = {
      ...form.components[0].components[0],
      conditional: { eq: '', show: null, when: '' },
    }

    expect(isVisible(componentWithEmptyConditional, {})).toBe(true)
  })

  it('evaluates conditionals against string values', () => {
    const component = {
      ...form.components[0].components[0],
      conditional: { eq: 'yes', show: true, when: 'controller' },
    }

    expect(isVisible(component, { controller: 'no' })).toBe(false)
    expect(isVisible(component, { controller: 'yes' })).toBe(true)
  })

  it('evaluates conditionals against values that are an array of strings and inverts when show is false', () => {
    const component = {
      ...form.components[0].components[0],
      conditional: { eq: 'one', show: false, when: 'boxes' },
    }

    expect(isVisible(component, { boxes: ['one'] })).toBe(false)
    expect(isVisible(component, { boxes: ['two'] })).toBe(true)
  })

  it('returns false when the component key used in the conditional is not present in the values', () => {
    const component = {
      ...form.components[0].components[0],
      conditional: { eq: 'yes', show: true, when: 'unknown-component-key' },
    }

    expect(isVisible(component, {})).toBe(false)
  })
})
