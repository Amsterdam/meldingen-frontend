'use server'

import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { isValidMeldingState } from './utils'
import { putMeldingByMeldingIdComplete, putMeldingByMeldingIdProcess } from 'apps/back-office/src/apiClientProxy'
import { handleApiError } from 'apps/back-office/src/handleApiError'

const stateToFunctionMap = {
  processing: putMeldingByMeldingIdProcess,
  completed: putMeldingByMeldingIdComplete,
}

const extractStateFromFormData = (formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)
  return formDataObj.state
}

const isValidState = (state: string | File) => {
  return typeof state === 'string' && isValidMeldingState(state)
}

export const postChangeStateForm = async ({ meldingId }: { meldingId: number }, _: unknown, formData: FormData) => {
  const state = extractStateFromFormData(formData)

  const t = await getTranslations('change-state.errors')

  if (!isValidState(state)) {
    return { message: t('invalid-state') }
  }

  const updateStateFn = stateToFunctionMap[state]

  const { error } = await updateStateFn({
    path: { melding_id: meldingId },
  })

  if (error) return { message: handleApiError(error) }

  return redirect(`/melding/${meldingId}`)
}
