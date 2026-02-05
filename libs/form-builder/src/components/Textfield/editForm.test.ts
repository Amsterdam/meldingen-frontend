import { editForm } from './editForm'

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

    expect(displayTab).toBeDefined()
    expect(validationTab).toBeDefined()

    // Check for the right input fields
    const displayKeys = displayTab?.components.map((c) => c.key)
    expect(displayKeys).toContain('label')
    expect(displayKeys).toContain('description')

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
})
