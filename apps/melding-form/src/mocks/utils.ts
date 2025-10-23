import { cookies } from 'next/headers'
import { Mock } from 'vitest'
import { vi } from 'vitest'

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
  mockCookies({ meldingen_id: id, meldingen_token: token })
}

export { mockCookies, mockIdAndTokenCookies }
