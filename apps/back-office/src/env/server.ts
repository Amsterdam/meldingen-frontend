import { validateServerEnv } from './validate'

if (typeof window !== 'undefined') {
  throw new Error(
    `server.ts should only be imported on the server side. \n Import env/validate directly if you need this outside of app code (tests, scripts)`,
  )
}

export const serverEnv = validateServerEnv()
