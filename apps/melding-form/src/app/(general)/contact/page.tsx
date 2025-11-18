import { cookies } from 'next/headers'

import { getMeldingByMeldingIdMelder, getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

import { Contact } from './Contact'
import { COOKIES } from 'apps/melding-form/src/constants'
import { isTypeTextAreaComponent } from 'apps/melding-form/src/typeguards'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export default async () => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')

  const contactFormId = staticFormsData.find((form) => form.type === 'contact')?.id

  if (!contactFormId) throw new Error('Contact form id not found.')

  const { data: contactForm, error } = await getStaticFormByStaticFormId({ path: { static_form_id: contactFormId } })

  if (error) throw new Error('Failed to fetch contact form data.')

  // A contact form is always an array of two text area components, but TypeScript doesn't know that
  // We use a type guard here to make sure we're always working with the right type
  const contactFormComponents = contactForm.components.filter(isTypeTextAreaComponent)

  if (!contactFormComponents[0].label || !contactFormComponents[1].label)
    throw new Error('Contact form labels not found.')

  // Check if answers already exist and prefill if so
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our proxy, so non-null assertion is safe here.
  const meldingId = cookieStore.get(COOKIES.ID)!.value
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const { data, error: meldingError } = await getMeldingByMeldingIdMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (meldingError) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(meldingError)
  }

  const { email, phone } = data || {}

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
