import { isTypeTextAreaComponent } from './isTypeTextAreaComponent'

const baseComponent = {
  autoExpand: false,
  description: 'description',
  input: true,
  key: 'key',
  label: 'label',
  position: 0,
}

describe('isTypeTextAreaComponent', () => {
  it('returns true for a component with type "textarea"', () => {
    expect(isTypeTextAreaComponent({ ...baseComponent, type: 'textarea' })).toBe(true)
  })

  it('returns false for a component with type "textfield"', () => {
    expect(isTypeTextAreaComponent({ ...baseComponent, type: 'textfield' })).toBe(false)
  })

  it('returns false for a component with type "panel"', () => {
    expect(isTypeTextAreaComponent({ ...baseComponent, type: 'panel' })).toBe(false)
  })
})
