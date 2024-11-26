import type { StaticFormOutput } from '@meldingen/api-client'
import { getStaticForm } from '@meldingen/api-client'
import type { ComponentSchema } from 'formiojs'

import { Home } from './Home'

export type StaticFormWithSubmit = Omit<StaticFormOutput, 'components'> & { components: ComponentSchema[] }

const addSubmitButton = (form: any): StaticFormWithSubmit => ({
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

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export default async () => {
  const staticForm = await getStaticForm().then((response) => response.find((form) => form.type === 'primary'))

  const staticFormWithSubmitButton = addSubmitButton(staticForm)

  return <Home formData={staticFormWithSubmitButton} />
}
