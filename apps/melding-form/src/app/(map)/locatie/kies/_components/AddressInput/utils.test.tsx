import { http, HttpResponse } from 'msw'
import { useTranslations } from 'next-intl'

import type { AddressArgType, AddressListArgType } from './utils'

import { fetchAddressList, fetchAndSetAddress } from './utils'
import { PDOKReverse, PDOKSuggest } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

const defaultAddressArgs: AddressArgType = {
  coordinates: { lat: 52.37239126063553, lng: 4.900905743712159 },
  setAddress: vi.fn(),
  t: vi.fn((key) => key) as unknown as ReturnType<typeof useTranslations>,
}

describe('fetchAndSetAddress', () => {
  it('should return correct address', async () => {
    await fetchAndSetAddress(defaultAddressArgs)

    expect(defaultAddressArgs.setAddress).toHaveBeenCalledWith(PDOKReverse.response.docs[0].weergavenaam)
  })

  it('should handle error when fetching address fails', async () => {
    server.use(http.get(ENDPOINTS.PDOK_REVERSE, () => HttpResponse.json({}, { status: 500 })))

    await fetchAndSetAddress(defaultAddressArgs)

    expect(defaultAddressArgs.setAddress).toHaveBeenCalledWith('no-address')
  })
})

const defaultAddressListArgs: AddressListArgType = {
  setAddressList: vi.fn(),
  setShowListBox: vi.fn(),
  value: 'Nieuwmarkt',
}

describe('fetchAddressList', () => {
  it('should return address list', async () => {
    await fetchAddressList(defaultAddressListArgs)

    const result = PDOKSuggest.response.docs

    expect(defaultAddressListArgs.setAddressList).toHaveBeenCalledWith(result)
  })

  it('should not fetch address list when input value is less than 3 characters', async () => {
    const props: AddressListArgType = {
      ...defaultAddressListArgs,
      value: 'ab',
    }

    await fetchAddressList(props)

    expect(props.setShowListBox).toHaveBeenCalledWith(false)
    expect(props.setAddressList).toHaveBeenCalledWith([])
  })

  it('should handle error when fetching address list fails', async () => {
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
