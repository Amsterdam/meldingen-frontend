'use server'

import { putMeldingByMeldingIdComplete, putMeldingByMeldingIdProcess } from 'apps/back-office/src/apiClientProxy'
import { handleApiError } from 'apps/back-office/src/handleApiError'

type MeldingState = 'processing' | 'completed'

const stateToFunctionMap = {
  processing: putMeldingByMeldingIdProcess,
  completed: putMeldingByMeldingIdComplete,
}

export const changeMeldingState = async (_: unknown, { id, state }: { id: number; state: MeldingState }) => {
  const updateStateFn = stateToFunctionMap[state]

  if (!updateStateFn) {
    return { message: 'Invalid state' }
  }

  const { error } = await updateStateFn({
    path: { melding_id: id },
  })

  if (error) return { message: handleApiError(error) }
}
