import { getAddressFromCoordinates } from './utils'

describe('getAddressFromCoordinates', () => {
  it('should return correct address', async () => {
    const coordinates = { lat: 52.37239126063553, lng: 4.900905743712159 }
    const result = await getAddressFromCoordinates(coordinates)

    expect(result).toEqual('Nieuwmarkt 15, 1011JR Amsterdam')
  })
})
