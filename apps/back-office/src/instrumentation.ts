export const register = async () => {
  const { validateClientEnv, validateServerEnv } = await import('./env/validate')

  validateServerEnv()
  // TODO: Temporary commented out due to pipeline settings injecting both Entra & Keycloak env vars, which causes validation to fail.
  // validateAuthEnv()
  validateClientEnv()
}
