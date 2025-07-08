import { SubmitButton } from '@meldingen/ui'

import { Checkbox, Radio, Select, TextArea, TextInput } from './components'
import type { Component } from './types'
import { isRadio, isSelect, isSelectboxes, isTextarea, isTextfield } from './utils'

const getComponent = (component: Component, onChange: (value: string | string[], name: string) => void) => {
  if (isRadio(component)) {
    const { defaultValue, description, key, label, validate, values } = component
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
  }
  if (isSelect(component)) {
    const { defaultValue, description, key, label, validate, data } = component
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
  }
  if (isSelectboxes(component)) {
    const { defaultValue, description, key, label, validate, values } = component
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
  }
  if (isTextarea(component)) {
    const { defaultValue, description, key, label, validate, maxCharCount } = component
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
  }

  if (isTextfield(component)) {
    const { defaultValue, description, key, label, validate } = component
    return (
      <TextInput
        defaultValue={defaultValue}
        key={key}
        id={key}
        description={description}
        label={label}
        onChange={onChange}
        validate={validate}
      />
    )
  }

  // eslint-disable-next-line no-console
  console.error(`Type ${component.type} is unknown, please add it to FormRenderer.`)
  return undefined
}

type Props = {
  formData: Component[]
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
