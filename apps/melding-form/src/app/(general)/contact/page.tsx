import { cookies } from 'next/headers'

import { getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

import { Contact } from './Contact'
import { getMeldingData } from '../_utils/getMeldingData'
import { SESSION_COOKIES } from 'apps/melding-form/src/constants'
import { isTypeTextAreaComponent } from 'apps/melding-form/src/typeguards'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export default async () => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')

  const contactFormId = staticFormsData?.find((form) => form.type === 'contact')?.id

  if (!contactFormId) throw new Error('Contact form id not found.')

  const { data: contactForm, error } = await getStaticFormByStaticFormId({ path: { static_form_id: contactFormId } })

  if (error) throw new Error('Failed to fetch contact form data.')
  if (!contactForm) throw new Error('Contact form data not found.')

  // A contact form is always an array of two text area components, but TypeScript doesn't know that
  // We use a type guard here to make sure we're always working with the right type
  const contactFormComponents = contactForm.components.filter(isTypeTextAreaComponent)

  if (!contactFormComponents[0].label || !contactFormComponents[1].label)
    throw new Error('Contact form labels not found.')

  // Check if answers already exist and prefill if so
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our middleware, so non-null assertion is safe here.
  const meldingId = cookieStore.get(SESSION_COOKIES.ID)!.value
  const token = cookieStore.get(SESSION_COOKIES.TOKEN)!.value

  const { phone, email } = await getMeldingData(meldingId, token)

  const formComponents = contactFormComponents.map((component) => {
    if (component.key === 'tel-input' && phone) {
      return { ...component, defaultValue: phone }
    }
    if (component.key === 'email-input' && email) {
      return { ...component, defaultValue: email }
    }
    return component
  })

  return <Contact formComponents={formComponents} />
}
