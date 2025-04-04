export const ENDPOINTS = {
  PDOK_FREE: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free',
  PDOK_REVERSE: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse',
  PDOK_SUGGEST: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest',
  MELDING_BY_ID: 'http://localhost:8000/melding/:id/melder',
  MELDING_ANSWERS_BY_ID: 'http://localhost:8000/melding/:id/answers',
  MELDING_ATTACHMENT_BY_ID: 'http://localhost:8000/melding/:id/attachment',
  MELDING_ATTACHMENT_DELETE_BY_ID: 'http://localhost:8000/melding/:id/attachment/:meldingId',
  MELDING_CONTACT_BY_ID: 'http://localhost:8000/melding/:id/contact',
  MELDING_LOCATION_BY_ID: 'http://localhost:8000/melding/:id/location',
  STATIC_FORM: 'http://localhost:8000/static-form',
  STATIC_FORM_BY_STATIC_FORM_ID: 'http://localhost:8000/static-form/:staticFormId',
}
