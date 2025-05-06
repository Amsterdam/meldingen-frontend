'use server'

import { getTranslations } from 'next-intl/server'

import { putMeldingByMeldingIdComplete, putMeldingByMeldingIdProcess } from 'apps/back-office/src/apiClientProxy'
import { handleApiError } from 'apps/back-office/src/handleApiError'

type Args = {
  id: number
  state: 'processing' | 'completed'
}

const stateToFunctionMap = {
  processing: putMeldingByMeldingIdProcess,
  completed: putMeldingByMeldingIdComplete,
}

export const changeMeldingState = async (_: unknown, { id, state }: Args) => {
  const updateStateFn = stateToFunctionMap[state]

  const t = await getTranslations('detail.state.errors')

  if (!updateStateFn) {
    return { message: t('invalid-state') }
  }

  const { error } = await updateStateFn({
    path: { melding_id: id },
  })

  if (error) return { message: handleApiError(error) }
}
