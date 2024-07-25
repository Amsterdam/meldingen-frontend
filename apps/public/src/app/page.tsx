import type { ComponentSchema } from 'formiojs'

import type { StaticFormOutput } from '@meldingen/api-client'
import { getStaticFormByFormType } from '@meldingen/api-client'

import { Home } from './Home'

export type StaticFormWithSubmit = Omit<StaticFormOutput, 'components'> & { components: ComponentSchema[] }

const addSubmitButton = (form: StaticFormOutput): StaticFormWithSubmit => ({
  ...form,
  components: [
    ...form.components,

    {
      label: 'Vraagtekst',
      description: 'Omschrijving van de vraag',
      values: [
        {
          label: 'Optie 1',
          value: 'optie1', // Waarde die naar de server wordt gestuurd
        },
        {
          label: 'Optie 2',
          value: 'optie2',
        },
        {
          label: 'Optie 3',
          value: 'optie3',
        },
      ],
      key: 'vraagtekst', // Wordt gegenereerd door Formio obv het label
      type: 'radio',
      input: true,
    },
    {
      type: 'button',
      key: 'submit',
      label: 'Volgende vraag',
      input: false,
    },
  ],
})

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export default async () => {
  const data = await getStaticFormByFormType({ formType: 'primary' }).then((response) => addSubmitButton(response))

  return <Home formData={data} />
}
