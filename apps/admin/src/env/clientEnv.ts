import { validateClientEnv } from './validateClientEnv.ts'

// Accommodates tests env stubbing
export const getClientEnv = () => validateClientEnv(import.meta.env)

export const clientEnv = getClientEnv()
