import dynamic from 'next/dynamic'

import type { FormioSchema } from '../../../types/formio'

const FormBuilder = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormBuilder), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

type BuilderProps = {
  data?: FormioSchema
  onChange: (schema: FormioSchema) => void
}

export const Builder = ({ data = { title: '', display: 'form', components: [] }, onChange }: BuilderProps) => (
  <FormBuilder
    onChange={onChange}
    form={data}
    options={{
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
        textfield: [
          {
            key: 'display',
            components: [
              {
                key: 'labelPosition',
                ignore: true, // Use this to hide fields from edit form panels ('display' in this case)
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
