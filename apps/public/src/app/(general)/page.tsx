import { getStaticForm } from '@meldingen/api-client'

import { Home } from './Home'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export default async () => {
  const staticForm = await getStaticForm().then((response) => response.find((form) => form.type === 'primary'))

  if (!staticForm) return undefined

  return <Home formData={staticForm.components} />
}
