import { http, HttpResponse } from 'msw'

import type { AddressListArgType } from './fetchAddressList'

import { fetchAddressList } from './fetchAddressList'
import { PDOKSuggest } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const defaultAddressListArgs: AddressListArgType = {
  setAddressList: vi.fn(),
  setShowListBox: vi.fn(),
  value: 'Nieuwmarkt',
}

describe('fetchAddressList', () => {
  it('returns address list', async () => {
    await fetchAddressList(defaultAddressListArgs)

    const result = PDOKSuggest.response.docs

    expect(defaultAddressListArgs.setAddressList).toHaveBeenCalledWith(result)
  })

  it('does not fetch address list when input value is less than 3 characters', async () => {
    const props: AddressListArgType = {
      ...defaultAddressListArgs,
      value: 'ab',
    }

    await fetchAddressList(props)

    expect(props.setShowListBox).toHaveBeenCalledWith(false)
    expect(props.setAddressList).toHaveBeenCalledWith([])
  })

  it('handles error when fetching address list fails', async () => {
    server.use(http.get(ENDPOINTS.PDOK_SUGGEST, () => HttpResponse.json({}, { status: 500 })))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await fetchAddressList(defaultAddressListArgs)

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Unable to fetch address suggestions from PDOK',
      }),
    )

    consoleSpy.mockRestore()
  })
})
