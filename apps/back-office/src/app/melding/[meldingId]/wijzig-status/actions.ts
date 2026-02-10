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
  AWAITING_PROCESSING: 'awaiting_processing',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
  PLANNED: 'planned',
  PROCESSING: 'processing',
  REOPEN_REQUESTED: 'reopen_requested',
  REOPENED: 'reopened',
} as const

type StateType = (typeof STATES)[keyof typeof STATES]

const extractStateFromFormData = (formData: FormData): StateType => {
  const formDataObj = Object.fromEntries(formData)
  return formDataObj.state as StateType
}

type StateHandler = (meldingId: number) => Promise<{ error?: unknown }>

const stateHandlers: Record<StateType, StateHandler> = {
  [STATES.AWAITING_PROCESSING]: async (meldingId) =>
    putMeldingByMeldingIdRequestProcessing({ path: { melding_id: meldingId } }),
  [STATES.CANCELED]: async (meldingId) => putMeldingByMeldingIdCancel({ path: { melding_id: meldingId } }),
  [STATES.COMPLETED]: async (meldingId) =>
    putMeldingByMeldingIdComplete({
      body: { mail_body: 'Dit is de body van de melding afgehandeld email.' },
      path: { melding_id: meldingId },
    }),
  [STATES.PLANNED]: async (meldingId) => putMeldingByMeldingIdPlan({ path: { melding_id: meldingId } }),
  [STATES.PROCESSING]: async (meldingId) => putMeldingByMeldingIdProcess({ path: { melding_id: meldingId } }),
  [STATES.REOPEN_REQUESTED]: async (meldingId) =>
    putMeldingByMeldingIdRequestReopen({ path: { melding_id: meldingId } }),
  [STATES.REOPENED]: async (meldingId) => putMeldingByMeldingIdReopen({ path: { melding_id: meldingId } }),
}

type MeldingIdParam = { meldingId: number }

export const postChangeStateForm = async ({ meldingId }: MeldingIdParam, _: unknown, formData: FormData) => {
  const state = extractStateFromFormData(formData)
  const handler = stateHandlers[state]

  if (handler) {
    const { error } = await handler(meldingId)
    if (error) return { meldingStateFromAction: state, systemError: error }
  }

  return redirect(`/melding/${meldingId}`)
}
