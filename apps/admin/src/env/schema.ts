import * as z from 'zod'

const authProviderGroups = [
  ['VITE_KEYCLOAK_BASE_URL', 'VITE_KEYCLOAK_REALM', 'VITE_KEYCLOAK_CLIENT_ID'],
  ['VITE_ENTRA_APP_BASE_URL', 'VITE_ENTRA_AUTHORITY', 'VITE_ENTRA_CLIENT_ID'],
] as const

const optionalNonEmptyString = z.string().trim().min(1).optional()

const authShape = {
  VITE_ENTRA_APP_BASE_URL: z.url().optional(),
  VITE_ENTRA_AUTHORITY: optionalNonEmptyString,
  VITE_ENTRA_CLIENT_ID: optionalNonEmptyString,

  VITE_KEYCLOAK_BASE_URL: z.url().optional(),
  VITE_KEYCLOAK_CLIENT_ID: optionalNonEmptyString,
  VITE_KEYCLOAK_REALM: optionalNonEmptyString,
}

const authCheck = (data: Record<string, string | undefined>, ctx: z.RefinementCtx) => {
  const hasAuthConfigured = authProviderGroups.some((group) => group.every((key) => data[key] !== undefined))

  if (!hasAuthConfigured) {
    ctx.addIssue({
      code: 'custom',
      message:
        'No authentication has been configured. Either all Keycloak environment variables or all Entra environment variables must be provided',
    })

    return
  }

  for (const group of authProviderGroups) {
    const provided = group.filter((key) => data[key] !== undefined)

    if (provided.length > 0 && provided.length < group.length) {
      for (const key of group) {
        if (data[key] !== undefined) continue

        ctx.addIssue({
          code: 'custom',
          message: `${key} is required when any of ${group.join(', ')} are provided`,
          path: [key],
        })
      }
    }
  }
}

export const envSchema = z
  .object({
    VITE_BACKEND_BASE_URL: z.url(),
    ...authShape,
  })
  .superRefine(authCheck)
