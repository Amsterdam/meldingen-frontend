import { describe, expect, it } from 'vitest'

import type { Component } from './types'

import { form } from './mocks/data'
import { isRadio, isSelect, isSelectboxes, isTextarea, isTextfield } from './utils'

describe('type guards', () => {
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

    expect(isRadio(unknownComponent)).toBe(false)
    expect(isSelect(unknownComponent)).toBe(false)
    expect(isSelectboxes(unknownComponent)).toBe(false)
    expect(isTextarea(unknownComponent)).toBe(false)
    expect(isTextfield(unknownComponent)).toBe(false)
  })
})
