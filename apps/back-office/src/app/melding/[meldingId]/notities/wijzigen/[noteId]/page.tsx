import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'

import { UpdateNote } from './UpdateNote'
import { getMeldingByMeldingIdNoteByNoteId } from '~/app/_api-client/proxy'

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('update-note')

  return {
    title: t('metadata.title'),
  }
}

type Params = { params: Promise<{ meldingId: number; noteId: number }> }

export default async ({ params }: Params) => {
  const { meldingId, noteId } = await params

  const { data, error } = await getMeldingByMeldingIdNoteByNoteId({ path: { melding_id: meldingId, note_id: noteId } })

  if (error) throw new Error('Failed to fetch note.')

  return <UpdateNote meldingId={meldingId} note={data} noteId={noteId} />
}
