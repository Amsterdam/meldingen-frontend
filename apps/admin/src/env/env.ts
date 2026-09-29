import { validateEnv } from './validateEnv.ts'

export const env = validateEnv(import.meta.env)
