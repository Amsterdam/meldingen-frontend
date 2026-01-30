import type {
  FormCheckboxComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
  StaticFormTextAreaComponentOutput,
} from '@meldingen/api-client'

export type Validate = {
  json: Record<string, unknown>
  maxLength?: number
  maxLengthErrorMessage?: string
  minLength?: number
  minLengthErrorMessage?: string
  required: boolean
}

type WithValidate<T> = Omit<T, 'validate'> & {
  validate?: Validate
}

export type FormCheckboxComponent = WithValidate<FormCheckboxComponentOutput> & {
  defaultValues?: string[]
}

export type FormRadioComponent = WithValidate<FormRadioComponentOutput> & {
  defaultValue?: string
}

export type FormSelectComponent = WithValidate<FormSelectComponentOutput> & {
  defaultValue?: string
}

export type FormTextAreaComponent = WithValidate<FormTextAreaComponentOutput> & {
  defaultValue?: string
}

export type FormTextFieldInputComponent = WithValidate<FormTextFieldInputComponentOutput> & {
  defaultValue?: string
}

export type StaticFormTextAreaComponent = WithValidate<StaticFormTextAreaComponentOutput> & {
  defaultValue?: string
}

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
