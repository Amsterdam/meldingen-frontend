import { http, HttpResponse } from 'msw'

import { getPrimaryFormSummary } from './getPrimaryFormSummary'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

describe('getPrimaryFormSummary', () => {
  it('returns correct primary form summary', async () => {
    const result = await getPrimaryFormSummary('Er ligt hier veel afval op straat.')

    expect(result).toEqual({
      data: {
        description: 'Er ligt hier veel afval op straat.',
        key: 'primary',
        term: 'First question',
      },
    })
  })

  it('returns an error message when getStaticForm returns an error', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM, () => HttpResponse.json('Error message', { status: 500 })))

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Failed to fetch static forms.')
  })

  it('returns an error message when primary form id is not found', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM, () =>
        HttpResponse.json([
          {
            id: '123',
            type: 'not-primary',
          },
        ]),
      ),
    )

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Primary form id not found.')
  })

  it('returns an error message when getStaticFormByStaticFormId returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const testFunction = async () => await getPrimaryFormSummary('')

    await expect(testFunction).rejects.toThrowError('Failed to fetch primary form data.')
  })
})
