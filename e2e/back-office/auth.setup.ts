import { test as setup } from '@playwright/test'
import { encode } from 'next-auth/jwt'
import { resolve } from 'node:path'

import { loginWithKeycloak } from './loginWithKeycloak'

setup('authenticate Back Office', async ({ baseURL, context, page }) => {
  if (!baseURL) throw new Error('The Back Office project must configure a baseURL')

  if (process.env.PLAYWRIGHT_BACK_OFFICE_BASE_URL) {
    const username = process.env.PLAYWRIGHT_USERNAME
    const password = process.env.PLAYWRIGHT_PASSWORD

    if (!username || !password) {
      throw new Error('Deployed Back Office tests require PLAYWRIGHT_USERNAME and PLAYWRIGHT_PASSWORD')
    }

    await loginWithKeycloak(page, baseURL, username, password)
  } else {
    const secret = process.env.PLAYWRIGHT_AUTH_SECRET

    if (!secret) throw new Error('PLAYWRIGHT_AUTH_SECRET must be set by the Playwright configuration')

    const sessionToken = await encode({
      secret,
      token: { sub: 'playwright-smoke-test' },
    })

    await context.addCookies([
      {
        httpOnly: true,
        name: 'next-auth.session-token',
        sameSite: 'Lax',
        url: baseURL,
        value: sessionToken,
      },
    ])
  }

  await context.storageState({ path: resolve(import.meta.dirname, '../playwright/.auth/back-office.json') })
})
