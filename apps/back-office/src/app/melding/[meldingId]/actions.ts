'use server'

import { putMeldingByMeldingIdComplete, putMeldingByMeldingIdProcess } from 'apps/back-office/src/apiClientProxy'
import { handleApiError } from 'apps/back-office/src/handleApiError'

export const changeStateToProcess = async (melding_id: number) => {
  const { error } = await putMeldingByMeldingIdProcess({
    path: { melding_id },
  })

  if (error) return { message: handleApiError(error) }
}

export const changeStateToComplete = async (melding_id: number) => {
  const { error } = await putMeldingByMeldingIdComplete({
    path: { melding_id },
  })

  if (error) return { message: handleApiError(error) }
}
