import { http, HttpResponse } from 'msw'

import { ENDPOINTS } from './endpoints'
import mockFormData from './mockFormData.json'

export const handlers = [
  /** GET */
  http.get(ENDPOINTS.PDOK_FREE, () =>
    HttpResponse.json({
      response: {
        docs: [
          {
            weergavenaam: 'Amstel 1, Amsterdam',
            centroide_ll: 'POINT(4.895168 52.370216)',
          },
        ],
      },
    }),
  ),

  http.get(ENDPOINTS.PDOK_REVERSE, () =>
    HttpResponse.json({
      response: {
        numFound: 1,
        docs: [
          {
            type: 'adres',
            weergavenaam: 'Nieuwmarkt 15, 1011JR Amsterdam',
            id: 'adr-758e934b8651217819abcf0e60a45b39',
          },
        ],
      },
    }),
  ),

  http.get(ENDPOINTS.PDOK_SUGGEST, () =>
    HttpResponse.json({
      response: {
        docs: [
          {
            weergavenaam: 'Amsteldijk 152A-H, 1079LG Amsterdam',
            id: 'adr-bc581db7d4fc654e4ed35abce874ee11',
          },
          {
            weergavenaam: 'Amstelkade 166A-H, 1078AX Amsterdam',
            id: 'adr-8d27e7c75aef4349f37e1bebae62d45a',
          },
          {
            weergavenaam: 'Amstelkade 169A-H, 1078AZ Amsterdam',
            id: 'adr-6da11c41a94dad446b1ddcf3cdf927e6',
          },
          {
            weergavenaam: 'Amstelveenseweg 170B-H, 1075XP Amsterdam',
            id: 'adr-e15725abe37eb0e4dfeecad2f1055f83',
          },
          {
            weergavenaam: 'Amstel 312A-H, 1017AP Amsterdam',
            id: 'adr-1e36f861ba5cede46a2c8e1b53bd55a2',
          },
        ],
      },
    }),
  ),

  http.get(ENDPOINTS.STATIC_FORM, () =>
    HttpResponse.json([
      {
        id: '123',
        type: 'primary',
      },
    ]),
  ),

  http.get(ENDPOINTS.STATIC_FORM_BY_STATIC_FORM_ID, () => HttpResponse.json(mockFormData)),

  /** POST */
  http.post(ENDPOINTS.MELDING_ATTACHMENT_BY_ID, () =>
    HttpResponse.json({
      id: 2,
      original_filename: 'example.png',
      filename: 'example.png',
      created_at: '2021-10-14T14:05:41.000000Z',
    }),
  ),
]
