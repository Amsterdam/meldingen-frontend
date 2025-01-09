import { getStaticForm, getStaticFormByStaticFormId } from 'apps/public/src/apiClientProxy'

import { Home } from './Home'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export default async () => {
  const primaryFormId = await getStaticForm().then((response) => response.find((form) => form.type === 'primary')?.id)

  if (!primaryFormId) return undefined

  const primaryForm = (await getStaticFormByStaticFormId({ staticFormId: primaryFormId }))?.components

  return <Home formData={primaryForm} />
}
