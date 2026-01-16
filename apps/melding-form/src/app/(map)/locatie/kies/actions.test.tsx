import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postCoordinatesAndAssets } from './actions'
import { COOKIES } from 'apps/melding-form/src/constants'
import { containerAssets } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockCookies } from 'apps/melding-form/src/mocks/utils'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postCoordinatesAndAssets', () => {
  const mockSetCookie = vi.fn()

  mockCookies({ [COOKIES.ID]: '123', [COOKIES.TOKEN]: 'test-token' }, mockSetCookie)

  it('sets the address from PDOK /free in cookies and redirects', async () => {
    const address = 'Amstel 1, Amsterdam'
    const coordinates = '{"lat":52.370216,"lng":4.895168}'

    const formData = new FormData()
    formData.set('address', address)
    formData.set('coordinates', coordinates)

    await postCoordinatesAndAssets({ selectedAssets: containerAssets }, undefined, formData)

    expect(mockSetCookie).toHaveBeenCalledWith(COOKIES.ADDRESS, address, { maxAge: 86400 })
    expect(redirect).toHaveBeenCalledWith('/locatie')
  })

  it('fetches coordinates from PDOK API if not provided', async () => {
    const address = 'Amstel 1, Amsterdam'

    const formData = new FormData()
    formData.set('address', address)

    await postCoordinatesAndAssets({ selectedAssets: [] }, undefined, formData)

    expect(mockSetCookie).toHaveBeenCalledWith(COOKIES.ADDRESS, address, { maxAge: 86400 })
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

    const result = await postCoordinatesAndAssets({ selectedAssets: [] }, undefined, formData)

    expect(result).toEqual({ errorMessage: 'errors.pdok-no-address-found' })
  })

  it('returns an error message if an error occurs', async () => {
    server.use(http.get(ENDPOINTS.PDOK_FREE, () => new HttpResponse(null, { status: 500 })))

    const formData = new FormData()
    formData.set('address', 'Amstel 1, Amsterdam')

    const result = await postCoordinatesAndAssets({ selectedAssets: [] }, undefined, formData)

    expect(result).toEqual({ errorMessage: 'errors.pdok-failed' })
  })

  it('returns an error message if no address is provided', async () => {
    const formData = new FormData()

    const result = await postCoordinatesAndAssets({ selectedAssets: [] }, undefined, formData)

    expect(result).toEqual({ errorMessage: 'errors.no-location' })
  })

  it('returns an error when postMeldingByMeldingIdAsset fails', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ASSET, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const address = 'Oudezijds Voorburgwal 300, Amsterdam'
    const coordinates = '{"lat":52.37065901,"lng":4.89367338}'

    const formData = new FormData()
    formData.set('address', address)
    formData.set('coordinates', coordinates)

    const result = await postCoordinatesAndAssets({ selectedAssets: containerAssets }, undefined, formData)

    expect(result).toEqual({ errorMessage: 'Error message' })
  })

  it('returns an error when patchMeldingByMeldingIdLocation fails', async () => {
    server.use(
      http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID_LOCATION, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const address = 'Oudezijds Voorburgwal 300, Amsterdam'
    const coordinates = '{"lat":52.37065901,"lng":4.89367338}'

    const formData = new FormData()
    formData.set('address', address)
    formData.set('coordinates', coordinates)

    const result = await postCoordinatesAndAssets({ selectedAssets: containerAssets }, undefined, formData)

    expect(result).toEqual({ errorMessage: 'Error message' })
  })
})
