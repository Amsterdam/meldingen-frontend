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
      type: 'button',
      key: 'submit',
      label: 'Volgende vraag',
      input: false,
    },
  ],
})

// TODO: Force dynamic rendering for now, because the api doesn't exist yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export default async () => {
  const data = await getStaticFormByFormType({ formType: 'primary' }).then((response) => addSubmitButton(response))

  return <Home formData={data} />
}
