export const ENDPOINTS = {
  // PDOK
  PDOK_FREE: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free',
  PDOK_REVERSE: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse',
  PDOK_SUGGEST: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest',

  // Classification
  FORM_CLASSIFICATION_BY_CLASSIFICATION_ID: 'http://localhost:8000/form/classification/:classification_id',

  // Melding
  MELDING: 'http://localhost:8000/melding',
  MELDING_ANSWERS_BY_ID_MELDER: 'http://localhost:8000/melding/:id/answers/melder',
  MELDING_ATTACHMENT_BY_ID: 'http://localhost:8000/melding/:id/attachment',
  MELDING_BY_ID: 'http://localhost:8000/melding/:id/melder',
  MELDING_BY_ID_ADD_ATTACHMENTS: 'http://localhost:8000/melding/:id/add_attachments',
  MELDING_BY_ID_ADD_CONTACT_INFO: 'http://localhost:8000/melding/:id/add_contact_info',
  MELDING_BY_ID_ANSWER_QUESTIONS: 'http://localhost:8000/melding/:id/answer_questions',
  MELDING_BY_ID_SUBMIT_LOCATION: 'http://localhost:8000/melding/:id/submit_location',
  MELDING_BY_ID_SUBMIT: 'http://localhost:8000/melding/:id/submit',
  MELDING_BY_ID_ATTACHMENTS_MELDER: 'http://localhost:8000/melding/:id/attachments/melder',
  MELDING_BY_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD:
    'http://localhost:8000/melding/:id/attachment/:attachmentId/download',
  MELDING_ATTACHMENT_DELETE_BY_ID: 'http://localhost:8000/melding/:id/attachment/:attachmentId',
  MELDING_CONTACT_BY_ID: 'http://localhost:8000/melding/:id/contact',
  MELDING_LOCATION_BY_ID: 'http://localhost:8000/melding/:id/location',

  // Static-form
  STATIC_FORM: 'http://localhost:8000/static-form',
  STATIC_FORM_BY_STATIC_FORM_ID: 'http://localhost:8000/static-form/:staticFormId',
}
