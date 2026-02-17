export const STATES = {
  CANCELED: 'canceled',
  COMPLETED: 'completed',
  PLANNED: 'planned',
  PROCESSING: 'processing',
  PROCESSING_REQUESTED: 'processing_requested',
  REOPEN_REQUESTED: 'reopen_requested',
  REOPENED: 'reopened',
  SUBMITTED: 'submitted',
} as const

export const STATES_LIST: string[] = Object.values(STATES)
