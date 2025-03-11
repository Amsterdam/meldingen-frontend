import { getTranslations } from 'next-intl/server'

import type { StaticFormOutput, StaticFormTextAreaComponentOutput } from 'apps/public/src/apiClientProxy'
import { getStaticForm, getStaticFormByStaticFormId } from 'apps/public/src/apiClientProxy'

import { Contact } from './Contact'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export const generateMetadata = async () => {
  const t = await getTranslations('contact')

  return {
    title: t('metadata.title'),
  }
}

const isTextArea = (
  component: StaticFormOutput['components'][number],
): component is StaticFormTextAreaComponentOutput => component.type === 'textarea'

export default async () => {
  const t = await getTranslations('contact')

  try {
    const contactFormId = await getStaticForm().then((response) => response.find((form) => form.type === 'contact')?.id)

    if (!contactFormId) throw new Error(t('errors.form-id-not-found'))

    const contactForm = (await getStaticFormByStaticFormId({ staticFormId: contactFormId })).components
    // A contact form is always an array of two text area components, but TypeScript doesn't know that
    // We use a type guard here to make sure we're always working with the right type
    const filteredContactForm = contactForm.filter(isTextArea)

    if (!filteredContactForm[0].label || !filteredContactForm[1].label)
      throw new Error(t('errors.form-labels-not-found'))
    return <Contact formData={filteredContactForm} />
  } catch (error) {
    return (error as Error).message
  }
}
