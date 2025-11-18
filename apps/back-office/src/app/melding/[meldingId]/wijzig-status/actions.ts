'use server'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

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
    return { errorMessage: t('invalid-state') }
  }

  if (state === 'processing') {
    const { error } = await putMeldingByMeldingIdProcess({ path: { melding_id: meldingId } })

    if (error) return { errorMessage: handleApiError(error) }
  }

  if (state === 'completed') {
    const { error } = await putMeldingByMeldingIdComplete({
      body: { mail_body: 'Dit is de body van de melding afgehandeld email.' },
      path: { melding_id: meldingId },
    })

    if (error) return { errorMessage: handleApiError(error) }
  }

  return redirect(`/melding/${meldingId}`)
}
