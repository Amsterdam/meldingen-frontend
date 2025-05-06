import { http, HttpResponse } from 'msw'

import { meldingen } from './data'
import { ENDPOINTS } from './endpoints'

export const handlers = [
  http.get(ENDPOINTS.GET_MELDING, () => HttpResponse.json(meldingen, { headers: { 'Content-Range': '0/40' } })),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_PROCESS, () => new HttpResponse()),
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_COMPLETE, () => new HttpResponse()),
]
