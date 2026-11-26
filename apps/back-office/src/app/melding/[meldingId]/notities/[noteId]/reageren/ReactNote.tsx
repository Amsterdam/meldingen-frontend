'use client'

import type { NoteOutput } from '@meldingen/api-client'

import { NoteForm } from '../../_components/NoteForm/NoteForm'
import { postReactNoteForm } from './actions'

type Props = {
  meldingId: number
  note: NoteOutput
}

export const ReactNote = ({ meldingId, note }: Props) => (
  <NoteForm
    action={postReactNoteForm.bind(null, { meldingId, parentNoteId: note.id })}
    fieldName="reactNote"
    meldingId={meldingId}
    parentNote={note}
    required
    translationNamespace="react-note"
  />
)
