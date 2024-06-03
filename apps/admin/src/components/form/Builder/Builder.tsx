import type { ComponentSchema } from 'formiojs'
import dynamic from 'next/dynamic'

import type { FormioSchema } from '../../../types/formio'

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
      noDefaultSubmitButton: true,
      builder: {
        custom: {
          title: 'Input components',
          weight: 10,
          components: {
            textArea: {
              title: 'text area',
              key: 'textArea',
              schema: {
                label: 'Custom label',
                type: 'textarea',
                key: 'textAreaKey',
                input: true,
              },
            },
          },
        },
        basic: false,
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
