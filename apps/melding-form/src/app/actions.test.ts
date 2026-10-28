import type { Mock } from 'vitest'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { vi } from 'vitest'

import { clearSession } from './actions'
import { COOKIES } from '~/constants'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

const mockCookieStore = (cookieNames: string[]) => {
  const cookieStore = {
    delete: vi.fn(),
    has: (name: string) => cookieNames.includes(name),
  }

  ;(cookies as Mock).mockReturnValue(cookieStore)

  return cookieStore
}

describe('clearSession', () => {
  it('deletes all cookies and redirects to the home page when there is a session', async () => {
    const cookieStore = mockCookieStore([COOKIES.ID, COOKIES.TOKEN])

    await clearSession()

    Object.values(COOKIES).forEach((cookie) => {
      expect(cookieStore.delete).toHaveBeenCalledWith(cookie)
    })
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('does nothing when there is no session', async () => {
    const cookieStore = mockCookieStore([])

    await clearSession()

    expect(cookieStore.delete).not.toHaveBeenCalled()
    expect(redirect).not.toHaveBeenCalled()
  })
})
