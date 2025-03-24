// types/node-env.d.ts
declare namespace NodeJS {
  export interface ProcessEnv {
    CLIENT_ID: string
    CLIENT_SECRET: string
    AUTH_ISSUER: string
  }
}
