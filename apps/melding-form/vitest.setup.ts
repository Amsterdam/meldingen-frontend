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
  const t = Object.assign((key: string) => key, { rich: (key: string) => key })

  return {
    ...actual,
    useTranslations: () => t,
  }
})

vi.mock('next-intl/server', async () => ({
  getTranslations: () => (key: string) => key,
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
