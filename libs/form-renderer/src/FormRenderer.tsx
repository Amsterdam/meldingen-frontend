import { Button } from '@amsterdam/design-system-react'
import type {
  FormCheckboxComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
} from '@meldingen/api-client'
import type { FormEvent } from 'react'

import { Checkbox, Radio, Select, TextArea, TextInput } from './components'

type Component = FormCheckboxComponentOutput &
  FormRadioComponentOutput &
  FormSelectComponentOutput &
  FormTextAreaComponentOutput &
  FormTextFieldInputComponentOutput

const getComponent = ({ key, data, description, label, type, values, validate }: Component) => {
  switch (type) {
    case 'radio':
      return <Radio key={key} id={key} description={description} label={label} values={values} validate={validate} />
    case 'select':
      return (
        <Select key={key} id={key} description={description} label={label} name={key} data={data} validate={validate} />
      )
    case 'selectboxes':
      return <Checkbox key={key} id={key} description={description} label={label} values={values} validate={validate} />
    case 'textarea':
      return <TextArea key={key} id={key} description={description} label={label} name={key} validate={validate} />
    case 'textfield':
      return <TextInput key={key} id={key} description={description} label={label} name={key} validate={validate} />
    default:
      throw Error(`Type ${type} is unknown, please add it to FormRenderer.`)
  }
}

// TODO: fix formData type
type Props = {
  formData: any[]
  onSubmit: (e: FormEvent) => void
}

export const FormRenderer = ({ formData, onSubmit }: Props) => (
  <form className="ams-gap--md" onSubmit={onSubmit}>
    {formData.map((component) => getComponent(component))}
    <Button type="submit" style={{ width: 'fit-content' }}>
      Volgende vraag
    </Button>
  </form>
)
