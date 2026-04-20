import { shouldRenderComponent } from './shouldRenderComponent'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'

describe('shouldRenderComponent', () => {
  it('returns true when there is no usable conditional', () => {
    const componentWithoutConditional = textAreaComponent

    expect(shouldRenderComponent(componentWithoutConditional, {})).toBe(true)

    const componentWithEmptyConditional = {
      ...textAreaComponent,
      conditional: { eq: '', show: null, when: '' },
    }

    expect(shouldRenderComponent(componentWithEmptyConditional, {})).toBe(true)
  })

  it('evaluates conditions against string values', () => {
    const component = {
      ...textAreaComponent,
      conditional: { eq: 'yes', show: true, when: 'controller' },
    }

    expect(shouldRenderComponent(component, { controller: 'no' })).toBe(false)
    expect(shouldRenderComponent(component, { controller: 'yes' })).toBe(true)
  })

  it('evaluates conditions against values that are an array of strings and inverts when show is false', () => {
    const component = {
      ...textAreaComponent,
      conditional: { eq: 'one', show: false, when: 'boxes' },
    }

    expect(shouldRenderComponent(component, { boxes: ['one'] })).toBe(false)
    expect(shouldRenderComponent(component, { boxes: ['two'] })).toBe(true)
  })

  it('returns false when the component key used in the conditional is not present in the values', () => {
    const component = {
      ...textAreaComponent,
      conditional: { eq: 'yes', show: true, when: 'unknown-component-key' },
    }

    expect(shouldRenderComponent(component, {})).toBe(false)
  })
})
