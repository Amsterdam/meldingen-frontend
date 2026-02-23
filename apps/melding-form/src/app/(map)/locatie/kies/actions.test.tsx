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

  beforeEach(() => {
    mockCookies({ [COOKIES.ID]: '123', [COOKIES.TOKEN]: 'test-token' }, mockSetCookie)
  })

  it('redirects to /cookie-storing if id or token cookies are missing', async () => {
    mockCookies({}) // No cookies

    const formData = new FormData()
    formData.set('address', 'Amstel 1, Amsterdam')

    await postCoordinatesAndAssets({ selectedAssets: [] }, undefined, formData)

    expect(redirect).toHaveBeenCalledWith('/cookie-storing')
  })

  it('posts each selected asset with the correct body', async () => {
    const capturedBodies: unknown[] = []

    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ASSET, async ({ request }) => {
        capturedBodies.push(await request.json())
        return HttpResponse.json()
      }),
    )

    const formData = new FormData()
    formData.set('address', 'Amstel 1, Amsterdam')

    await postCoordinatesAndAssets({ selectedAssets: containerAssets }, undefined, formData)

    expect(capturedBodies).toHaveLength(2)
    expect(capturedBodies[0]).toEqual({ asset_type_id: 1, external_id: 'container.1' })
    expect(capturedBodies[1]).toEqual({ asset_type_id: 1, external_id: 'container.2' })
    expect(redirect).toHaveBeenCalledWith('/locatie')
  })

  it('fetches coordinates from PDOK API', async () => {
    const address = 'Amstel 1, Amsterdam'

    const formData = new FormData()
    formData.set('address', address)

    await postCoordinatesAndAssets({ selectedAssets: [] }, undefined, formData)

    expect(mockSetCookie).toHaveBeenCalledWith(COOKIES.ADDRESS, address, { maxAge: 86400 })
    expect(redirect).toHaveBeenCalledWith('/locatie')
  })

  it('returns an error message if PDOK free returns an error', async () => {
    server.use(http.get(ENDPOINTS.PDOK_FREE, () => new HttpResponse(null, { status: 500 })))

    const formData = new FormData()
    formData.set('address', 'Amstel 1, Amsterdam')

    const result = await postCoordinatesAndAssets({ selectedAssets: [] }, undefined, formData)

    expect(result).toEqual({ errorMessage: 'errors.pdok-failed' })
  })

  it('returns an error message if no address is found by PDOK free', async () => {
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

  it('returns an error message if PDOK free does not return coordinates', async () => {
    server.use(
      http.get(ENDPOINTS.PDOK_FREE, () =>
        HttpResponse.json({
          response: { docs: [{ centroide_ll: 'not-a-coordinate', weergavenaam: 'Amstel 1, Amsterdam' }] },
        }),
      ),
    )

    const address = 'Amstel 1, Amsterdam'

    const formData = new FormData()
    formData.set('address', address)

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

    const formData = new FormData()
    formData.set('address', address)

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

    const formData = new FormData()
    formData.set('address', address)

    const result = await postCoordinatesAndAssets({ selectedAssets: containerAssets }, undefined, formData)

    expect(result).toEqual({ errorMessage: 'Error message' })
  })
})
