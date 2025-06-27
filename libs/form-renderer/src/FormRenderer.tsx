import { ChangeEvent } from 'react'

import type {
  FormCheckboxComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
} from '@meldingen/api-client'
import { SubmitButton } from '@meldingen/ui'

import { Checkbox, Radio, Select, TextArea, TextInput } from './components'

// TODO: create union type of this and refactor function
type Component = FormCheckboxComponentOutput &
  FormRadioComponentOutput &
  FormSelectComponentOutput &
  FormTextAreaComponentOutput &
  FormTextFieldInputComponentOutput & {
    defaultValue: string
  }

type AllFormInputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const getComponent = (
  { key, data, description, label, maxCharCount, type, values, validate, defaultValue }: Component,
  onChange: (event: ChangeEvent<AllFormInputs>) => void,
) => {
  switch (type) {
    case 'radio':
      return (
        <Radio
          defaultValue={defaultValue}
          description={description}
          id={key}
          key={key}
          label={label}
          onChange={onChange}
          validate={validate}
          values={values}
        />
      )
    case 'select':
      return (
        <Select
          data={data}
          defaultValue={defaultValue}
          description={description}
          id={key}
          key={key}
          label={label}
          onChange={onChange}
          validate={validate}
        />
      )
    case 'selectboxes':
      return (
        <Checkbox
          defaultValue={defaultValue}
          description={description}
          id={key}
          key={key}
          label={label}
          onChange={onChange}
          validate={validate}
          values={values}
        />
      )
    case 'textarea':
      return (
        <TextArea
          defaultValue={defaultValue}
          description={description}
          id={key}
          key={key}
          label={label}
          maxCharCount={maxCharCount}
          onChange={onChange}
          validate={validate}
        />
      )
    case 'textfield':
      return <TextInput key={key} id={key} description={description} label={label} validate={validate} />
    default:
      // TODO: error handling can probably be improved
      console.error(`Type ${type} is unknown, please add it to FormRenderer.`)
      return undefined
  }
}

// TODO: fix formData type
type Props = {
  formData: any[]
  action: (formData: FormData) => void
  submitButtonText: string
  onChange: (event: ChangeEvent<AllFormInputs>) => void
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
