import type { Mock } from 'vitest'

import { cookies } from 'next/headers'
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

export { mockCookies }
