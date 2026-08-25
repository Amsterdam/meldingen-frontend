import * as z from 'zod/mini'

import { authSchema, clientSchema, serverSchema } from './schema'

export const validateAuthEnv = () => {
  const parsed = z.safeParse(authSchema, process.env)

  if (!parsed.success) {
    throw new Error('Invalid authentication environment variables', { cause: parsed.error })
  }

  return Object.freeze(parsed.data)
}

export const validateServerEnv = () => {
  const parsed = z.safeParse(serverSchema, process.env)

  if (!parsed.success) {
    throw new Error('Invalid server environment variables', { cause: parsed.error })
  }

  return Object.freeze(parsed.data)
}

export const validateClientEnv = () => {
  const parsed = z.safeParse(clientSchema, {
    NEXT_PUBLIC_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
    NEXT_PUBLIC_MELDING_FORM_BASE_URL: process.env.NEXT_PUBLIC_MELDING_FORM_BASE_URL,
  })

  if (!parsed.success) {
    throw new Error('Invalid client environment variables', { cause: parsed.error })
  }

  return Object.freeze(parsed.data)
}
