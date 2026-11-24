import type { BrowserContext } from '@playwright/test'

import { test as base } from '@playwright/test'
import { Worker } from 'node:worker_threads'

import type { LoginOptions } from './loginWithKeycloak'

export { expect } from '@playwright/test'

export const test = base.extend({
  storageState: async ({ baseURL, browserName }, provideStorageState) => {
    if (!baseURL) throw new Error('The Back Office project must configure a baseURL')

    const isLocal = !process.env.PLAYWRIGHT_BACK_OFFICE_BASE_URL
    const username = process.env.PLAYWRIGHT_USERNAME ?? (isLocal ? 'meldingen_user' : undefined)
    const password = process.env.PLAYWRIGHT_PASSWORD ?? (isLocal ? 'password' : undefined)

    if (!username || !password) {
      throw new Error('Back Office tests require non-empty PLAYWRIGHT_USERNAME and PLAYWRIGHT_PASSWORD')
    }

    // A separate runtime keeps credential entry outside Playwright's runner instrumentation.
    const worker = new Worker(new URL('./loginWithKeycloak.ts', import.meta.url), {
      workerData: { baseURL, browserName, password, username } satisfies LoginOptions,
    })

    try {
      const storageState = await new Promise<Awaited<ReturnType<BrowserContext['storageState']>>>((resolve, reject) => {
        worker.once('message', resolve)
        worker.once('error', reject)
        worker.once('exit', (code) => {
          reject(new Error(`Back Office authentication worker exited without returning a session (code ${code})`))
        })
      })

      await provideStorageState(storageState)
    } finally {
      await worker.terminate()
    }
  },
})
