'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { patchMeldingByMeldingIdNoteByNoteId } from '~/app/_api-client/proxy'
import { parseNoteDocument } from '~/app/_utils/parseNoteDocument'
import { MAX_NOTE_LENGTH } from '~/constants'

type Args = {
  meldingId: number
  noteId: number
}

export const postUpdateNoteForm = async ({ meldingId, noteId }: Args, _: unknown, formData: FormData) => {
  const t = await getTranslations('update-note')

  const formDataObj = Object.fromEntries(formData)

  const { characterCount, isEmpty, markdown } = parseNoteDocument(formDataObj.updateNote)

  // Replace the submitted JSON with the derived markdown, so RichTextEditor can reload it as
  // its `defaultValue` (via contentType: 'markdown') if the form is redisplayed after an error.
  formData.set('updateNote', markdown)

  if (characterCount > MAX_NOTE_LENGTH) {
    return {
      formData,
      validationErrors: [{ key: 'updateNote', message: t('errors.maxLength', { max: MAX_NOTE_LENGTH }) }],
    }
  }

  const { error } = await patchMeldingByMeldingIdNoteByNoteId({
    body: { text: isEmpty ? '' : markdown },
    path: { melding_id: meldingId, note_id: noteId },
  })

  if (error) return { apiError: error, formData }

  return redirect(`/melding/${meldingId}/notities`)
}
