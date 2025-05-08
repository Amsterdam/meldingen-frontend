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

export const postChangeStateForm = async ({ meldingId }: { meldingId: number }, _: unknown, formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)

  const { state } = formDataObj

  const t = await getTranslations('change-state.errors')

  if (typeof state !== 'string' || !isValidMeldingState(state)) {
    return { message: t('invalid-state') }
  }

  const updateStateFn = stateToFunctionMap[state]

  const { error } = await updateStateFn({
    path: { melding_id: meldingId },
  })

  if (error) return { message: handleApiError(error) }

  redirect(`/melding/${meldingId}`)
}
