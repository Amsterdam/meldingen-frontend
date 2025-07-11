import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'

import { writeAddressAndCoordinateToCookie } from './actions'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('writeAddressAndCoordinateToCookie', () => {
  const mockCookies = {
    set: vi.fn(),
  }

  beforeEach(() => {
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('sets the form location data in cookies and redirects', async () => {
    const address = 'Oudezijds Voorburgwal 300, Amsterdam'
    const coordinates = '{"lat":52.37065901,"lng":4.89367338}'

    const formData = new FormData()
    formData.set('address', address)
    formData.set('coordinates', coordinates)

    await writeAddressAndCoordinateToCookie(null, formData)

    expect(mockCookies.set).toHaveBeenCalledWith(
      'location',
      JSON.stringify({
        name: address,
        coordinates: { lat: 52.37065901, lng: 4.89367338 },
      }),
    )
    expect(redirect).toHaveBeenCalledWith('/locatie')
  })

  it('fetches coordinate from PDOK API if not provided', async () => {
    const address = 'Amstel 1, Amsterdam'

    const formData = new FormData()
    formData.set('address', address)

    await writeAddressAndCoordinateToCookie(null, formData)

    expect(mockCookies.set).toHaveBeenCalledWith(
      'location',
      JSON.stringify({
        name: 'Amstel 1, Amsterdam',
        coordinates: { lat: 52.370216, lng: 4.895168 },
      }),
    )
    expect(redirect).toHaveBeenCalledWith('/locatie')
  })

  it('throws an error if no address is found by PDOK API', async () => {
    server.use(
      http.get(ENDPOINTS.PDOK_FREE, () =>
        HttpResponse.json({
          response: { docs: [] },
        }),
      ),
    )

    const address = 'Amstel 1, Amsterdam'

    const formData = new FormData()
    formData.set('address', address)

    const result = await writeAddressAndCoordinateToCookie(null, formData)

    expect(result).toEqual({ errorMessage: 'errors.pdok-no-address-found' })
  })

  it('returns an error message if an error occurs', async () => {
    server.use(http.get(ENDPOINTS.PDOK_FREE, () => new HttpResponse(null, { status: 500 })))

    const formData = new FormData()
    formData.set('address', 'Amstel 1, Amsterdam')

    const result = await writeAddressAndCoordinateToCookie(null, formData)

    expect(result).toEqual({ errorMessage: 'PDOK API error' })
  })

  it('returns an error message if no address is provided', async () => {
    const formData = new FormData()

    const result = await writeAddressAndCoordinateToCookie(null, formData)

    expect(result).toEqual({ errorMessage: 'errors.no-location' })
  })
})
