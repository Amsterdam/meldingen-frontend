'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { processNoteForm } from '../../_utils/processNoteForm'
import { postMeldingByMeldingIdNote } from '~/app/_api-client/proxy'
import { MAX_NOTE_LENGTH } from '~/constants'

type Args = {
  meldingId: number
  parentNoteId: number
}

export const postReactNoteForm = async ({ meldingId, parentNoteId }: Args, _: unknown, formData: FormData) => {
  const t = await getTranslations('react-note')

  const note = processNoteForm(formData, 'reactNote', { required: true })

  if (!note.isValid) {
    return {
      formData,
      validationErrors: [
        {
          key: 'reactNote',
          message: note.error === 'required' ? t('errors.required') : t('errors.maxLength', { max: MAX_NOTE_LENGTH }),
        },
      ],
    }
  }

  const { error } = await postMeldingByMeldingIdNote({
    body: { parent_note_id: parentNoteId, text: note.markdown },
    path: { melding_id: meldingId },
  })

  if (error) return { apiError: error, formData }

  return redirect(`/melding/${meldingId}/notities`)
}
