import { validateClientEnv } from './validateEnv.ts'

export const clientEnv = validateClientEnv(import.meta.env)
