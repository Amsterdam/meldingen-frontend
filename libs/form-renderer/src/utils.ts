import type {
  FormCheckboxComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
} from '@meldingen/api-client'

type FormCheckboxComponent = FormCheckboxComponentOutput & { defaultValue: string[] }
type FormRadioComponent = FormRadioComponentOutput & { defaultValue: string }
type FormSelectComponent = FormSelectComponentOutput & { defaultValue: string }
type FormTextAreaComponent = FormTextAreaComponentOutput & { defaultValue: string }
type FormTextFieldInputComponent = FormTextFieldInputComponentOutput & { defaultValue: string }

export type Component =
  | FormCheckboxComponent
  | FormRadioComponent
  | FormSelectComponent
  | FormTextAreaComponent
  | FormTextFieldInputComponent

export const isRadio = (component: Component): component is FormRadioComponent => component.type === 'radio'

export const isSelect = (component: Component): component is FormSelectComponent => component.type === 'select'

export const isSelectboxes = (component: Component): component is FormCheckboxComponent =>
  component.type === 'selectboxes'

export const isTextarea = (component: Component): component is FormTextAreaComponent => component.type === 'textarea'

export const isTextfield = (component: Component): component is FormTextFieldInputComponent =>
  component.type === 'textfield'
