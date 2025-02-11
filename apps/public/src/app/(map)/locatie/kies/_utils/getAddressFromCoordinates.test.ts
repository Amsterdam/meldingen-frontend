import { http, HttpResponse } from 'msw'

import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import { server } from 'apps/public/src/mocks/node'

import { getAddressFromCoordinates } from './getAddressFromCoordinates'

describe('getAddressFromCoordinates', () => {
  it('should return correct address', async () => {
    const coordinates = { lat: 52.37239126063553, lng: 4.900905743712159 }
    const result = await getAddressFromCoordinates(coordinates)

    expect(result).toEqual({
      id: 'adr-758e934b8651217819abcf0e60a45b39',
      weergave_naam: 'Nieuwmarkt 15, 1011JR Amsterdam',
    })
  })

  it('should return "Locatie pin op kaart" when PDOK cannot find a address (e.g. when clicked on water)', async () => {
    server.use(
      http.get(ENDPOINTS.PDOK_REVERSE, () =>
        HttpResponse.json({
          response: {
            numFound: 0,
            docs: [],
          },
        }),
      ),
    )

    const coordinates = { lat: 52.381387987672596, lng: 4.931926012164198 }
    const result = await getAddressFromCoordinates(coordinates)

    expect(result).toEqual({
      id: undefined,
      weergave_naam: 'Locatie pin op kaart',
    })
  })
})
