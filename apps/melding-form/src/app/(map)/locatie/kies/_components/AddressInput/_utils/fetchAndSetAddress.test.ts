import type { useTranslations } from 'next-intl'

import { http, HttpResponse } from 'msw'

import type { AddressArgType } from './fetchAndSetAddress'

import { fetchAndSetAddress } from './fetchAndSetAddress'
import { PDOKReverse } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const defaultAddressArgs: AddressArgType = {
  coordinates: { lat: 52.37239126063553, lng: 4.900905743712159 },
  setAddress: vi.fn(),
  t: vi.fn((key) => key) as unknown as ReturnType<typeof useTranslations>,
}

describe('fetchAndSetAddress', () => {
  it('returns correct address', async () => {
    await fetchAndSetAddress(defaultAddressArgs)

    expect(defaultAddressArgs.setAddress).toHaveBeenCalledWith(PDOKReverse.response.docs[0].weergavenaam)
  })

  it('handles error when fetching address fails', async () => {
    server.use(http.get(ENDPOINTS.PDOK_REVERSE, () => HttpResponse.json({}, { status: 500 })))

    await fetchAndSetAddress(defaultAddressArgs)

    expect(defaultAddressArgs.setAddress).toHaveBeenCalledWith('no-address')
  })
})
