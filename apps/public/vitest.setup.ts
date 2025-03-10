/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom/vitest'
import { beforeAll, afterEach, afterAll } from 'vitest'

import { server } from './src/mocks/node'

// In our unit tests, we use the translation key instead of the real translation.
// We mock useTranslations and getTranslations to return a function (the 't' function in our code)
// that just returns the key
vi.mock('next-intl', async () => {
  const actual = (await vi.importActual('next-intl')) as any

  return {
    ...actual,
    useTranslations: () => {
      const t = (key: string) => key
      t.rich = (key: string) => key
      return t
    },
  }
})

vi.mock('next-intl/server', async () => ({
  getTranslations: () => (key: string) => key,
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
