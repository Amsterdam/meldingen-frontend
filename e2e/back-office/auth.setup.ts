import { test as setup } from '@playwright/test'
import { resolve } from 'node:path'

import { loginWithKeycloak } from './loginWithKeycloak'

setup('authenticate Back Office', async ({ baseURL, context, page }) => {
  if (!baseURL) throw new Error('The Back Office project must configure a baseURL')

  const username = process.env.PLAYWRIGHT_USERNAME
  const password = process.env.PLAYWRIGHT_PASSWORD

  if (!username || !password) {
    throw new Error('Deployed Back Office tests require PLAYWRIGHT_USERNAME and PLAYWRIGHT_PASSWORD')
  }

  await loginWithKeycloak(page, baseURL, username, password)

  await context.storageState({ path: resolve(import.meta.dirname, '../playwright/.auth/back-office.json') })
})
