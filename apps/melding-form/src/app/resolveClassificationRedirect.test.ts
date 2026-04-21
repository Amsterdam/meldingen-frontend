import { http, HttpResponse } from 'msw'

import { TOP_ANCHOR_ID } from '../constants'
import { form } from '../mocks/data'
import { ENDPOINTS } from '../mocks/endpoints'
import { server } from '../mocks/node'
import { resolveClassificationRedirect } from './resolveClassificationRedirect'

describe('resolveClassificationRedirect', () => {
  it('returns an error when getFormClassificationByClassificationId returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const result = await resolveClassificationRedirect(1, 'token', 1)

    expect(result).toEqual({ error: 'Error message', type: 'error' })
  })

  it('does not return an error if the error is a 404 Not Found', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json('Not Found', { status: 404 }),
      ),
    )

    const result = await resolveClassificationRedirect(1, 'token', 1)

    expect(result).toEqual({ type: 'redirect', url: `/locatie#${TOP_ANCHOR_ID}` })
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ANSWER_QUESTIONS, () =>
        HttpResponse.json('Error message', { status: 404 }),
      ),
    )

    const result = await resolveClassificationRedirect(1, 'token', 1)

    expect(result).toEqual({ error: 'Error message', type: 'error' })
  })

  it('redirects to /locatie when there are no additional questions', async () => {
    const result = await resolveClassificationRedirect(1, 'token', 1)

    expect(result).toEqual({ type: 'redirect', url: `/locatie#${TOP_ANCHOR_ID}` })
  })

  it('redirects to /aanvullende-vragen when there are additional questions', async () => {
    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(form)))

    const result = await resolveClassificationRedirect(1, 'token', 2)

    expect(result).toEqual({ type: 'redirect', url: `/aanvullende-vragen/2/page1#${TOP_ANCHOR_ID}` })
  })

  it('redirects to /locatie when there is no classification', async () => {
    const result = await resolveClassificationRedirect(1, 'token')

    expect(result).toEqual({ type: 'redirect', url: `/locatie#${TOP_ANCHOR_ID}` })
  })
})
