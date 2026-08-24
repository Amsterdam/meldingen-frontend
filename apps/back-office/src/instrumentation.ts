export const register = async () => {
  const { validateClientEnv, validateServerEnv } = await import('./env/validate')
  validateServerEnv()
  validateClientEnv()
}
