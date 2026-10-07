import { getTranslations } from 'next-intl/server'

import {
  getAdditionalQuestionsData,
  getAssetsData,
  getAttachmentsData,
  getContactData,
  getLocationData,
  getMeldingData,
} from './_utils/server'
import { Detail } from './Detail'
import { getMeldingByMeldingId, getMeldingByMeldingIdNote } from '~/app/_api-client/proxy'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations('detail')

  const { data } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  return {
    title: t('metadata.title', { publicId: data?.public_id ?? '' }),
  }
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations()

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (error) throw new Error(t('detail.errors.melding-not-found'))

  const additionalQuestions = await getAdditionalQuestionsData(meldingId)

  if ('error' in additionalQuestions) throw new Error(additionalQuestions.error)

  const additionalQuestionsWithMeldingText = [
    {
      description: data.text,
      key: 'text',
      term: t('detail.melding-text'),
    },
    ...additionalQuestions.data,
  ]

  const attachments = await getAttachmentsData(meldingId, 'thumbnail')
  const contact = getContactData(data, t)
  const location = getLocationData(data, t)
  const meldingData = getMeldingData(data, t)
  const { assets, assetsTerm } = await getAssetsData(data, meldingId)

  const { data: notes, error: notesError } = await getMeldingByMeldingIdNote({
    path: { melding_id: meldingId },
    query: { sort: '["created_at","DESC"]' },
  })

  if (notesError) {
    // TODO: Handle the error appropriately, e.g., show a user-friendly message or retry fetching notes.
    // No impact on the main detail view, so we just log the error for now.
    // eslint-disable-next-line no-console
    console.error(notesError)
  }

  return (
    <Detail
      additionalQuestionsWithMeldingText={additionalQuestionsWithMeldingText}
      assets={assets}
      assetsTerm={assetsTerm}
      attachments={attachments}
      contact={contact}
      location={location}
      meldingData={meldingData}
      meldingId={meldingId}
      notesCount={notes?.length}
      publicId={data.public_id}
    />
  )
}
