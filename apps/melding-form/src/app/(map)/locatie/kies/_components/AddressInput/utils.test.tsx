import { http, HttpResponse } from 'msw'
import { useTranslations } from 'next-intl'

import type { AddressArgType, AddressListArgType } from './utils'

import { fetchAddressList, fetchAndSetAddress } from './utils'
import { PDOKSuggest } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

const defaultPropsAddress: AddressArgType = {
  coordinates: { lat: 52.37239126063553, lng: 4.900905743712159 },
  setAddress: vi.fn(),
  t: vi.fn((key) => key) as unknown as ReturnType<typeof useTranslations>,
}

describe('fetchAndSetAddress', () => {
  it('should return correct address', async () => {
    await fetchAndSetAddress(defaultPropsAddress)

    expect(defaultPropsAddress.setAddress).toHaveBeenCalledWith('Nieuwmarkt 15, 1011JR Amsterdam')
  })

  it('should handle error when fetching address fails', async () => {
    server.use(http.get(ENDPOINTS.PDOK_REVERSE, () => HttpResponse.json({}, { status: 500 })))

    await fetchAndSetAddress(defaultPropsAddress)

    expect(defaultPropsAddress.setAddress).toHaveBeenCalledWith('no-address')
  })
})

const defaultPropsAddressList: AddressListArgType = {
  setAddressList: vi.fn(),
  setShowListBox: vi.fn(),
  value: 'Nieuwmarkt',
}

describe('fetchAddressList', () => {
  it('should return address list', async () => {
    await fetchAddressList(defaultPropsAddressList)

    const result = PDOKSuggest.response.docs

    expect(defaultPropsAddressList.setAddressList).toHaveBeenCalledWith(result)
  })

  it('should not fetch address list when input value is less than 3 characters', async () => {
    const props: AddressListArgType = {
      ...defaultPropsAddressList,
      value: 'ab',
    }

    await fetchAddressList(props)

    expect(props.setShowListBox).toHaveBeenCalledWith(false)
    expect(props.setAddressList).toHaveBeenCalledWith([])
  })

  it('should handle error when fetching address list fails', async () => {
    server.use(http.get(ENDPOINTS.PDOK_SUGGEST, () => HttpResponse.json({}, { status: 500 })))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await fetchAddressList(defaultPropsAddressList)

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Unable to fetch address suggestions from PDOK',
      }),
    )

    consoleSpy.mockRestore()
  })
})
