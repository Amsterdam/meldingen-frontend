import type {
  Component,
  FormCheckboxComponent,
  FormRadioComponent,
  FormSelectComponent,
  FormTextAreaComponent,
  FormTextFieldInputComponent,
} from './types'

const isNullOrEmpty = (value: unknown) => value === null || value === ''

export const isVisible = (component: Component, values: Record<string, string | string[]>): boolean => {
  const { conditional } = component

  if (
    !conditional ||
    isNullOrEmpty(conditional.when) ||
    isNullOrEmpty(conditional.eq) ||
    isNullOrEmpty(conditional.show)
  )
    return true

  const answerValue = values[conditional.when] ?? null
  const conditionMet =
    answerValue !== null && Array.isArray(answerValue)
      ? answerValue.includes(String(conditional.eq)) // For checkboxes, the answerValue is an array. The condition is met if at least one of the values matches the condition.
      : answerValue === String(conditional.eq)

  return conditional.show ? conditionMet : !conditionMet
}

export const isRadio = (component: Component): component is FormRadioComponent => component.type === 'radio'

export const isSelect = (component: Component): component is FormSelectComponent => component.type === 'select'

export const isSelectboxes = (component: Component): component is FormCheckboxComponent =>
  component.type === 'selectboxes'

export const isTextarea = (component: Component): component is FormTextAreaComponent => component.type === 'textarea'

export const isTextfield = (component: Component): component is FormTextFieldInputComponent =>
  component.type === 'textfield'

export const getAriaDescribedBy = (id: string, description?: string, errorMessage?: string) => {
  const ariaDescribedBy = []

  if (description) {
    ariaDescribedBy.push(`${id}-description`)
  }

  if (errorMessage) {
    ariaDescribedBy.push(`${id}-error`)
  }

  return ariaDescribedBy.length > 0 ? ariaDescribedBy.join(' ') : undefined
}
