import { getTranslations } from 'next-intl/server'

import { NotesOverview } from './NotesOverview'
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

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (error) throw new Error('Failed to fetch melding data.')

  const { data: notes, error: notesError } = await getMeldingByMeldingIdNote({ path: { melding_id: meldingId } })

  if (notesError) throw new Error('Failed to fetch notes data.')

  return <NotesOverview meldingId={meldingId} notes={notes} publicId={data.public_id} />
}
