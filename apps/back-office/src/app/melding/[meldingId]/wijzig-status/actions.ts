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

export const postChangeStateForm = async ({ meldingId }: { meldingId: number }, _: unknown, formData: FormData) => {
  const state = extractStateFromFormData(formData)

  const t = await getTranslations('change-state.errors')

  if (!isValidState(state)) {
    return { message: t('invalid-state') }
  }

  if (state === 'processing') {
    const { error } = await putMeldingByMeldingIdProcess({ path: { melding_id: meldingId } })

    if (error) return { message: handleApiError(error) }
  }

  if (state === 'completed') {
    const { error } = await putMeldingByMeldingIdComplete({
      path: { melding_id: meldingId },
      body: { mail_body: 'lalala' },
    })

    if (error) return { message: handleApiError(error) }
  }

  return redirect(`/melding/${meldingId}`)
}
