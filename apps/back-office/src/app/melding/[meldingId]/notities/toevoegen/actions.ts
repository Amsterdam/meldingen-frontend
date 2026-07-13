'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdNote } from '~/app/_api-client/proxy'
import { parseNoteDocument } from '~/app/_utils/parseNoteDocument'
import { MAX_NOTE_LENGTH } from '~/constants'

export const postAddNoteForm = async ({ meldingId }: { meldingId: number }, _: unknown, formData: FormData) => {
  const t = await getTranslations('add-note')

  const formDataObj = Object.fromEntries(formData)

  const { characterCount, isEmpty, markdown } = parseNoteDocument(formDataObj.addNote)

  // Replace the submitted JSON with the derived markdown, so RichTextEditor can reload it as
  // its `defaultValue` (via contentType: 'markdown') if the form is redisplayed after an error.
  formData.set('addNote', markdown)

  if (isEmpty) {
    return {
      formData,
      validationErrors: [{ key: 'addNote', message: t('errors.required') }],
    }
  }

  if (characterCount > MAX_NOTE_LENGTH) {
    return {
      formData,
      validationErrors: [{ key: 'addNote', message: t('errors.maxLength', { max: MAX_NOTE_LENGTH }) }],
    }
  }

  const { error } = await postMeldingByMeldingIdNote({
    body: { text: markdown },
    path: { melding_id: meldingId },
  })

  if (error) return { formData, systemError: error }

  return redirect(`/melding/${meldingId}`)
}
