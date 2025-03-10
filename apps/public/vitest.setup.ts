/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom/vitest'
import { useTranslations } from 'next-intl'
import type { Mock } from 'vitest'
import { beforeAll, afterEach, afterAll } from 'vitest'

import { server } from './src/mocks/node'

vi.mock('next-intl', async () => {
  const actual = (await vi.importActual('next-intl')) as any

  return {
    ...actual,
    useTranslations: vi.fn(),
  }
})

beforeAll(async () => {
  // In our unit tests, we use the translation key instead of the real translation.
  // We mock useTranslations to return a function (the 't' function in our code) that just returns the key
  ;(useTranslations as Mock).mockImplementation(() => (key: string) => key)
})

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
