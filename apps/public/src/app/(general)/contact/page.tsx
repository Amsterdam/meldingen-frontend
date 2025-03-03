import type { Metadata } from 'next'

import type { StaticFormTextAreaComponentOutput } from 'apps/public/src/apiClientProxy'
import { getStaticForm, getStaticFormByStaticFormId } from 'apps/public/src/apiClientProxy'

import { Contact } from './Contact'

export const metadata: Metadata = {
  title: 'Stap 3 van 4 - Gegevens - Gemeente Amsterdam',
}

export default async () => {
  const contactFormId = await getStaticForm().then((response) => response.find((form) => form.type === 'contact')?.id)

  if (!contactFormId) return undefined

  const contactForm = (await getStaticFormByStaticFormId({ staticFormId: contactFormId }))?.components

  const textareaComponents =
    contactForm?.filter((component): component is StaticFormTextAreaComponentOutput => component.type === 'textarea') ||
    []

  return <Contact formData={textareaComponents} />
}
