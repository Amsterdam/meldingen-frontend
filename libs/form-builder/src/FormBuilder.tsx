import type { FormBuilderProps, FormType } from '@formio/react'
import { Components, FormBuilder as FormioFormBuilder } from '@formio/react'
import type { ComponentSchema } from 'formiojs'

import { Radio, Select, SelectBoxes, Textarea, Textfield } from './components'
import nl from './translations/nl.json'

import 'formiojs/dist/formio.builder.min.css'

type Props = {
  data?: ComponentSchema[]
  onChange: (schema: FormType) => void
}

type ExtendedFormBuilderOptions = FormBuilderProps['options'] & {
  i18n?: {
    [key: string]: object
  }
}

export const FormBuilder = ({ data, onChange }: Props) => {
  Components.setComponents({
    radio: Radio,
    select: Select,
    selectboxes: SelectBoxes,
    textarea: Textarea,
    textfield: Textfield,
  })

  return (
    <FormioFormBuilder
      onChange={onChange}
      initialForm={{ display: 'wizard', components: data ?? [] }}
      options={
        {
          language: 'nl',
          i18n: {
            nl,
          },
          noDefaultSubmitButton: true,
          builder: {
            basic: {
              default: true,
              components: {
                button: false, // Use this to hide components on the left
                checkbox: false,
                number: false,
                password: false,
              },
            },
            advanced: false,
            layout: false,
            data: false,
            premium: false,
          },
        } as ExtendedFormBuilderOptions
      }
    />
  )
}
