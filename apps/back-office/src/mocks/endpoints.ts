export const ENDPOINTS = {
  // Attachments
  GET_ATTACHMENT_BY_ID: '/attachment/:id',

  // Melding
  GET_MELDING: '/melding/',
  GET_MELDING_BY_MELDING_ID: '/melding/:id',
  GET_MELDING_BY_MELDING_ID_ANSWERS: '/melding/:id/answers',
  GET_MELDING_BY_MELDING_ID_ATTACHMENTS: '/melding/:id/attachments',
  GET_MELDING_BY_MELDING_ID_NEXT_POSSIBLE_STATES: '/melding/:id/next_possible_states',

  PUT_MELDING_BY_MELDING_ID_CANCEL: '/melding/:id/cancel',
  PUT_MELDING_BY_MELDING_ID_COMPLETE: '/melding/:id/complete',
  PUT_MELDING_BY_MELDING_ID_PLAN: '/melding/:id/plan',
  PUT_MELDING_BY_MELDING_ID_PROCESS: '/melding/:id/process',
  PUT_MELDING_BY_MELDING_ID_REOPEN: '/melding/:id/reopen',
  PUT_MELDING_BY_MELDING_ID_REQUEST_PROCESSING: '/melding/:id/request_processing',
  PUT_MELDING_BY_MELDING_ID_REQUEST_REOPEN: '/melding/:id/request_reopen',
}
