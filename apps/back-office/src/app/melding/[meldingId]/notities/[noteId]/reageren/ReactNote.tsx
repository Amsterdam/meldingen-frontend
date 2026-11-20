'use client'

import type { NoteOutput } from '@meldingen/api-client'

import { Note } from '../../_components/Note/Note'
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
    required
    translationNamespace="react-note"
  >
    <div className="ams-mb-m">
      <Note note={note} />
    </div>
  </NoteForm>
)
