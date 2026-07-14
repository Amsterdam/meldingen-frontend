/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { client } from '@meldingen/api-client'

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

// We use getServerSession and redirect in our authentication setup, which is used in most of our server components.
// Therefore, we globally mock them in the vitest setup file.
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => Promise.resolve({})),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// We mock matchMedia here because it is used in the Amsterdam Design System Header component
// We do not really use most of the matchMedia functionality, so we use a simple mock.
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
})

// Configure the API client for the test environment.
client.setConfig({ baseUrl: 'http://localhost:3000' })

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
