'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import * as z from 'zod'

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

type ValidationMessages = {
  noteTooLong: string
  primaryRequired: string
  sourceRequired: string
}

const requiredString = (message: string) => z.string({ error: message }).min(1, { error: message })

// The order of the keys determines the order of the validation errors
/* eslint-disable perfectionist/sort-objects */
const createMeldingFormSchema = ({ noteTooLong, primaryRequired, sourceRequired }: ValidationMessages) =>
  z.object({
    primary: requiredString(primaryRequired),
    source: requiredString(sourceRequired),
    // The note is validated on its plain-text character count, not on the submitted JSON document
    addNote: z.number().max(MAX_NOTE_LENGTH, { error: noteTooLong }),
  })
/* eslint-enable perfectionist/sort-objects */

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
  } else {
    return await postMelding({ body: { text } })
  }
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

  const formDataObj = Object.fromEntries(formData)

  const { characterCount, isEmpty, markdown } = parseNoteDocument(formDataObj.addNote)

  // Replace the submitted JSON with the derived markdown, so RichTextEditor can reload it as
  // its `defaultValue` (via contentType: 'markdown') if the form is redisplayed after an error.
  formData.set('addNote', markdown)

  const { error: parseError } = createMeldingFormSchema({
    noteTooLong: t('note.error', { max: MAX_NOTE_LENGTH }),
    primaryRequired: requiredErrorMessage,
    sourceRequired: t('source.error'),
  }).safeParse({ addNote: characterCount, primary: formDataObj.primary, source: formDataObj.source })

  if (parseError) {
    return {
      formData,
      validationErrors: parseError.issues.map(({ message, path }) => ({ key: String(path[0]), message })),
    }
  }

  const urgencyRaw = formDataObj.urgency
  const urgencyNumber = Number(urgencyRaw)

  if (!isValidUrgency(urgencyNumber)) {
    return {
      apiError: `Invalid urgency value: ${urgencyRaw}`,
      formData,
    }
  }

  const prefetchedMeldingRaw = formDataObj.prefetchedMelding as string | undefined
  const prefetchedMelding = prefetchedMeldingRaw ? safeJSONParse(prefetchedMeldingRaw, undefined) : undefined
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
      validationErrors: [{ key: 'primary', message: getApiErrorMessage(error) }],
    }
  }

  if (error) return { apiError: error, formData }

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

  if (updateMeldingError) return { apiError: updateMeldingError, formData }

  const result = await createOrUpdateNote(isEmpty, markdown, meldingData.id, existingNoteId)

  if (result?.error) return { apiError: result.error, formData }

  const params = new URLSearchParams({
    created_at: meldingData.createdAt,
    id: String(meldingData.id),
    public_id: meldingData.publicId,
    token: meldingData.token,
  })

  if (meldingData.classificationId) params.set('classification_id', String(meldingData.classificationId))

  redirect(`${getClientEnv().NEXT_PUBLIC_MELDING_FORM_BASE_URL}/back-office-entry?${params}`)
}
