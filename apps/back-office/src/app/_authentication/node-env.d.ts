// types/node-env.d.ts
declare namespace NodeJS {
  export interface ProcessEnv {
    CLIENT_ID: string
    CLIENT_SECRET: string
    ISSUER_URL: string
    AUTH_URL: string
    JWKS_URL: string
    TOKEN_URL: string
    USERINFO_URL: string
  }
}
