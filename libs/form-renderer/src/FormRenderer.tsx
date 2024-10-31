import type {
  FormCheckboxComponentOutput,
  FormOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
} from '@meldingen/api-client'

import { Checkbox, Radio, Select, TextArea, TextInput } from './components'
import mockFormData from './mocks/mockFormData.json'

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
      return <Select key={key} id={key} description={description} label={label} data={data} validate={validate} />
    case 'selectboxes':
      return <Checkbox key={key} id={key} description={description} label={label} values={values} validate={validate} />
    case 'textarea':
      return <TextArea key={key} id={key} description={description} label={label} validate={validate} />
    case 'textfield':
      return <TextInput key={key} id={key} description={description} label={label} validate={validate} />
    default:
      throw Error(`Type ${type} is unknown, please add it to FormRenderer.`)
  }
}

export const FormRenderer = ({ form }: { form?: FormOutput }) => {
  const tempForm = form ?? mockFormData

  // Temporarily flatten panels and render all components on a single page
  // @ts-expect-error: Temp code
  const components = tempForm.components.reduce((acc, panel) => acc.concat(panel?.components), [])

  return <form className="ams-gap--md">{components.map((component) => getComponent(component))}</form>
}
