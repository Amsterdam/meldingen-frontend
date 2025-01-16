import { http, HttpResponse } from 'msw'

import * as endpoints from './endpoints'

export const handlers = [
  /** GET */
  http.get(endpoints.PDOK_REVERSE, () =>
    HttpResponse.json({
      response: {
        numFound: 1,
        start: 0,
        maxScore: 7.2280917,
        numFoundExact: true,
        docs: [
          {
            type: 'adres',
            weergavenaam: 'Nieuwmarkt 15, 1011JR Amsterdam',
            id: 'adr-758e934b8651217819abcf0e60a45b39',
            score: 7.2280917,
            afstand: 1.8,
          },
        ],
      },
    }),
  ),

  /** POST */
  http.post(endpoints.MELDING_ATTACHMENT_BY_ID, () =>
    HttpResponse.json({
      id: 2,
      original_filename: 'example.png',
      filename: 'example.png',
      created_at: '2021-10-14T14:05:41.000000Z',
    }),
  ),
]
