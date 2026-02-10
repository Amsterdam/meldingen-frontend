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

const STATES_LIST: string[] = Object.values(STATES)

type State = (typeof STATES)[keyof typeof STATES]

const extractStateFromFormData = (formData: FormData) => {
  const formDataObj = Object.fromEntries(formData)
  return formDataObj.state as string
}

type StateHandler = (meldingId: number) => Promise<{ error?: unknown }>

const stateHandlers: Record<State, StateHandler> = {
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

  if (!STATES_LIST.includes(state)) {
    return { meldingStateFromAction: state, systemError: new Error(`Invalid state: ${state}`) }
  }

  // We check that state is in STATES_LIST, so we can safely cast it to State here
  const handler = stateHandlers[state as State]

  if (handler) {
    const { error } = await handler(meldingId)

    if (error) return { meldingStateFromAction: state, systemError: error }
  }

  return redirect(`/melding/${meldingId}`)
}
