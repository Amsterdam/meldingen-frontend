import { http, HttpResponse } from 'msw'

import { ENDPOINTS } from './endpoints'
import mockAdditionalQuestionsAnswerData from './mockAdditionalQuestionsAnswerData.json'
import mockContactFormData from './mockContactFormData.json'
import mockFormData from './mockFormData.json'
import mockMeldingData from './mockMeldingData.json'

export const handlers = [
  /** GET */
  http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => new HttpResponse()),

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

  http.get(ENDPOINTS.GET_STATIC_FORM, () =>
    HttpResponse.json([
      {
        id: '1',
        type: 'primary',
      },
      {
        id: '2',
        type: 'attachments',
      },
      {
        id: '3',
        type: 'contact',
      },
    ]),
  ),

  http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, ({ params }) => {
    if (params.staticFormId === '1') {
      return HttpResponse.json(mockFormData.components[0])
    }
    if (params.staticFormId === '2') {
      return HttpResponse.json(mockFormData.components[0])
    }
    if (params.staticFormId === '3') {
      return HttpResponse.json(mockContactFormData)
    }
    return undefined
  }),

  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json(mockMeldingData)),

  http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
    HttpResponse.json(mockAdditionalQuestionsAnswerData),
  ),

  /** POST */
  http.post(ENDPOINTS.POST_MELDING, () => HttpResponse.json({ id: 123, token: 'test-token', classification: 'Test' })),

  http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () => HttpResponse.json({ id: 42 })),

  http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_CONTACT, () => new HttpResponse()),

  http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_LOCATION, () => new HttpResponse()),

  /** PUT */
  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ADD_ATTACHMENTS, () => new HttpResponse()),

  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ADD_CONTACT_INFO, () => new HttpResponse()),

  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ANSWER_QUESTIONS, () => new HttpResponse()),

  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT_LOCATION, () => new HttpResponse()),

  http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_SUBMIT, () => new HttpResponse()),

  /** DELETE */
  http.delete(ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID, () => new HttpResponse()),
]
