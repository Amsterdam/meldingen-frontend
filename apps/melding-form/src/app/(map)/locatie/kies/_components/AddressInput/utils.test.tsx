import { http, HttpResponse } from 'msw'
import { useTranslations } from 'next-intl'

import type { Props } from './utils'

import { fetchAndSetAddress } from './utils'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

const defaultProps: Props = {
  coordinates: { lat: 52.37239126063553, lng: 4.900905743712159 },
  setAddress: vi.fn(),
  setNotificationType: vi.fn(),
  t: vi.fn() as unknown as ReturnType<typeof useTranslations>,
}

describe('fetchAndSetAddress', () => {
  it('should return correct address', async () => {
    await fetchAndSetAddress(defaultProps)

    expect(defaultProps.setAddress).toHaveBeenCalledWith('Nieuwmarkt 15, 1011JR Amsterdam')
  })

  it('should handle error when fetching address fails', async () => {
    server.use(http.get(ENDPOINTS.PDOK_REVERSE, () => HttpResponse.json({}, { status: 500 })))

    await fetchAndSetAddress(defaultProps)

    expect(defaultProps.setNotificationType).toHaveBeenCalledWith('pdok-reverse-coordinates-error')
  })
})
