import { getTranslations } from 'next-intl/server'

import { NotesOverview } from './NotesOverview'
import { getClassification, getMeldingByMeldingId, getMeldingByMeldingIdNote, getUserMe } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/notities'>, 'params'>

export const generateMetadata = async ({ params }: Props) => {
  const { meldingId: meldingIdParam } = await params
  const meldingId = Number(meldingIdParam)

  const t = await getTranslations('notes-overview')
  const { data } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  return {
    title: t('metadata.title', { publicId: data?.public_id ?? '' }),
  }
}

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParam } = await params
  const meldingId = Number(meldingIdParam)

  const [meldingResultData, notesResult, currentUserResult, classificationsResult] = await Promise.all([
    getMeldingByMeldingId({ path: { melding_id: meldingId } }),
    getMeldingByMeldingIdNote({
      path: { melding_id: meldingId },
      query: { sort: '["created_at","DESC"]' },
    }),
    getUserMe(),
    getClassification({ query: { include_deleted: true, limit: 0 } }),
  ])

  if (meldingResultData.error) throw new Error('Failed to fetch melding data.')
  if (notesResult.error) throw new Error('Failed to fetch notes data.')
  if (currentUserResult.error) throw new Error('Failed to fetch current user data.')
  if (classificationsResult.error) throw new Error('Failed to fetch classifications data.')

  const { data: notes } = notesResult
  const { data: currentUser } = currentUserResult
  const { data: classifications } = classificationsResult

  return (
    <NotesOverview
      classifications={classifications}
      currentUserId={currentUser.id}
      meldingId={meldingId}
      notes={notes}
      publicId={meldingResultData.data.public_id}
    />
  )
}
