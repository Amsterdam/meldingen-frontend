import { PublicClientApplication } from '@azure/msal-browser'
import { msalAuthProvider } from 'ra-auth-msal'

import { msalConfig } from './authConfig'

export const myMSALObj = new PublicClientApplication(msalConfig)

export const authProvider = msalAuthProvider({
  msalInstance: myMSALObj,
})
