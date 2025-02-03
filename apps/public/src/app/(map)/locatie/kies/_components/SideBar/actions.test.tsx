import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import { server } from 'apps/public/src/mocks/node'

import { writeAddressAndCoordinateToCookie } from './actions'

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
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('sets the form location data in cookies and redirects', async () => {
    const address = 'Amstel 1, Amsterdam'
    const coordinate = '{"lat":52.370216,"lng":4.895168}'

    const formData = new FormData()
    formData.set('address', address)
    formData.set('coordinate', coordinate)

    await writeAddressAndCoordinateToCookie(null, formData)

    expect(mockCookies.set).toHaveBeenCalledWith(
      'location',
      JSON.stringify({
        name: address,
        coordinate: { lat: 52.370216, lng: 4.895168 },
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
        coordinate: { lat: 52.370216, lng: 4.895168 },
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

    expect(result).toEqual({ message: 'Geen adres gevonden. Vul een adres in als Amstel 1, Amsterdam.' })
  })

  it('returns an error message if an error occurs', async () => {
    server.use(http.get(ENDPOINTS.PDOK_FREE, () => HttpResponse.error()))

    const formData = new FormData()
    formData.set('address', 'Amstel 1, Amsterdam')

    const result = await writeAddressAndCoordinateToCookie(null, formData)

    expect(result).toEqual({ message: 'Failed to fetch' })
  })

  it('returns an error message if no address is provided', async () => {
    const formData = new FormData()

    const result = await writeAddressAndCoordinateToCookie(null, formData)

    expect(result).toEqual({ message: 'Vul een locatie in.' })
  })
})
