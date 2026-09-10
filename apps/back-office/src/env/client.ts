import { validateClientEnv } from './validate'

// Accommodates tests env stubbing
export const getClientEnv = () => validateClientEnv()

export const clientEnv = getClientEnv()
