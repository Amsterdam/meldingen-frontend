import type { BrowserContext, Page, PlaywrightWorkerOptions } from '@playwright/test'

import { chromium, expect, firefox, webkit } from '@playwright/test'
import { parentPort, workerData } from 'node:worker_threads'

export type LoginOptions = {
  baseURL: string
  browserName: PlaywrightWorkerOptions['browserName']
  password: string
  username: string
}

export const loginWithKeycloak = async (page: Page, baseURL: string, username: string, password: string) => {
  const appURL = `${baseURL.replace(/\/$/, '')}/`
  const callbackURL = new URL('e2e-nonexistent-page', appURL).href

  await page.goto(`${appURL}api/auth/signin/keycloak?${new URLSearchParams({ callbackUrl: callbackURL })}`)
  await page.getByRole('button', { name: /sign in with keycloak/i }).click()
  await page.getByRole('textbox', { name: /username|email|gebruikersnaam|e-mailadres/i }).fill(username)
  await page.getByLabel(/^\s*(password|wachtwoord)\s*$/i).fill(password)
  await page.getByRole('button', { name: /^(sign in|log in|inloggen|aanmelden)$/i }).click()
  await expect(page).toHaveURL(callbackURL)

  const response = await page.request.get(`${appURL}api/auth/session`)

  expect(response.ok()).toBe(true)

  const session = await response.json()

  expect(typeof session.accessToken).toBe('string')
  expect(Boolean(session.accessToken)).toBe(true)
  expect(session.error).toBeUndefined()
}

if (parentPort) {
  const { baseURL, browserName, password, username }: LoginOptions = workerData
  const browser = await { chromium, firefox, webkit }[browserName].launch()
  let storageState: Awaited<ReturnType<BrowserContext['storageState']>>

  try {
    const context = await browser.newContext()
    const page = await context.newPage()

    await loginWithKeycloak(page, baseURL, username, password)
    storageState = await context.storageState()
  } catch (error) {
    // Login failures must not put credential values into test errors or traces.
    const message = error instanceof Error ? error.message : 'Back Office Keycloak login failed'

    throw new Error(message.replaceAll(password, '[redacted]').replaceAll(username, '[redacted]'))
  } finally {
    await browser.close()
  }

  parentPort.postMessage(storageState)
}
