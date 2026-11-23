import type { NoteOutput } from '@meldingen/api-client'

import { truncateMarkdown } from '~/app/_utils/parseNoteDocument'
import { MAX_VISUAL_QUOTE_LENGTH } from '~/constants'

export type ParentNote = {
  // Only available when the parent note is part of the given notes.
  createdAt?: string
  email?: string
  // Plain text of the snapshot the backend stored when the reply was made. It is truncated by the
  // backend, so it is not rendered as markdown: a cut-off snippet could contain broken formatting.
  text: string
}

export type NoteWithParentNote = NoteOutput & { parentNote?: ParentNote }

// The notes endpoint returns all notes of a melding and replies always belong to the same melding
// as their parent, so parent data can be looked up locally instead of fetched per note.
export const addParentNotes = (notes: NoteOutput[]): NoteWithParentNote[] => {
  const notesById = new Map(notes.map((note) => [note.id, note]))

  return notes.map((note) => {
    const { parent_note_id, parent_note_text_snapshot } = note

    if (parent_note_id == null || parent_note_text_snapshot == null) return note

    const parent = notesById.get(parent_note_id)

    return {
      ...note,
      parentNote: {
        createdAt: parent?.created_at,
        email: parent?.user.email,
        text: truncateMarkdown(parent_note_text_snapshot, MAX_VISUAL_QUOTE_LENGTH),
      },
    }
  })
}
