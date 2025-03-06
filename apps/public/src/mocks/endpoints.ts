export const ENDPOINTS = {
  PDOK_FREE: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free',
  PDOK_REVERSE: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse',
  PDOK_SUGGEST: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest',
  MELDING_BY_ID: '/melding/:id/melder',
  MELDING_ANSWERS_BY_ID: '/melding/:id/answers',
  MELDING_ATTACHMENT_BY_ID: '/melding/:id/attachment',
  MELDING_ATTACHMENT_DELETE_BY_ID: '/melding/:id/attachment/:meldingId',
  STATIC_FORM: '/static-form',
  STATIC_FORM_BY_STATIC_FORM_ID: '/static-form/:staticFormId',
}
