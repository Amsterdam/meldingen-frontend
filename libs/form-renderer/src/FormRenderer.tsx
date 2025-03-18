import type {
  FormCheckboxComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  FormTextAreaComponentOutput,
  FormTextFieldInputComponentOutput,
} from '@meldingen/api-client'
import { SubmitButton } from '@meldingen/ui'

import { Checkbox, Radio, Select, TextArea, TextInput } from './components'

type Component = FormCheckboxComponentOutput &
  FormRadioComponentOutput &
  FormSelectComponentOutput &
  FormTextAreaComponentOutput &
  FormTextFieldInputComponentOutput

const getComponent = ({ key, data, description, label, maxCharCount, type, values, validate }: Component) => {
  switch (type) {
    case 'radio':
      return <Radio key={key} id={key} description={description} label={label} values={values} validate={validate} />
    case 'select':
      return <Select key={key} id={key} description={description} label={label} data={data} validate={validate} />
    case 'selectboxes':
      return <Checkbox key={key} id={key} description={description} label={label} values={values} validate={validate} />
    case 'textarea':
      return (
        <TextArea
          key={key}
          id={key}
          description={description}
          label={label}
          maxCharCount={maxCharCount}
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
}

export const FormRenderer = ({ formData, action, submitButtonText }: Props) => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <form className="ams-gap--md" action={action}>
    {formData.map((component) => getComponent(component))}
    <SubmitButton>{submitButtonText}</SubmitButton>
  </form>
)
