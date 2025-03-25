import { getTranslations } from 'next-intl/server'

import { getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

import { Contact } from './Contact'
import { handleApiError } from 'apps/public/src/handleApiError'
import { isTypeTextAreaComponent } from 'apps/public/src/typeguards'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export const generateMetadata = async () => {
  const t = await getTranslations('contact')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const t = await getTranslations('contact')

  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) return handleApiError(staticFormsError)

  const contactFormId = staticFormsData?.find((form) => form.type === 'contact')?.id

  if (!contactFormId) return t('errors.form-id-not-found')

  const { data, error } = await getStaticFormByStaticFormId({ path: { static_form_id: contactFormId } })

  if (error) return handleApiError(error)

  if (!data) return 'Contact form data not found'

  const contactForm = data.components

  // A contact form is always an array of two text area components, but TypeScript doesn't know that
  // We use a type guard here to make sure we're always working with the right type
  const filteredContactForm = contactForm?.filter(isTypeTextAreaComponent)

  if (!filteredContactForm || !filteredContactForm[0].label || !filteredContactForm[1].label)
    return t('errors.form-labels-not-found')

  return <Contact formData={filteredContactForm} />
}
