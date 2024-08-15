import { FormBuilder } from '@meldingen/formio'

import type { ComponentSchema } from 'formiojs'
import type { FormioSchema } from '../../../types/formio'

import nl from './translations/nl.json'

type BuilderProps = {
  data?: ComponentSchema[]
  onChange: (schema: FormioSchema) => void
}

export const Builder = ({ data, onChange }: BuilderProps) => (
  <FormBuilder
    onChange={onChange}
    form={data ? { display: 'wizard', components: data } : { display: 'wizard' }}
    options={{
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
      editForm: {
        textarea: [
          {
            key: 'display',
            components: [
              {
                key: 'applyMaskOn', // Use this to hide fields from edit form panels ('display' in this case)
                ignore: true,
              },
              {
                key: 'displayMask',
                ignore: true,
              },
              {
                key: 'labelPosition',
                ignore: true,
              },
              {
                key: 'tooltip',
                ignore: true,
              },
              {
                key: 'prefix',
                ignore: true,
              },
              {
                key: 'suffix',
                ignore: true,
              },
            ],
          },
          {
            key: 'api',
            ignore: true, // Use this to hide entire panels
          },
        ],
      },
    }}
  />
)
