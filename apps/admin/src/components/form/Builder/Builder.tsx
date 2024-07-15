import type { ComponentSchema } from 'formiojs'
import dynamic from 'next/dynamic'

import type { FormioSchema } from '../../../types/formio'

import nl from './translations/nl.json'

const FormBuilder = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormBuilder), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

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
            password: false,
          },
        },
        advanced: {
          default: true, // Use this to show all components on load
          components: {
            tags: false,
            currency: false,
            survey: false,
            signature: false,
          },
        },
        layout: {
          default: true,
          components: {
            table: false,
            well: false,
          },
        },
        data: false,
        premium: {
          default: true,
          components: {
            recaptcha: false,
            form: false,
            custom: false, // This doesn't seem to work
          },
        },
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
