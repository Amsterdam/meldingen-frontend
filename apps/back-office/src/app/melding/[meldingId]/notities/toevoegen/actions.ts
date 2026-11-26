'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { processNoteForm } from '../_utils/processNoteForm'
import { postMeldingByMeldingIdNote } from '~/app/_api-client/proxy'
import { MAX_NOTE_LENGTH } from '~/constants'

export const postAddNoteForm = async ({ meldingId }: { meldingId: number }, _: unknown, formData: FormData) => {
  const t = await getTranslations('add-note')

  const note = processNoteForm(formData, 'addNote', { required: true })

  if (!note.isValid) {
    return {
      formData,
      validationErrors: [
        {
          key: 'addNote',
          message: note.error === 'required' ? t('errors.required') : t('errors.maxLength', { max: MAX_NOTE_LENGTH }),
        },
      ],
    }
  }

  const { error } = await postMeldingByMeldingIdNote({
    body: { text: note.markdown },
    path: { melding_id: meldingId },
  })

  if (error) return { apiError: error, formData }

  return redirect(`/melding/${meldingId}/notities`)
}
