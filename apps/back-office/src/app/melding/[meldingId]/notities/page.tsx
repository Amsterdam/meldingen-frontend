import { getTranslations } from 'next-intl/server'

import { NotesOverview } from './NotesOverview'
import { getMeldingByMeldingId, getMeldingByMeldingIdNote, getUserMe } from '~/app/_api-client/proxy'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations('notes-overview')

  const { data } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  return {
    title: t('metadata.title', { publicId: data?.public_id ?? '' }),
  }
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const [{ data, error }, { data: notes, error: notesError }, { data: currentUser, error: currentUserError }] =
    await Promise.all([
      getMeldingByMeldingId({ path: { melding_id: meldingId } }),
      getMeldingByMeldingIdNote({
        path: { melding_id: meldingId },
        query: { sort: '["created_at","DESC"]' },
      }),
      getUserMe(),
    ])

  if (error) throw new Error('Failed to fetch melding data.')
  if (notesError) throw new Error('Failed to fetch notes data.')
  if (currentUserError) throw new Error('Failed to fetch current user data.')

  return <NotesOverview currentUserId={currentUser.id} meldingId={meldingId} notes={notes} publicId={data.public_id} />
}
