// v8 ignore start
export const register = async () => {
  const { validateClientEnv, validateServerEnv } = await import('./env/validate')

  validateServerEnv()
  validateClientEnv()
}
//v8 ignore end
