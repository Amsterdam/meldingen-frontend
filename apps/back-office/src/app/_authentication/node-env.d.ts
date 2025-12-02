// types/node-env.d.ts
declare namespace NodeJS {
  export interface ProcessEnv {
    AUTH_URL: string
    CLIENT_ID: string
    CLIENT_SECRET: string
    ENTRA_CLIENT_ID: string
    ENTRA_CLIENT_SECRET: string
    ENTRA_TENANT_ID: string
    ENTRA_TOKEN_URL: string
    ISSUER_URL: string
    JWKS_URL: string
    TOKEN_URL: string
    USERINFO_URL: string
  }
}
