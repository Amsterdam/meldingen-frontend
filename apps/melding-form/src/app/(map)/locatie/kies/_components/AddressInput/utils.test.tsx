import { http, HttpResponse } from 'msw'
import { useTranslations } from 'next-intl'

import type { PropsAddress, PropsAddressList } from './utils'

import { fetchAddressList, fetchAndSetAddress } from './utils'
import { PDOKSuggest } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

const defaultPropsAddress: PropsAddress = {
  coordinates: { lat: 52.37239126063553, lng: 4.900905743712159 },
  setAddress: vi.fn(),
  setNotificationType: vi.fn(),
  t: vi.fn() as unknown as ReturnType<typeof useTranslations>,
}

describe('fetchAndSetAddress', () => {
  it('should return correct address', async () => {
    await fetchAndSetAddress(defaultPropsAddress)

    expect(defaultPropsAddress.setAddress).toHaveBeenCalledWith('Nieuwmarkt 15, 1011JR Amsterdam')
  })

  it('should handle error when fetching address fails', async () => {
    server.use(http.get(ENDPOINTS.PDOK_REVERSE, () => HttpResponse.json({}, { status: 500 })))

    await fetchAndSetAddress(defaultPropsAddress)

    expect(defaultPropsAddress.setNotificationType).toHaveBeenCalledWith('pdok-reverse-coordinates-error')
  })
})

const defaultPropsAddressList: PropsAddressList = {
  setAddressList: vi.fn(),
  setErrorMessage: vi.fn(),
  setShowListBox: vi.fn(),
  t: vi.fn((key) => key) as unknown as ReturnType<typeof useTranslations>,
  value: 'Nieuwmarkt',
}

describe('fetchAddressList', () => {
  it('should return address list', async () => {
    await fetchAddressList(defaultPropsAddressList)

    const result = PDOKSuggest.response.docs.map((address) => {
      return {
        centroide_ll: address.centroide_ll,
        id: address.id,
        weergave_naam: address.weergavenaam,
      }
    })

    expect(defaultPropsAddressList.setAddressList).toHaveBeenCalledWith(result)
  })

  it('should not fetch address list when input value is less than 3 characters', async () => {
    const props: PropsAddressList = {
      ...defaultPropsAddressList,
      value: 'ab',
    }

    await fetchAddressList(props)

    expect(props.setShowListBox).toHaveBeenCalledWith(false)
    expect(props.setAddressList).toHaveBeenCalledWith([])
  })

  it('should handle error when fetching address list fails', async () => {
    server.use(http.get(ENDPOINTS.PDOK_SUGGEST, () => HttpResponse.json({}, { status: 500 })))

    await fetchAddressList(defaultPropsAddressList)

    expect(defaultPropsAddressList.setErrorMessage).toHaveBeenCalledWith('pdok-failed-list')
  })
})
