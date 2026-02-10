export const STATES = {
  AWAITING_PROCESSING: 'awaiting_processing',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
  PLANNED: 'planned',
  PROCESSING: 'processing',
  REOPEN_REQUESTED: 'reopen_requested',
  REOPENED: 'reopened',
} as const

export const STATES_LIST: string[] = Object.values(STATES)
