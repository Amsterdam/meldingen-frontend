import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'

import type { MeldingOutput, NoteRetrieveOutput, StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { MeldingForm } from './MeldingForm'
import {
  getLabel,
  getMeldingByMeldingId,
  getMeldingByMeldingIdNote,
  getSource,
  getStaticForm,
  getStaticFormByStaticFormId,
} from '~/app/_api-client/proxy'

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this when the api is deployed.
export const dynamic = 'force-dynamic'

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('melding-form')

  return {
    title: t('metadata.title'),
  }
}

const fetchPrimaryTextArea = async () => {
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

  return primaryTextArea
}

const fetchSourcesAndLabels = async () => {
  const [{ data: sources, error: sourcesError }, { data: labels, error: labelsError }] = await Promise.all([
    getSource(),
    getLabel(),
  ])

  if (sourcesError) throw new Error('Failed to fetch sources.')
  if (sources.length === 0) throw new Error('No sources found.')

  if (labelsError) throw new Error('Failed to fetch labels.')
  if (labels.length === 0) throw new Error('No labels found.')

  return { labels, sources }
}

const fetchExistingMelding = async (id: number) => {
  const { data: existingMelding, error } = await getMeldingByMeldingId({ path: { melding_id: id } })

  if (error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }

  return existingMelding
}

const fetchNote = async (id: number) => {
  const { data: notes, error: notesError } = await getMeldingByMeldingIdNote({ path: { melding_id: id } })

  if (notesError) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(notesError)
  }

  return notes?.[0]
}

const toDefaultValues = (melding?: MeldingOutput, note?: NoteRetrieveOutput) => {
  if (!melding) return {}

  return {
    labels: melding.labels?.map((label) => label.id) ?? [],
    note: note?.text,
    primary: melding.text,
    source: melding.source?.id ? String(melding.source.id) : undefined,
    urgency: melding.urgency,
  }
}

const toExistingMeldingData = (melding?: MeldingOutput, token?: string) => {
  if (!melding?.id || !token) return undefined

  const { classification, created_at, id, public_id } = melding

  return {
    classificationId: classification?.id,
    classificationName: classification?.name,
    createdAt: created_at,
    id,
    publicId: public_id,
    token,
  }
}

export default async ({ searchParams }: { searchParams: Promise<{ id?: number; token?: string }> }) => {
  const { id, token } = await searchParams

  const [primaryTextArea, { labels, sources }, existingMelding, note] = await Promise.all([
    fetchPrimaryTextArea(),
    fetchSourcesAndLabels(),
    id && token ? fetchExistingMelding(id) : Promise.resolve(undefined),
    id && token ? fetchNote(id) : Promise.resolve(undefined),
  ])

  const defaultValues = toDefaultValues(existingMelding, note)
  const existingMeldingData = toExistingMeldingData(existingMelding, token)

  return (
    <MeldingForm
      defaultValues={defaultValues}
      existingId={id}
      existingMelding={existingMeldingData}
      existingNoteId={note?.id}
      existingToken={token}
      labels={labels}
      primaryTextArea={primaryTextArea}
      sources={sources}
    />
  )
}
