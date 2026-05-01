'use server'

import { redirect } from 'next/navigation'

import { MeldingOutput, patchMeldingByMeldingId } from '~/apiClientProxy'
import { URGENCY_VALUES } from '~/constants'

type MeldingIdParam = {
  currentUrgency: MeldingOutput['urgency']
  meldingId: number
}

const extractUrgencyFromFormData = (formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)
  return formDataObj.urgency as string
}

const isValidUrgency = (value: number): value is MeldingOutput['urgency'] =>
  URGENCY_VALUES.includes(value as MeldingOutput['urgency'])

export const postChangeUrgencyForm = async (
  { currentUrgency, meldingId }: MeldingIdParam,
  _: unknown,
  formData: FormData,
) => {
  const urgencyRaw = extractUrgencyFromFormData(formData)
  const redirectPath = `/melding/${meldingId}`

  if (urgencyRaw === String(currentUrgency)) return redirect(redirectPath)

  const urgencyNumber = Number(urgencyRaw)

  if (!isValidUrgency(urgencyNumber)) {
    return {
      error: { message: `Invalid urgency: ${urgencyRaw}`, type: 'invalid-urgency' as const },
      urgencyFromAction: urgencyRaw,
    }
  }

  const { error } = await patchMeldingByMeldingId({
    body: { urgency: urgencyNumber },
    path: { melding_id: meldingId },
  })

  if (error) {
    return {
      error: { message: error, type: 'urgency-change-failed' as const },
      urgencyFromAction: urgencyRaw,
    }
  }

  return redirect(redirectPath)
}
