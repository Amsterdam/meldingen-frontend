import { cookies } from 'next/headers'
import { Mock } from 'vitest'
import { vi } from 'vitest'

const mockCookies = (keyValuePairs: Record<string, string | undefined>) => {
  ;(cookies as Mock).mockReturnValue({
    get: (name: string) => {
      if (keyValuePairs[name]) return { value: keyValuePairs[name] }
      return undefined
    },
    set: vi.fn(),
  })
}

const mockIdAndTokenCookies = (id = '123', token = 'test-token') => {
  mockCookies({ id, token })
}

export { mockCookies, mockIdAndTokenCookies }
