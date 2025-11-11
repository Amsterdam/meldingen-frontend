export const ENDPOINTS = {
  // Attachmets
  GET_ATTACHMENT_BY_ID: '/attachment/:id',

  // Melding
  GET_MELDING: '/melding/',
  GET_MELDING_BY_MELDING_ID: '/melding/:id',
  GET_MELDING_BY_MELDING_ID_ANSWERS: '/melding/:id/answers',
  GET_MELDING_BY_MELDING_ID_ATTACHMENTS: '/melding/:id/attachments',

  PUT_MELDING_BY_MELDING_ID_PROCESS: '/melding/:id/process',
  PUT_MELDING_BY_MELDING_ID_COMPLETE: '/melding/:id/complete',
}
