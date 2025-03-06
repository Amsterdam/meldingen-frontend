import type { Metadata } from 'next'

import type { StaticFormOutput, StaticFormTextAreaComponentOutput } from 'apps/public/src/apiClientProxy'
import { getStaticForm, getStaticFormByStaticFormId } from 'apps/public/src/apiClientProxy'

import { Contact } from './Contact'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Stap 3 van 4 - Gegevens - Gemeente Amsterdam',
}

const isTextArea = (
  component: StaticFormOutput['components'][number],
): component is StaticFormTextAreaComponentOutput => component.type === 'textarea'

export default async () => {
  let contactForm

  try {
    const contactFormId = await getStaticForm().then((response) => response.find((form) => form.type === 'contact')?.id)

    if (!contactFormId) throw new Error('Contact form id not found')

    contactForm = (await getStaticFormByStaticFormId({ staticFormId: contactFormId })).components.filter(isTextArea)
  } catch (error) {
    throw new Error((error as Error).message)
  }

  return <Contact formData={contactForm} />
}
