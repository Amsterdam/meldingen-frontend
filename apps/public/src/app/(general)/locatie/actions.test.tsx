import { postMeldingByMeldingIdLocation } from '@meldingen/api-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import { postLocationForm } from './actions'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@meldingen/api-client', () => ({
  postMeldingByMeldingIdLocation: vi.fn(),
}))

describe('postLocationForm', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('returns undefined if coordinate, meldingId, or token is missing', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const formData = new FormData()
    const result = await postLocationForm(null, formData)

    expect(result).toEqual({ message: 'Vul een locatie in.' })
  })

  it('posts the location and redirects to /bijlage', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'test-token' }
      }
      return undefined
    })

    const formData = new FormData()
    formData.set('coordinate', JSON.stringify([4.895168, 52.370216]))

    await postLocationForm(null, formData)

    expect(postMeldingByMeldingIdLocation).toHaveBeenCalledWith({
      meldingId: 123,
      token: 'test-token',
      requestBody: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [4.895168, 52.370216],
        },
        properties: {},
      },
    })
    expect(redirect).toHaveBeenCalledWith('/bijlage')
  })

  it('returns an error message if an error occurs', async () => {
    const errorMessage = 'Test error'
    ;(postMeldingByMeldingIdLocation as Mock).mockRejectedValue(new Error(errorMessage))

    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'test-token' }
      }
      return undefined
    })

    const formData = new FormData()
    formData.set('coordinate', JSON.stringify([4.895168, 52.370216]))

    const result = await postLocationForm(null, formData)

    expect(result).toEqual({ message: errorMessage })
  })
})
