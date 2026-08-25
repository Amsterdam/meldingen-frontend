import { validateClientEnv } from './validate'

// Accomodates for tests env stubbing
export const getClientEnv = () => validateClientEnv()

export const clientEnv = getClientEnv()
