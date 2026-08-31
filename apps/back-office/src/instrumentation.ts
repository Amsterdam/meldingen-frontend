export const register = async () => {
  const { validateAuthEnv, validateClientEnv, validateServerEnv } = await import('./env/validate')

  validateServerEnv()
  validateAuthEnv()
  validateClientEnv()
}
