// types/node-env.d.ts
declare namespace NodeJS {
  export interface ProcessEnv {
    ENTRA_CLIENT_ID: string
    ENTRA_CLIENT_SECRET: string
    ENTRA_TENANT_ID: string
    ENTRA_TOKEN_URL: string
    KEYCLOAK_AUTH_URL: string
    KEYCLOAK_CLIENT_ID: string
    KEYCLOAK_CLIENT_SECRET: string
    KEYCLOAK_ISSUER_URL: string
    KEYCLOAK_JWKS_URL: string
    KEYCLOAK_TOKEN_URL: string
    KEYCLOAK_USERINFO_URL: string
  }
}
