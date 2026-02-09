'use server'

import { redirect } from 'next/navigation'

import {
  putMeldingByMeldingIdCancel,
  putMeldingByMeldingIdComplete,
  putMeldingByMeldingIdPlan,
  putMeldingByMeldingIdProcess,
  putMeldingByMeldingIdReopen,
  putMeldingByMeldingIdRequestProcessing,
  putMeldingByMeldingIdRequestReopen,
} from 'apps/back-office/src/apiClientProxy'

const STATES = {
  CANCEL: 'cancel',
  COMPLETE: 'complete',
  PLAN: 'plan',
  PROCESS: 'process',
  REOPEN: 'reopen',
  REQUEST_PROCESSING: 'request_processing',
  REQUEST_REOPEN: 'request_reopen',
} as const

type StateType = (typeof STATES)[keyof typeof STATES]

const extractStateFromFormData = (formData: FormData): StateType => {
  const formDataObj = Object.fromEntries(formData)
  return formDataObj.state as StateType
}

type StateHandler = (meldingId: number) => Promise<{ error?: unknown }>

const stateHandlers: Record<StateType, StateHandler> = {
  [STATES.CANCEL]: async (meldingId) => putMeldingByMeldingIdCancel({ path: { melding_id: meldingId } }),
  [STATES.COMPLETE]: async (meldingId) =>
    putMeldingByMeldingIdComplete({
      body: { mail_body: 'Dit is de body van de melding afgehandeld email.' },
      path: { melding_id: meldingId },
    }),
  [STATES.PLAN]: async (meldingId) => putMeldingByMeldingIdPlan({ path: { melding_id: meldingId } }),
  [STATES.PROCESS]: async (meldingId) => putMeldingByMeldingIdProcess({ path: { melding_id: meldingId } }),
  [STATES.REOPEN]: async (meldingId) => putMeldingByMeldingIdReopen({ path: { melding_id: meldingId } }),
  [STATES.REQUEST_PROCESSING]: async (meldingId) =>
    putMeldingByMeldingIdRequestProcessing({ path: { melding_id: meldingId } }),
  [STATES.REQUEST_REOPEN]: async (meldingId) => putMeldingByMeldingIdRequestReopen({ path: { melding_id: meldingId } }),
}

type MeldingIdParam = { meldingId: number }

export const postChangeStateForm = async ({ meldingId }: MeldingIdParam, _: unknown, formData: FormData) => {
  const state = extractStateFromFormData(formData)
  const handler = stateHandlers[state]

  if (handler) {
    const { error } = await handler(meldingId)
    if (error) return { systemError: error }
  }

  return redirect(`/melding/${meldingId}`)
}
