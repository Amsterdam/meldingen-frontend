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
})
