import * as z from 'zod'

import { clientSchema } from './schema.js'

export const validateClientEnv = (env: Record<string, unknown>) => {
  const parsed = z.safeParse(clientSchema, env)

  if (!parsed.success) {
    throw new Error('Invalid client environment variables', { cause: parsed.error })
  }

  return Object.freeze(parsed.data)
}
