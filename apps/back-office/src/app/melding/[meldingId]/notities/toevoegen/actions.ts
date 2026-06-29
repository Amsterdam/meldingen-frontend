'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { postMeldingByMeldingIdNote } from '~/app/_api-client/proxy'
import { handleApiError } from '~/app/_utils/handleApiError'

const MIN_NOTE_LENGTH = 1
const MAX_NOTE_LENGTH = 3000

export type FormState = {
  systemError?: string
  textFromAction?: string
  validationErrors?: { key: string; message: string }[]
}

type Args = {
  meldingId: number
}

export const postAddNoteForm = async ({ meldingId }: Args, _: unknown, formData: FormData): Promise<FormState> => {
  const t = await getTranslations('add-note')

  const text = String(formData.get('text') ?? '')
  const redirectPath = `/melding/${meldingId}`

  if (text.length < MIN_NOTE_LENGTH) {
    return {
      textFromAction: text,
      validationErrors: [{ key: 'text', message: t('errors.validation.required') }],
    }
  } else if (text.length > MAX_NOTE_LENGTH) {
    return {
      textFromAction: text,
      validationErrors: [{ key: 'text', message: t('errors.validation.max-length') }],
    }
  } else {
    const { error, response } = await postMeldingByMeldingIdNote({
      body: { text },
      path: { melding_id: meldingId },
    })

    if (response?.status === 422) {
      return {
        textFromAction: text,
        validationErrors: [{ key: 'text', message: handleApiError(error) }],
      }
    }

    if (error) {
      return {
        systemError: handleApiError(error),
        textFromAction: text,
      }
    }

    redirect(redirectPath)
  }
}
