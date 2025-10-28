import { editForm } from './editForm'

describe('editForm', () => {
  it('should return an object with correct tabs and inputs', () => {
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
    const dataTab = tabs?.components.find((t) => t.key === 'data')
    const validationTab = tabs?.components.find((t) => t.key === 'validation')

    expect(displayTab).toBeDefined()
    expect(dataTab).toBeDefined()
    expect(validationTab).toBeDefined()

    // Check for the right input fields
    const displayKeys = displayTab?.components.map((c) => c.key)
    expect(displayKeys).toContain('label')
    expect(displayKeys).toContain('description')

    const datayKeys = dataTab?.components.map((c) => c.key)
    expect(datayKeys).toContain('values')

    const validationKeys = validationTab?.components.map((c) => c.key)
    expect(validationKeys).toContain('validate.required')
    expect(validationKeys).toContain('validate.required_error_message')
    expect(validationKeys).toContain('json-validation-json')
  })
})
