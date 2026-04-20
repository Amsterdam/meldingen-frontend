import { getTranslations } from 'next-intl/server'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

// These API client functions are not authenticated, so we do not have to import them from the API client proxy.
import { getStaticForm, getStaticFormByStaticFormId } from '@meldingen/api-client'

import { MeldingForm } from './MeldingForm'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export const generateMetadata = async () => {
  const t = await getTranslations('melding-form')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
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

  return <MeldingForm primaryTextArea={primaryTextArea} />
}
