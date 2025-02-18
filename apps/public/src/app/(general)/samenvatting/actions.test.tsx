import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import { postSummaryForm } from './actions'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postSummaryForm', () => {
  const mockCookies = {
    get: vi.fn(),
    delete: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('returns undefined if meldingId or token is missing', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const result = await postSummaryForm()

    expect(result).toBeUndefined()
  })

  it('deletes location, token, and lastPanelPath cookies and redirects to /bedankt', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'test-token' }
      }
      return undefined
    })

    await postSummaryForm()

    expect(mockCookies.delete).toHaveBeenCalledWith('location')
    expect(mockCookies.delete).toHaveBeenCalledWith('token')
    expect(mockCookies.delete).toHaveBeenCalledWith('lastPanelPath')
    expect(redirect).toHaveBeenCalledWith('/bedankt')
  })
})
