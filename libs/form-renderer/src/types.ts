import type {
  FormCheckboxComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
  StaticFormTextAreaComponentOutput,
} from '@meldingen/api-client'

export type FormCheckboxComponent = FormCheckboxComponentOutput & { defaultValue?: string[] }
export type FormRadioComponent = FormRadioComponentOutput & { defaultValue?: string }
export type FormSelectComponent = FormSelectComponentOutput & { defaultValue?: string }
export type FormTextAreaComponent = FormTextAreaComponentOutput & { defaultValue?: string }
export type FormTextFieldInputComponent = FormTextFieldInputComponentOutput & { defaultValue?: string }
export type StaticFormTextAreaComponent = StaticFormTextAreaComponentOutput & { defaultValue?: string }

export type Component =
  | FormCheckboxComponent
  | FormRadioComponent
  | FormSelectComponent
  | FormTextAreaComponent
  | FormTextFieldInputComponent
  | StaticFormTextAreaComponent

export type Form = {
  id: number
  title: string
  display: 'wizard' | string
  created_at: string
  updated_at: string
  classification: number
  components: PanelComponent[]
}

export type PanelComponent = {
  label: string
  key: string
  type: 'panel'
  input: false
  position: number
  components: Component[]
}
