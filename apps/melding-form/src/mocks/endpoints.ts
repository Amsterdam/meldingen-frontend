/* eslint-disable perfectionist/sort-objects */

export const ENDPOINTS = {
  // Form
  GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID: 'http://localhost:8000/form/classification/:id',

  // Melding
  DELETE_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID:
    'http://localhost:8000/melding/:id/attachment/:attachmentId',
  DELETE_MELDING_BY_MELDING_ID_ASSET_BY_ASSET_ID: 'http://localhost:8000/melding/:melding_id/asset/:asset_id',

  GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER: 'http://localhost:8000/melding/:id/answers/melder',
  GET_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD:
    'http://localhost:8000/melding/:id/attachment/:attachmentId/download',
  GET_MELDING_BY_MELDING_ID_ATTACHMENTS_MELDER: 'http://localhost:8000/melding/:id/attachments/melder',
  GET_MELDING_BY_MELDING_ID_MELDER: 'http://localhost:8000/melding/:id/melder',
  GET_MELDING_BY_MELDING_ID_ASSETS_MELDER: 'http://localhost:8000/melding/:melding_id/assets/melder',

  PATCH_MELDING_BY_MELDING_ID: 'http://localhost:8000/melding/:id',
  PATCH_MELDING_BY_MELDING_ID_ANSWER_BY_ANSWER_ID: 'http://localhost:8000/melding/:id/answer/:answerId',
  PATCH_MELDING_BY_MELDING_ID_CONTACT: 'http://localhost:8000/melding/:id/contact',
  PATCH_MELDING_BY_MELDING_ID_LOCATION: 'http://localhost:8000/melding/:id/location',

  POST_MELDING: 'http://localhost:8000/melding',
  POST_MELDING_BY_MELDING_ID_ASSET: 'http://localhost:8000/melding/:id/asset',
  POST_MELDING_BY_MELDING_ID_ATTACHMENT: 'http://localhost:8000/melding/:id/attachment',
  POST_MELDING_BY_MELDING_ID_QUESTION_BY_QUESTION_ID: 'http://localhost:8000/melding/:melding_id/question/:question_id',

  PUT_MELDING_BY_MELDING_ID_ADD_ATTACHMENTS: 'http://localhost:8000/melding/:id/add_attachments',
  PUT_MELDING_BY_MELDING_ID_ADD_CONTACT_INFO: 'http://localhost:8000/melding/:id/add_contact_info',
  PUT_MELDING_BY_MELDING_ID_ANSWER_QUESTIONS: 'http://localhost:8000/melding/:id/answer_questions',
  PUT_MELDING_BY_MELDING_ID_SUBMIT_LOCATION: 'http://localhost:8000/melding/:id/submit_location',
  PUT_MELDING_BY_MELDING_ID_SUBMIT_MELDER: 'http://localhost:8000/melding/:id/submit/melder',

  // PDOK
  PDOK_FREE: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free',
  PDOK_REVERSE: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse',
  PDOK_SUGGEST: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest',

  // Static form
  GET_STATIC_FORM: 'http://localhost:8000/static-form',
  GET_STATIC_FORM_BY_STATIC_FORM_ID: 'http://localhost:8000/static-form/:staticFormId',

  // Asset type
  GET_ASSET_TYPE_BY_ASSET_TYPE_ID_WFS: 'http://localhost:8000/asset-type/:asset_type_id/wfs',
}
