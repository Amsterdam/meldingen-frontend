import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { getAddressFromCoordinates } from './getAddressFromCoordinates'

const mockResponseData = {
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
}

describe('getAddressFromCoordinates', () => {
  it('should return correct address', async () => {
    const server = setupServer(
      http.get('https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse', () => HttpResponse.json(mockResponseData)),
    )

    server.listen()

    const coordinates = { lat: 52.37239126063553, lon: 4.900905743712159 }
    const result = await getAddressFromCoordinates(coordinates)

    expect(result).toEqual({
      id: 'adr-758e934b8651217819abcf0e60a45b39',
      weergave_naam: 'Nieuwmarkt 15, 1011JR Amsterdam',
    })
  })
})
