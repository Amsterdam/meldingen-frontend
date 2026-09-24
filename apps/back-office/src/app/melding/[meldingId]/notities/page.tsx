import { getTranslations } from 'next-intl/server'
import { cache } from 'react'

import { NotesOverview } from './NotesOverview'
import { getClassification, getMeldingByMeldingId, getMeldingByMeldingIdNote, getUserMe } from '~/app/_api-client/proxy'

const getMeldingData = cache(async (meldingId: number) => {
  const meldingResult = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (meldingResult.error || !meldingResult.data) {
    throw new Error('Failed to fetch melding data.')
  }

  return meldingResult.data
})

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations('notes-overview')
  const data = await getMeldingData(meldingId)

  return {
    title: t('metadata.title', { publicId: data.public_id }),
  }
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const [meldingResultData, notesResult, currentUserResult, classificationsResult] = await Promise.all([
    getMeldingData(meldingId),
    getMeldingByMeldingIdNote({
      path: { melding_id: meldingId },
      query: { sort: '["created_at","DESC"]' },
    }),
    getUserMe(),
    getClassification({ query: { include_deleted: true } }),
  ])

  if (notesResult.error || !notesResult.data) throw new Error('Failed to fetch notes data.')
  if (currentUserResult.error || !currentUserResult.data) throw new Error('Failed to fetch current user data.')
  if (classificationsResult.error || !classificationsResult.data)
    throw new Error('Failed to fetch classifications data.')

  const { data: notes } = notesResult
  const { data: currentUser } = currentUserResult
  const { data: classifications } = classificationsResult

  return (
    <NotesOverview
      classifications={classifications}
      currentUserId={currentUser.id}
      meldingId={meldingId}
      notes={notes}
      publicId={meldingResultData.public_id}
    />
  )
}
