import type {
  FormCheckboxComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
  StaticFormTextAreaComponentOutput,
} from '@meldingen/api-client'

export type FormCheckboxComponent = FormCheckboxComponentOutput & { defaultValues?: string[] }
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
