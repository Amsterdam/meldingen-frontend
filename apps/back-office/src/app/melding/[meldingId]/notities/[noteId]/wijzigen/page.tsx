import { UpdateNote } from './UpdateNote'
import { getMeldingByMeldingIdNoteByNoteId } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/notities/[noteId]/wijzigen'>, 'params'>

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams, noteId: noteIdParams } = await params
  const meldingId = Number(meldingIdParams)
  const noteId = Number(noteIdParams)

  const { data, error } = await getMeldingByMeldingIdNoteByNoteId({ path: { melding_id: meldingId, note_id: noteId } })

  if (error) throw new Error('Failed to fetch note.')

  return <UpdateNote meldingId={meldingId} note={data} />
}
