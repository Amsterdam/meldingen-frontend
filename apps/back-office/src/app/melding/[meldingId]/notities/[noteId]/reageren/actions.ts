'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdNote } from '~/app/_api-client/proxy'
import { parseNoteDocument } from '~/app/_utils/parseNoteDocument'
import { MAX_NOTE_LENGTH } from '~/constants'

type Args = {
  meldingId: number
  parentNoteId: number
}

export const postReactNoteForm = async ({ meldingId, parentNoteId }: Args, _: unknown, formData: FormData) => {
  const t = await getTranslations('react-note')

  const formDataObj = Object.fromEntries(formData)

  const { characterCount, isEmpty, markdown } = parseNoteDocument(formDataObj.reactNote)

  // Replace the submitted JSON with the derived markdown, so RichTextEditor can reload it as
  // its `defaultValue` (via contentType: 'markdown') if the form is redisplayed after an error.
  formData.set('reactNote', markdown)

  if (isEmpty) {
    return {
      formData,
      validationErrors: [{ key: 'reactNote', message: t('errors.required') }],
    }
  }

  if (characterCount > MAX_NOTE_LENGTH) {
    return {
      formData,
      validationErrors: [{ key: 'reactNote', message: t('errors.maxLength', { max: MAX_NOTE_LENGTH }) }],
    }
  }

  const { error } = await postMeldingByMeldingIdNote({
    body: { parent_note_id: parentNoteId, text: markdown },
    path: { melding_id: meldingId },
  })

  if (error) return { apiError: error, formData }

  return redirect(`/melding/${meldingId}/notities`)
}
