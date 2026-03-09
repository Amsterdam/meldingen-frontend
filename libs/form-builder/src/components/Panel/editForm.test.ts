import { editForm } from './editForm'

describe('editForm', () => {
  it('only allows editing the title', () => {
    const form = editForm()

    const tabs = form.components.find((c) => c.type === 'tabs')
    expect(tabs).toBeDefined()

    const displayTab = tabs?.components?.find((t) => t.key === 'display')
    expect(displayTab).toBeDefined()

    const title = displayTab?.components?.find((c) => c.key === 'title')
    expect(title).toMatchObject({ disabled: undefined, input: true, key: 'title' })

    expect(displayTab?.components?.some((c) => c.key === 'label')).toBe(false)
    expect(displayTab?.components?.some((c) => c.key === 'key')).toBe(false)
  })
})
