export const OVERVIEW_FIELDS = [
  { key: 'public_id', labelKey: 'column-header.public_id' },
  { key: 'created_at', labelKey: 'column-header.created_at' },
  { key: 'classification', labelKey: 'column-header.classification' },
  { key: 'state', labelKey: 'column-header.state' },
  { key: 'urgency', labelKey: 'column-header.urgency' },
  { key: 'address', labelKey: 'column-header.address' },
  { key: 'postal_code', labelKey: 'column-header.postal_code' },
] as const

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
