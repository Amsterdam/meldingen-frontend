import { getContextComponents } from '@formio/js/utils'

import { convertEmptyStringToNull, editForm, getMaxCharCountValue } from './editForm'

describe('getMaxCharCountValue', () => {
  it('returns the maxLength from validate object', () => {
    const context = {
      data: { validate: { maxLength: 150 } },
      self: { pristine: false },
    }

    const result = getMaxCharCountValue(context)
    expect(result).toBe(150)
  })

  it('returns empty string if maxLength is not set', () => {
    const context = {
      data: { validate: {} },
      self: { pristine: false },
    }

    const result = getMaxCharCountValue(context)
    expect(result).toBe('')
  })
})

describe('convertEmptyStringToNull', () => {
  it('sets maxCharCount to null if it is an empty string', () => {
    const context = {
      data: { maxCharCount: '' as const },
    }

    const result = convertEmptyStringToNull(context)
    expect(result).toBe(true)
    expect(context.data.maxCharCount).toBeNull()
  })

  it('does not change maxCharCount if it has a valid number', () => {
    const context = {
      data: { maxCharCount: 200 },
    }

    const result = convertEmptyStringToNull(context)
    expect(result).toBe(true)
    expect(context.data.maxCharCount).toBe(200)
  })
})

describe('editForm', () => {
  it('returns an object with correct tabs and inputs', () => {
    const form = editForm()

    // Check top-level structure
    expect(form).toHaveProperty('components')
    expect(Array.isArray(form.components)).toBe(true)

    // Find the tabs component
    const tabs = form.components.find((c) => c.type === 'tabs')
    expect(tabs).toBeDefined()
    expect(tabs?.components).toBeInstanceOf(Array)

    // Check for the right tabs
    const displayTab = tabs?.components.find((t) => t.key === 'display')
    const validationTab = tabs?.components.find((t) => t.key === 'validation')
    const conditionalTab = tabs?.components.find((t) => t.key === 'conditional')

    expect(displayTab).toBeDefined()
    expect(validationTab).toBeDefined()
    expect(conditionalTab).toBeDefined()

    // Check for the right input fields
    const displayKeys = displayTab?.components.map((c) => c.key)
    expect(displayKeys).toContain('label')
    expect(displayKeys).toContain('description')
    expect(displayKeys).toContain('maxCharCount') // This is a hidden field which calculates the max char count based on the validate.maxLength value

    const validationKeys = validationTab?.components.map((c) => c.key)

    expect(validationKeys).toStrictEqual([
      'validate.required',
      'validate.required_error_message',
      'validate.maxLength',
      'validate.maxLengthErrorMessage',
      'validate.minLength',
      'validate.minLengthErrorMessage',
      'validate.json', // This is a hidden field which stores the JSON logic
    ])

    const conditionalKeys = conditionalTab?.components.map((c) => c.key)
    expect(conditionalKeys).toStrictEqual(['conditional.show', 'conditional.when', 'conditional.eq'])
  })

  it('calculates the value for minLengthErrorMessage correctly', () => {
    const form = editForm()
    const validationTab = form.components[0].components[1]
    const minLengthErrorMessageField = validationTab.components.find((c) => c.key === 'validate.minLengthErrorMessage')

    const context = {
      data: { validate: { minLengthErrorMessage: 'Too short!' } },
      self: { pristine: false },
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (minLengthErrorMessageField as any)?.calculateValue?.(context)
    expect(result).toBe('Too short!')
  })

  it('calculates the value for maxLengthErrorMessage correctly', () => {
    const form = editForm()
    const validationTab = form.components[0].components[1]
    const maxLengthErrorMessageField = validationTab.components.find((c) => c.key === 'validate.maxLengthErrorMessage')

    const context = {
      data: { validate: { maxLengthErrorMessage: 'Too long!' } },
      self: { pristine: false },
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (maxLengthErrorMessageField as any)?.calculateValue?.(context)
    expect(result).toBe('Too long!')
  })

  it("calls getContextComponents with context and false for 'When' field", () => {
    const form = editForm()
    const conditionalTab = form.components[0].components[2]
    const whenField = conditionalTab.components.find((c) => c.key === 'conditional.when')

    const context = { instance: {} }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(whenField as any)?.data?.custom(context)

    expect(getContextComponents).toHaveBeenCalledWith(context, false)
  })
})
