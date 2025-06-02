'use server'

import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { isValidMeldingState } from './utils'
import { putMeldingByMeldingIdComplete, putMeldingByMeldingIdProcess } from 'apps/back-office/src/apiClientProxy'
import { handleApiError } from 'apps/back-office/src/handleApiError'

const extractStateFromFormData = (formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)
  return formDataObj.state
}

const isValidState = (state: string | File) => {
  return typeof state === 'string' && isValidMeldingState(state)
}

const updateMeldingState = async (state: string, meldingId: number, t: (key: string) => string) => {
  if (state === 'processing') {
    return await putMeldingByMeldingIdProcess({ path: { melding_id: meldingId } })
  }
  if (state === 'completed') {
    return await putMeldingByMeldingIdComplete({
      path: { melding_id: meldingId },
      body: { mail_body: 'lalala' },
    })
  }
  // Should never reach here if type guard works
  return { error: { detail: t('invalid-state') } }
}

export const postChangeStateForm = async ({ meldingId }: { meldingId: number }, _: unknown, formData: FormData) => {
  const state = extractStateFromFormData(formData)

  const t = await getTranslations('change-state.errors')

  if (!isValidState(state)) {
    return { message: t('invalid-state') }
  }

  const { error } = await updateMeldingState(state, meldingId, t)

  if (error) {
    return { message: handleApiError(error) }
  }

  return redirect(`/melding/${meldingId}`)
}
