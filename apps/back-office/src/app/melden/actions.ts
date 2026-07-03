'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import type { MeldingOutput } from '@meldingen/api-client'

import type { MeldingData } from './types'
import type { FormState } from '~/types'

import { MAX_NOTE_LENGTH } from '../constants'
import { hasValidationErrors } from './_utils/hasValidationErrors'
import {
  patchMeldingByMeldingId,
  patchMeldingByMeldingIdMelder,
  patchMeldingByMeldingIdNoteByNoteId,
  postMelding,
  postMeldingByMeldingIdNote,
} from '~/app/_api-client/proxy'
import { handleApiError } from '~/app/_utils/handleApiError'
import { URGENCY_VALUES } from '~/constants'

export type ArgsType = {
  existingId?: number
  existingNoteId?: number
  existingToken?: string
  requiredErrorMessage: string
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

const safeJSONParse = (jsonString: string) => {
  try {
    return JSON.parse(jsonString)
  } catch {
    return undefined
  }
}

const createOrUpdateMelding = async (text: string, id?: number, token?: string) => {
  if (id && token) {
    return await patchMeldingByMeldingIdMelder({
      body: { text },
      path: { melding_id: id },
      query: { token },
    })
  } else {
    return await postMelding({ body: { text } })
  }
}

const createOrUpdateNote = async (text: string, meldingId: number, noteId?: number) => {
  if (noteId) {
    return await patchMeldingByMeldingIdNoteByNoteId({
      body: { text },
      path: { melding_id: meldingId, note_id: noteId },
    })
  }

  // If the note text is empty, we don't want to create a new note
  // It is allowed to update an existing note with empty text
  if (text.trim() !== '') {
    return await postMeldingByMeldingIdNote({
      body: { text },
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

  const formDataObj = Object.fromEntries(formData)

  // Return validation errors if required fields are missing
  const validationErrors = [
    ...(!formDataObj.primary ? [{ key: 'primary', message: requiredErrorMessage }] : []),
    ...(!formDataObj.source ? [{ key: 'source', message: t('source.error') }] : []),
    ...(formDataObj.addNote && formDataObj.addNote.toString().length > MAX_NOTE_LENGTH
      ? [{ key: 'addNote', message: t('note.error', { max: MAX_NOTE_LENGTH }) }]
      : []),
  ]

  if (validationErrors.length > 0) {
    return { formData, validationErrors }
  }

  const urgencyRaw = formDataObj.urgency
  const urgencyNumber = Number(urgencyRaw)

  if (!isValidUrgency(urgencyNumber)) {
    return {
      formData,
      systemError: `Invalid urgency value: ${urgencyRaw}`,
    }
  }

  const prefetchedMeldingRaw = formDataObj.prefetchedMelding as string | undefined
  const prefetchedMelding = prefetchedMeldingRaw ? safeJSONParse(prefetchedMeldingRaw) : undefined
  const validPrefetchedMelding = isMeldingData(prefetchedMelding) ? prefetchedMelding : undefined

  const meldingIdForPatch = validPrefetchedMelding?.id ?? existingId
  const meldingTokenForPatch = validPrefetchedMelding?.token ?? existingToken

  const { data, error, response } = await createOrUpdateMelding(
    formDataObj.primary.toString(),
    meldingIdForPatch,
    meldingTokenForPatch,
  )

  if (hasValidationErrors(response, error)) {
    return {
      formData,
      validationErrors: [{ key: 'primary', message: handleApiError(error) }],
    }
  }

  if (error) return { formData, systemError: error }

  const { classification, created_at, id, public_id, token } = data

  const meldingData = {
    classificationId: classification?.id,
    createdAt: created_at,
    id,
    publicId: public_id,
    token,
  }

  const { error: updateMeldingError } = await patchMeldingByMeldingId({
    body: {
      label_ids: formData.getAll('labels').map((label) => Number(label)),
      source_id: Number(formDataObj.source),
      urgency: urgencyNumber,
    },
    path: { melding_id: meldingData.id },
  })

  if (updateMeldingError) return { formData, systemError: updateMeldingError }

  const result = await createOrUpdateNote(formDataObj.addNote.toString(), meldingData.id, existingNoteId)

  if (result?.error) return { formData, systemError: result.error }

  const params = new URLSearchParams({
    created_at: meldingData.createdAt,
    id: String(meldingData.id),
    public_id: meldingData.publicId,
    token: meldingData.token,
  })

  if (meldingData.classificationId) params.set('classification_id', String(meldingData.classificationId))

  redirect(`${process.env.NEXT_PUBLIC_MELDING_FORM_BASE_URL}/back-office-entry?${params}`)
}
