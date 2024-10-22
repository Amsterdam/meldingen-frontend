import type {
  FormCheckboxComponentOutput,
  FormOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
} from '@meldingen/api-client'

import { Checkbox, Select, TextArea, TextInput } from './components'

type Component = FormCheckboxComponentOutput &
  FormSelectComponentOutput &
  FormTextAreaComponentOutput &
  FormTextFieldInputComponentOutput

const getComponent = (component: Component) => {
  const { key, type, ...restProps } = component

  switch (type) {
    case 'select':
      return <Select key={key} id={key} {...restProps} />
    case 'selectboxes':
      return <Checkbox key={key} id={key} {...restProps} />
    case 'textarea':
      return <TextArea key={key} id={key} {...restProps} />
    case 'textfield':
      return <TextInput key={key} id={key} {...restProps} />
    default:
      throw Error(`Type ${type} is unknown, please add it to FormRenderer.`)
  }
}

export const FormRenderer = ({ form }: { form: FormOutput }) => {
  // Temporarily flatten panels and render all components on a single page
  // @ts-expect-error: Temp code
  const components = form.components.reduce((acc, panel) => acc.concat(panel?.components), [])

  return <form className="ams-gap--md">{components.map((component) => getComponent(component))}</form>
}
