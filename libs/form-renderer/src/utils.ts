import type {
  Component,
  FormCheckboxComponent,
  FormRadioComponent,
  FormSelectComponent,
  FormTextAreaComponent,
  FormTextFieldInputComponent,
} from './types'

export const isRadio = (component: Component): component is FormRadioComponent => component.type === 'radio'

export const isSelect = (component: Component): component is FormSelectComponent => component.type === 'select'

export const isSelectboxes = (component: Component): component is FormCheckboxComponent =>
  component.type === 'selectboxes'

export const isTextarea = (component: Component): component is FormTextAreaComponent => component.type === 'textarea'

export const isTextfield = (component: Component): component is FormTextFieldInputComponent =>
  component.type === 'textfield'
