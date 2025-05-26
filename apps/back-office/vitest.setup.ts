/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { server } from './src/mocks/node'

// In our unit tests, we use the translation key instead of the real translation.
// We mock useTranslations and getTranslations to return a function (the 't' function in our code)
// that just returns the key
vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl')

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

// We use getServerSession and redirect in our authentication setup, which used in most of our server components.
// Therefore, we globally mock them in the vitest setup file.
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => Promise.resolve({})),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
