import { getTranslations } from 'next-intl/server'

import { getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

import { Contact } from './Contact'
import { isTypeTextAreaComponent } from 'apps/melding-form/src/typeguards'

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
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')

  const contactFormId = staticFormsData?.find((form) => form.type === 'contact')?.id

  if (!contactFormId) throw new Error('Contact form id not found.')

  const { data, error } = await getStaticFormByStaticFormId({ path: { static_form_id: contactFormId } })

  if (error) throw new Error('Failed to fetch contact form data.')
  if (!data) throw new Error('Contact form data not found.')

  const contactForm = data.components

  // A contact form is always an array of two text area components, but TypeScript doesn't know that
  // We use a type guard here to make sure we're always working with the right type
  const filteredContactForm = contactForm.filter(isTypeTextAreaComponent)

  if (!filteredContactForm[0].label || !filteredContactForm[1].label) throw new Error('Contact form labels not found.')

  return <Contact formComponents={filteredContactForm} />
}
