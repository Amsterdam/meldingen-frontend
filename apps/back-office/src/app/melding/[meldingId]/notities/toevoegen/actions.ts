'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdNote } from '~/app/_api-client/proxy'
import { MAX_NOTE_LENGTH } from '~/constants'

export const postAddNoteForm = async ({ meldingId }: { meldingId: number }, _: unknown, formData: FormData) => {
  const t = await getTranslations('add-note')

  const formDataObj = Object.fromEntries(formData)

  // TODO: this check doesn't work well anymore, seeing as markdown can generate a lot of characters.
  // We should probably check the length of the text after stripping out markdown formatting.
  if (!formDataObj.addNote) {
    return {
      formData,
      validationErrors: [{ key: 'addNote', message: t('errors.required') }],
    }
  }

  if (formDataObj.addNote.toString().length > MAX_NOTE_LENGTH) {
    return {
      formData,
      validationErrors: [{ key: 'addNote', message: t('errors.maxLength', { max: MAX_NOTE_LENGTH }) }],
    }
  }

  const { error } = await postMeldingByMeldingIdNote({
    body: { text: formDataObj.addNote.toString() },
    path: { melding_id: meldingId },
  })

  if (error) return { formData, systemError: error }

  return redirect(`/melding/${meldingId}`)
}
