import { http, HttpResponse } from 'msw'

import { getMeldingData } from './getMeldingData'
import { melding } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

const mockMeldingId = '88'
const mockToken = 'test-token'

describe('getMeldingData', () => {
  it('should return correct melding summary', async () => {
    const result = await getMeldingData(mockMeldingId, mockToken)

    expect(result).toEqual(melding)
  })

  it('should return an error message when error is returned', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json('Error message', { status: 500 })),
    )

    const testFunction = async () => await getMeldingData(mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Failed to fetch melding data.')
  })

  it('should return an error message when melding data is not found', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => new HttpResponse()))

    const testFunction = async () => await getMeldingData(mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Melding data not found.')
  })
})
