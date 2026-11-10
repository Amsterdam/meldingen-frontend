import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'

export const loginWithKeycloak = async (page: Page, baseURL: string, username: string, password: string) => {
  const appURL = `${baseURL.replace(/\/$/, '')}/`
  const callbackURL = new URL('e2e-nonexistent-page', appURL).href

  await page.goto(`${appURL}api/auth/signin/keycloak?${new URLSearchParams({ callbackUrl: callbackURL })}`)
  await page.getByRole('button', { name: /sign in with keycloak/i }).click()
  await page.getByRole('textbox', { name: /username|email|gebruikersnaam|e-mailadres/i }).fill(username)
  await page.getByLabel(/^(password|wachtwoord)$/i).fill(password)
  await page.getByRole('button', { name: /^(sign in|log in|inloggen|aanmelden)$/i }).click()
  await expect(page).toHaveURL(callbackURL)

  const response = await page.request.get(`${appURL}api/auth/session`)

  expect(response.ok()).toBe(true)

  const session = await response.json()

  expect(typeof session.accessToken).toBe('string')
  expect(Boolean(session.accessToken)).toBe(true)
  expect(session.error).toBeUndefined()
}
