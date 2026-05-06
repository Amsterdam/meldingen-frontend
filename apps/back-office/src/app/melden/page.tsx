import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { MeldingForm } from './MeldingForm'
import { getMeldingByMeldingId, getStaticForm, getStaticFormByStaticFormId } from '~/apiClientProxy'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('melding-form')

  return {
    title: t('metadata.title'),
  }
}

export default async ({ searchParams }: { searchParams: Promise<{ id?: number; token?: string }> }) => {
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

  const { id, token } = await searchParams

  // Prefill form
  const result = id && token ? await getMeldingByMeldingId({ path: { melding_id: Number(id) } }) : undefined

  if (result?.error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(result.error)
  }

  const defaultValues = result?.data
    ? {
        primary: result.data.text,
        urgency: result.data.urgency,
      }
    : {}

  const defaultPrefetchedMelding =
    token && result?.data?.id
      ? {
          classificationId: result.data.classification?.id,
          classificationName: result.data.classification?.name,
          createdAt: result.data.created_at,
          id: result.data.id,
          publicId: result.data.public_id,
          token: token,
        }
      : undefined

  return (
    <MeldingForm
      defaultPrefetchedMelding={defaultPrefetchedMelding}
      defaultValues={defaultValues}
      existingId={id}
      existingToken={token}
      primaryTextArea={primaryTextArea}
    />
  )
}
