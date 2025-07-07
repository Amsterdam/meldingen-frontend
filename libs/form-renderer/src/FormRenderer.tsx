import type {
  FormCheckboxComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
} from '@meldingen/api-client'
import { SubmitButton } from '@meldingen/ui'

import { Checkbox, Radio, Select, TextArea, TextInput } from './components'

type FormCheckboxComponent = FormCheckboxComponentOutput & { defaultValue: string[] }
type FormRadioComponent = FormRadioComponentOutput & { defaultValue: string }
type FormSelectComponent = FormSelectComponentOutput & { defaultValue: string }
type FormTextAreaComponent = FormTextAreaComponentOutput & { defaultValue: string }
type FormTextFieldInputComponent = FormTextFieldInputComponentOutput & { defaultValue: string }

type Component =
  | FormCheckboxComponent
  | FormRadioComponent
  | FormSelectComponent
  | FormTextAreaComponent
  | FormTextFieldInputComponent

const isRadio = (component: Component): component is FormRadioComponent => component.type === 'radio'

const isSelect = (component: Component): component is FormSelectComponent => component.type === 'select'

const isSelectboxes = (component: Component): component is FormCheckboxComponent => component.type === 'selectboxes'

const isTextarea = (component: Component): component is FormTextAreaComponent => component.type === 'textarea'

const isTextfield = (component: Component): component is FormTextFieldInputComponent => component.type === 'textfield'

const getComponent = (component: Component, onChange: (value: string | string[], name: string) => void) => {
  if (isRadio(component)) {
    const { defaultValue, description, key, label, validate, values } = component
    return (
      <Radio
        defaultValue={defaultValue as string}
        description={description}
        id={key}
        key={key}
        label={label}
        onChange={onChange}
        validate={validate}
        values={values}
      />
    )
  }
  if (isSelect(component)) {
    const { defaultValue, description, key, label, validate, data } = component
    return (
      <Select
        data={data}
        defaultValue={defaultValue as string}
        description={description}
        id={key}
        key={key}
        label={label}
        onChange={onChange}
        validate={validate}
      />
    )
  }
  if (isSelectboxes(component)) {
    const { defaultValue, description, key, label, validate, values } = component
    return (
      <Checkbox
        defaultValue={defaultValue as string[]}
        description={description}
        id={key}
        key={key}
        label={label}
        onChange={onChange}
        validate={validate}
        values={values}
      />
    )
  }
  if (isTextarea(component)) {
    const { defaultValue, description, key, label, validate, maxCharCount } = component
    return (
      <TextArea
        defaultValue={defaultValue as string}
        description={description}
        id={key}
        key={key}
        label={label}
        maxCharCount={maxCharCount}
        onChange={onChange}
        validate={validate}
      />
    )
  }

  if (isTextfield(component)) {
    const { defaultValue, description, key, label, validate } = component
    return (
      <TextInput
        defaultValue={defaultValue as string}
        key={key}
        id={key}
        description={description}
        label={label}
        onChange={onChange}
        validate={validate}
      />
    )
  }

  // @ts-expect-error component type is unknown
  console.error(`Type ${component.type} is unknown, please add it to FormRenderer.`)
  return undefined
}

// TODO: fix formData type
type Props = {
  formData: any[]
  action: (formData: FormData) => void
  submitButtonText: string
  onChange: (value: string | string[], name: string) => void
}

export const FormRenderer = ({ formData, action, submitButtonText, onChange }: Props) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <form className="ams-gap-m" action={action}>
      {formData.map((component) => getComponent(component, onChange))}
      <SubmitButton>{submitButtonText}</SubmitButton>
    </form>
  )
}
