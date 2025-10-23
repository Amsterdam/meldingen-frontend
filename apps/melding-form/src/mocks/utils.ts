import { cookies } from 'next/headers'
import { Mock } from 'vitest'
import { vi } from 'vitest'

import { COOKIES } from '../constants'

const mockCookies = (keyValuePairs: Record<string, string | undefined>, set: () => void = vi.fn()) => {
  ;(cookies as Mock).mockReturnValue({
    get: (name: string) => {
      if (keyValuePairs[name] !== undefined) return { value: keyValuePairs[name] }
      return undefined
    },
    set,
  })
}

const mockIdAndTokenCookies = (id = '123', token = 'test-token') => {
  mockCookies({ [COOKIES.ID]: id, [COOKIES.TOKEN]: token })
}

export { mockCookies, mockIdAndTokenCookies }
