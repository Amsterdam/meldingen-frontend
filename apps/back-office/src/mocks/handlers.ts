import { http, HttpResponse } from 'msw'

import { meldingen } from './data'
import { ENDPOINTS } from './endpoints'

export const handlers = [
  http.get(ENDPOINTS.MELDING, () => HttpResponse.json(meldingen, { headers: { 'Content-Range': '0/40' } })),
]
