'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { processNoteForm } from '../../_utils/processNoteForm'
import { patchMeldingByMeldingIdNoteByNoteId } from '~/app/_api-client/proxy'
import { MAX_NOTE_LENGTH } from '~/constants'

type Args = {
  meldingId: number
  noteId: number
}

export const postUpdateNoteForm = async ({ meldingId, noteId }: Args, _: unknown, formData: FormData) => {
  const t = await getTranslations('update-note')

  const note = processNoteForm(formData, 'updateNote', { required: false })

  if (!note.isValid) {
    return {
      formData,
      validationErrors: [
        {
          key: 'updateNote',
          message: t('errors.maxLength', { max: MAX_NOTE_LENGTH }),
        },
      ],
    }
  }

  const { error } = await patchMeldingByMeldingIdNoteByNoteId({
    body: { text: note.isEmpty ? '' : note.markdown },
    path: { melding_id: meldingId, note_id: noteId },
  })

  if (error) return { apiError: error, formData }

  return redirect(`/melding/${meldingId}/notities`)
}
