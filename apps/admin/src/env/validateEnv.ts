import * as z from 'zod'

import { envSchema } from './schema.js'

export const validateEnv = (env: Record<string, unknown>) => {
  const parsed = z.safeParse(envSchema, env)

  if (!parsed.success) {
    throw new Error('Invalid client environment variables', { cause: parsed.error })
  }

  return Object.freeze(parsed.data)
}
