'use client'

import type { NoteOutput } from '@meldingen/api-client'

import { NoteForm } from '../../_components/NoteForm/NoteForm'
import { postUpdateNoteForm } from './actions'

type Props = {
  meldingId: number
  note: NoteOutput
}

export const UpdateNote = ({ meldingId, note }: Props) => (
  <NoteForm
    action={postUpdateNoteForm.bind(null, { meldingId, noteId: note.id })}
    defaultValue={note.text}
    fieldName="updateNote"
    meldingId={meldingId}
    translationNamespace="update-note"
  />
)
