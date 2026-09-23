import { validateClientEnv } from './validateClientEnv.ts'

export const clientEnv = validateClientEnv(import.meta.env)
