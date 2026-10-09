'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import type { MeldingOutput } from '@meldingen/api-client'

import { getApiErrorMessage, hasValidationErrors } from '@meldingen/api-client'
import { safeJSONParse } from '@meldingen/utils'

import type { MeldingData } from './types'
import type { FormState } from '~/types'

import { parseNoteDocument } from '../_utils/parseNoteDocument'
import {
  patchMeldingByMeldingId,
  patchMeldingByMeldingIdMelder,
  patchMeldingByMeldingIdNoteByNoteId,
  postMelding,
  postMeldingByMeldingIdNote,
} from '~/app/_api-client/proxy'
import { MAX_NOTE_LENGTH, URGENCY_VALUES } from '~/constants'
import { getClientEnv } from '~/env/client'

export type ArgsType = {
  existingId?: number
  existingNoteId?: number
  existingToken?: string
  requiredErrorMessage: string
}

// Represents the shape of the form data submitted by the user
type UserFormData = {
  addNote: string
  classificationId: string
  classificationQuery: string
  prefetchedMelding?: string
  primary: string
  source: string
  urgency: string
}

const isValidUrgency = (value: number): value is MeldingOutput['urgency'] =>
  URGENCY_VALUES.includes(value as MeldingOutput['urgency'])

const isMeldingData = (value: unknown): value is MeldingData =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as MeldingData).id === 'number' &&
  typeof (value as MeldingData).token === 'string' &&
  typeof (value as MeldingData).publicId === 'string' &&
  typeof (value as MeldingData).createdAt === 'string'

const createOrUpdateMelding = async (text: string, id?: number, token?: string) => {
  if (id && token) {
    return await patchMeldingByMeldingIdMelder({
      body: { text },
      path: { melding_id: id },
      query: { token },
    })
  }

  return await postMelding({ body: { text } })
}

const createOrUpdateNote = async (isEmpty: boolean, markdown: string, meldingId: number, noteId?: number) => {
  if (noteId) {
    return await patchMeldingByMeldingIdNoteByNoteId({
      body: { text: markdown },
      path: { melding_id: meldingId, note_id: noteId },
    })
  }

  // If the note text is empty, we don't want to create a new note
  // It is allowed to update an existing note with empty text
  if (!isEmpty) {
    return await postMeldingByMeldingIdNote({
      body: { text: markdown },
      path: { melding_id: meldingId },
    })
  }
}

export const postMeldingForm = async (
  { existingId, existingNoteId, existingToken, requiredErrorMessage }: ArgsType,
  _: unknown,
  formData: FormData,
): Promise<FormState> => {
  const t = await getTranslations('melding-form')

  const formDataObj = Object.fromEntries(formData) as UserFormData

  const { characterCount, isEmpty, markdown } = parseNoteDocument(formDataObj.addNote)

  // Replace the submitted JSON with the derived markdown, so RichTextEditor can reload it as
  // its `defaultValue` (via contentType: 'markdown') if the form is redisplayed after an error.
  formData.set('addNote', markdown)

  const validationErrors = []

  if (!formDataObj.primary) {
    validationErrors.push({ key: 'primary', message: requiredErrorMessage })
  }

  if (!formDataObj.classificationQuery) {
    validationErrors.push({ key: 'classificationQuery', message: t('classification.required') })
  } else if (!formDataObj.classificationId) {
    validationErrors.push({ key: 'classificationQuery', message: t('classification.does-not-exist') })
  }

  if (!formDataObj.source) {
    validationErrors.push({ key: 'source', message: t('source.error') })
  }

  if (characterCount > MAX_NOTE_LENGTH) {
    validationErrors.push({ key: 'addNote', message: t('note.error', { max: MAX_NOTE_LENGTH }) })
  }

  if (validationErrors.length > 0) return { formData, validationErrors }

  const urgencyNumber = Number(formDataObj.urgency)

  if (!isValidUrgency(urgencyNumber)) {
    return {
      apiError: `Invalid urgency value: ${formDataObj.urgency}`,
      formData,
    }
  }

  const prefetchedMelding = formDataObj.prefetchedMelding
    ? safeJSONParse(formDataObj.prefetchedMelding, undefined)
    : undefined
  const validPrefetchedMelding = isMeldingData(prefetchedMelding) ? prefetchedMelding : undefined

  const { data, error, response } = await createOrUpdateMelding(
    formDataObj.primary,
    validPrefetchedMelding?.id ?? existingId,
    validPrefetchedMelding?.token ?? existingToken,
  )

  if (hasValidationErrors(response, error)) {
    return {
      formData,
      validationErrors: [{ key: 'primary', message: getApiErrorMessage(error) }],
    }
  }

  if (error) return { apiError: error, formData }

  const { created_at, id, public_id, token } = data

  const { error: updateMeldingError } = await patchMeldingByMeldingId({
    body: {
      classification_id: Number(formDataObj.classificationId),
      label_ids: formData.getAll('labels').map((label) => Number(label)),
      source_id: Number(formDataObj.source),
      urgency: urgencyNumber,
    },
    path: { melding_id: id },
  })

  if (updateMeldingError) return { apiError: updateMeldingError, formData }

  const result = await createOrUpdateNote(isEmpty, markdown, id, existingNoteId)

  if (result?.error) return { apiError: result.error, formData }

  const params = new URLSearchParams({
    classification_id: String(formDataObj.classificationId),
    created_at,
    id: String(id),
    public_id,
    token,
  })

  redirect(`${getClientEnv().NEXT_PUBLIC_MELDING_FORM_BASE_URL}/back-office-entry?${params}`)
}
