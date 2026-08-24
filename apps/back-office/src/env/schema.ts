import * as z from 'zod/mini'

export const serverSchema = z
  .object({
    ENTRA_CLIENT_ID: z.optional(z.string()),
    ENTRA_CLIENT_SECRET: z.optional(z.string()),
    ENTRA_TENANT_ID: z.optional(z.string()),
    ENTRA_TOKEN_URL: z.optional(z.string()),

    KEYCLOAK_AUTH_URL: z.optional(z.string()),
    KEYCLOAK_CLIENT_ID: z.optional(z.string()),
    KEYCLOAK_CLIENT_SECRET: z.optional(z.string()),
    KEYCLOAK_ISSUER_URL: z.optional(z.string()),
    KEYCLOAK_JWKS_URL: z.optional(z.string()),
    KEYCLOAK_TOKEN_URL: z.optional(z.string()),
    KEYCLOAK_USERINFO_URL: z.optional(z.string()),

    NEXT_INTERNAL_BACKEND_BASE_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string(),
    TZ: z.optional(z.string()),
  })
  .check(
    z.superRefine((data, ctx) => {
      const allOrNoneGroups = [
        [
          'KEYCLOAK_AUTH_URL',
          'KEYCLOAK_CLIENT_ID',
          'KEYCLOAK_CLIENT_SECRET',
          'KEYCLOAK_ISSUER_URL',
          'KEYCLOAK_JWKS_URL',
          'KEYCLOAK_TOKEN_URL',
          'KEYCLOAK_USERINFO_URL',
        ],
        ['ENTRA_CLIENT_ID', 'ENTRA_CLIENT_SECRET', 'ENTRA_TENANT_ID', 'ENTRA_TOKEN_URL'],
      ] as const

      for (const group of allOrNoneGroups) {
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
    }),
  )

export const clientSchema = z.object({
  NEXT_PUBLIC_BACKEND_BASE_URL: z.string(),
  NEXT_PUBLIC_BASE_PATH: z.string(), //empty string allowed?
  NEXT_PUBLIC_MELDING_FORM_BASE_URL: z.string(),
})
