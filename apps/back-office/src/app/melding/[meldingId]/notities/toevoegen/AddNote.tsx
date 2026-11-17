'use client'

import { NoteForm } from '../_components/NoteForm/NoteForm'
import { postAddNoteForm } from './actions'

export const AddNote = ({ meldingId }: { meldingId: number }) => (
  <NoteForm
    action={postAddNoteForm.bind(null, { meldingId })}
    fieldName="addNote"
    meldingId={meldingId}
    required
    translationNamespace="add-note"
  />
)
