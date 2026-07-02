import { http, HttpResponse } from 'msw'

import { additionalQuestions, asset, melding, meldingen, textAreaComponent } from './data'
import { ENDPOINTS } from './endpoints'

export const handlers = [
  // Attachments
  http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, () =>
    HttpResponse.json(new Blob(['mock content'], { type: 'image/webp' }), {
      headers: { 'content-type': 'image/webp' },
    }),
  ),

  // Labels
  http.get(ENDPOINTS.GET_LABEL, () =>
    HttpResponse.json([
      { id: 0, name: 'Label 1' },
      { id: 1, name: 'Label 2' },
      { id: 2, name: 'Label 3' },
    ]),
  ),

  // Melding
  http.get(ENDPOINTS.GET_MELDING, () => HttpResponse.json(meldingen, { headers: { 'Content-Range': '0/40' } })),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json(melding)),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS, () => HttpResponse.json(additionalQuestions)),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ASSETS, () => HttpResponse.json([asset])),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
    HttpResponse.json([{ id: 42, original_filename: 'IMG_0815.jpg' }]),
  ),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NEXT_POSSIBLE_STATES, () =>
    HttpResponse.json({ states: ['processing_requested', 'completed'] }),
  ),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NOTE, () =>
    HttpResponse.json({
      id: 1,
      melding_id: 123,
      text: 'This is a test note for the melding.',
    }),
  ),

  http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID, () => HttpResponse.json({})),
  http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID_MELDER, () =>
    HttpResponse.json({
      classification: { id: 2, name: 'Test classification' },
      created_at: '2025-05-26T11:56:34.081Z',
      id: 123,
      public_id: 'B100AA',
      token: 'PATCH request',
    }),
  ),
  http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID_NOTE, () => new HttpResponse()),

  http.post(ENDPOINTS.POST_MELDING, () =>
    HttpResponse.json({
      classification: { id: 2, name: 'Test classification' },
      created_at: '2025-05-26T11:56:34.081Z',
      id: 123,
      public_id: 'B100AA',
      token: 'test-token',
    }),
  ),
  http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_NOTE, () => new HttpResponse()),

  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_CANCEL, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_COMPLETE, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_PLAN, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_PROCESS, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_REOPEN, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_REQUEST_PROCESSING, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_REQUEST_REOPEN, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT, () => new HttpResponse()),

  // Source
  http.get(ENDPOINTS.GET_SOURCE, () =>
    HttpResponse.json([
      { id: 1, name: 'Brievenbus' },
      { id: 2, name: 'E-mail' },
      { id: 3, name: 'Telefoon' },
    ]),
  ),

  // Static form
  http.get(ENDPOINTS.GET_STATIC_FORM, () => HttpResponse.json([{ id: '1', type: 'primary' }])),
  http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, ({ params }) => {
    // Primary
    if (params.staticFormId === '1') {
      return HttpResponse.json({ components: [textAreaComponent] })
    }
  }),
]
