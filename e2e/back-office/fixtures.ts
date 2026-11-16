import { test as base } from '@playwright/test'

import { loginWithKeycloak } from './loginWithKeycloak'

export { expect } from '@playwright/test'

export const test = base.extend({
  storageState: async ({ baseURL, browser }, provideStorageState) => {
    if (!baseURL) throw new Error('The Back Office project must configure a baseURL')

    const isLocal = !process.env.PLAYWRIGHT_BACK_OFFICE_BASE_URL
    const username = process.env.PLAYWRIGHT_USERNAME ?? (isLocal ? 'meldingen_user' : undefined)
    const password = process.env.PLAYWRIGHT_PASSWORD ?? (isLocal ? 'password' : undefined)

    if (!username || !password) {
      throw new Error('Back Office tests require non-empty PLAYWRIGHT_USERNAME and PLAYWRIGHT_PASSWORD')
    }

    const context = await browser.newContext()

    try {
      const page = await context.newPage()

      await loginWithKeycloak(page, baseURL, username, password)
      await provideStorageState(await context.storageState())
    } finally {
      await context.close()
    }
  },
})
