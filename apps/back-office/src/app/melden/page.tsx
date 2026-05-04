import { getTranslations } from 'next-intl/server'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { postMeldingForm } from './actions'
import { MeldingForm } from './MeldingForm'
import { getMeldingByMeldingId, getStaticForm, getStaticFormByStaticFormId } from '~/apiClientProxy'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export const generateMetadata = async () => {
  const t = await getTranslations('melding-form')

  return {
    title: t('metadata.title'),
  }
}

export default async ({ searchParams }: { searchParams: Promise<{ id?: string; token?: string }> }) => {
  const t = await getTranslations('melding-form.errors')

  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')

  const primaryFormId = staticFormsData.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) throw new Error('Primary form id not found.')

  const { data: primaryForm, error } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (error) throw new Error('Failed to fetch primary form data.')

  const primaryTextArea = primaryForm.components.find(
    (component): component is StaticFormTextAreaComponentOutput => component.type === 'textarea',
  )

  if (!primaryTextArea) throw new Error('Primary form textarea not found.')

  const requiredErrorMessage = primaryTextArea.validate?.required_error_message || t('required-error-message-fallback')

  const { id, token } = await searchParams

  const action = postMeldingForm.bind(null, { existingId: id, existingToken: token, requiredErrorMessage })

  // Prefill form
  const isExistingMelding = id && token

  const { data: meldingData, error: meldingError } = await getMeldingByMeldingId({ path: { melding_id: id } })

  if (meldingError) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(meldingError)
  }

  const defaultValues = isExistingMelding
    ? {
        primary: meldingData?.text ?? '',
        urgency: meldingData?.urgency ?? 0,
      }
    : {}

  return <MeldingForm action={action} defaultValues={defaultValues} primaryTextArea={primaryTextArea} />
}
