import { http, HttpResponse } from 'msw'

import { ENDPOINTS } from './endpoints'
import {
  additionalQuestions,
  contact,
  containerAsset,
  form,
  melding,
  PDOKFree,
  PDOKReverse,
  PDOKSuggest,
} from 'apps/melding-form/src/mocks/data'

export const handlers = [
  // Form
  http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => new HttpResponse()),

  // Melding
  http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID, () => new HttpResponse()),

  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () => HttpResponse.json(additionalQuestions)),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD, () =>
    HttpResponse.json(new Blob(['mock content'], { type: 'image/webp' }), {
      headers: { 'content-type': 'image/webp' },
    }),
  ),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS_MELDER, () =>
    HttpResponse.json([{ id: 42, original_filename: 'IMG_0815.jpg' }]),
  ),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json(melding)),

  http.post(ENDPOINTS.POST_MELDING, () =>
    HttpResponse.json({
      id: 123,
      created_at: '2025-05-26T11:56:34.081Z',
      public_id: 'B100AA',
      token: 'test-token',
      classification: { id: 2, name: 'Test classification' },
    }),
  ),
  http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () => HttpResponse.json({ id: 42 })),
  http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_CONTACT, () => new HttpResponse()),
  http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_LOCATION, () => new HttpResponse()),

  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ADD_ATTACHMENTS, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ADD_CONTACT_INFO, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ANSWER_QUESTIONS, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT_LOCATION, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT, () => new HttpResponse()),

  // PDOK
  http.get(ENDPOINTS.PDOK_FREE, () => HttpResponse.json(PDOKFree)),
  http.get(ENDPOINTS.PDOK_REVERSE, () => HttpResponse.json(PDOKReverse)),
  http.get(ENDPOINTS.PDOK_SUGGEST, () => HttpResponse.json(PDOKSuggest)),

  // Static form
  http.get(ENDPOINTS.GET_STATIC_FORM, () =>
    HttpResponse.json([
      { id: '1', type: 'primary' },
      { id: '2', type: 'attachments' },
      { id: '3', type: 'contact' },
    ]),
  ),
  http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, ({ params }) => {
    // Primary
    if (params.staticFormId === '1') {
      return HttpResponse.json(form.components[0])
    }
    // Attachments
    if (params.staticFormId === '2') {
      return HttpResponse.json(form.components[0])
    }
    // Contact
    if (params.staticFormId === '3') {
      return HttpResponse.json({ components: contact })
    }
    return undefined
  }),

  // Wfs Layer
  http.get(ENDPOINTS.GET_WFS_BY_NAME, ({ params }) => {
    if (params.name === 'container') {
      return HttpResponse.json({
        features: [containerAsset],
      })
    }
    return HttpResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }),
]
