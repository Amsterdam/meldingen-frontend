import { http, HttpResponse } from 'msw'

import { additionalQuestions, melding, meldingen } from './data'
import { ENDPOINTS } from './endpoints'

export const handlers = [
  // Melding
  http.get(ENDPOINTS.GET_MELDING, () => HttpResponse.json(meldingen, { headers: { 'Content-Range': '0/40' } })),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json(melding)),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS, () => HttpResponse.json(additionalQuestions)),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
    HttpResponse.json([{ id: 42, original_filename: 'IMG_0815.jpg' }]),
  ),
  http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, () =>
    HttpResponse.json(new Blob(['mock content'], { type: 'image/webp' }), {
      headers: { 'content-type': 'image/webp' },
    }),
  ),
  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NEXT_POSSIBLE_STATES, () =>
    HttpResponse.json({ states: ['processing_requested', 'completed'] }),
  ),

  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_CANCEL, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_COMPLETE, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_PLAN, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_PROCESS, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_REOPEN, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_REQUEST_PROCESSING, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_REQUEST_REOPEN, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT, () => new HttpResponse()),
]
