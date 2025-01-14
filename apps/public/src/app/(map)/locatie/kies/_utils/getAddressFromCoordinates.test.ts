import { server } from '../../../../../mocks/node'

import { getAddressFromCoordinates } from './getAddressFromCoordinates'

describe('getAddressFromCoordinates', () => {
  it('should return correct address', async () => {
    server.listen()

    const coordinates = { lat: 52.37239126063553, lon: 4.900905743712159 }
    const result = await getAddressFromCoordinates(coordinates)

    expect(result).toEqual('Nieuwmarkt 15, 1011JR Amsterdam')

    server.close()
  })
})
