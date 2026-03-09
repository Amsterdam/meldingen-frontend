import type {
  FormCheckboxComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
  StaticFormTextAreaComponentOutput,
} from '@meldingen/api-client'

export type FormCheckboxComponent = FormCheckboxComponentOutput & { value?: string[] }
export type FormRadioComponent = FormRadioComponentOutput & { value?: string }
export type FormSelectComponent = FormSelectComponentOutput & { value?: string }
export type FormTextAreaComponent = FormTextAreaComponentOutput & { value?: string }
export type FormTextFieldInputComponent = FormTextFieldInputComponentOutput & { value?: string }
export type StaticFormTextAreaComponent = StaticFormTextAreaComponentOutput & { value?: string }

export type Component =
  | FormCheckboxComponent
  | FormRadioComponent
  | FormSelectComponent
  | FormTextAreaComponent
  | FormTextFieldInputComponent
  | StaticFormTextAreaComponent

export type Form = {
  classification: number
  components: PanelComponent[]
  created_at: string
  display: 'wizard' | string
  id: number
  title: string
  updated_at: string
}

export type PanelComponent = {
  components: Component[]
  input: false
  key: string
  label: string
  position: number
  type: 'panel'
}
