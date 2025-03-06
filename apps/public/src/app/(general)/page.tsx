import type { Metadata } from 'next'

import type { StaticFormTextAreaComponentOutput, StaticFormOutput } from 'apps/public/src/apiClientProxy'
import { getStaticForm, getStaticFormByStaticFormId } from 'apps/public/src/apiClientProxy'

import { Home } from './Home'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Stap 1 van 4 - Beschrijf uw melding - Gemeente Amsterdam',
}

const isTextArea = (
  component: StaticFormOutput['components'][number],
): component is StaticFormTextAreaComponentOutput => component.type === 'textarea'

export default async () => {
  let primaryForm

  try {
    const primaryFormId = await getStaticForm().then((response) => response.find((form) => form.type === 'primary')?.id)

    if (!primaryFormId) throw new Error('Primary form id not found')

    primaryForm = (await getStaticFormByStaticFormId({ staticFormId: primaryFormId })).components.filter(isTextArea)
  } catch (error) {
    return (error as Error).message
  }

  return <Home formData={primaryForm} />
}
