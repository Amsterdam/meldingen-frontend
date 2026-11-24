import { getTranslations } from 'next-intl/server'
import { notFound, redirect } from 'next/navigation'

import { ReactNote } from './ReactNote'
import { getMeldingByMeldingIdNoteByNoteId, getUserMe } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/notities/[noteId]/reageren'>, 'params'>

export const generateMetadata = async () => {
  const t = await getTranslations('react-note')

  return { title: t('metadata.title') }
}

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams, noteId: noteIdParams } = await params
  const meldingId = Number(meldingIdParams)
  const noteId = Number(noteIdParams)

  const [noteResult, currentUserResult] = await Promise.all([
    getMeldingByMeldingIdNoteByNoteId({ path: { melding_id: meldingId, note_id: noteId } }),
    getUserMe(),
  ])

  if (noteResult.response?.status === 404) notFound()
  if (noteResult.error) throw new Error('Failed to fetch note.')
  if (currentUserResult.error) throw new Error('Failed to fetch current user data.')

  const { data: note } = noteResult

  // Users can only reply to notes of others; their own notes can be edited instead.
  if (note.user.id === currentUserResult.data.id) {
    return redirect(`/melding/${meldingId}/notities/${noteId}/wijzigen`)
  }

  // Deleted notes (empty text) can not be replied to.
  if (note.text === '') {
    return redirect(`/melding/${meldingId}/notities`)
  }

  return <ReactNote meldingId={meldingId} note={note} />
}
