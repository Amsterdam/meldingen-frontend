import { expect, test } from '@playwright/test'

test('shows the cookie error page with a restart link', async ({ page }) => {
  const response = await page.goto('cookie-storing')

  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle('Er is iets mis gegaan - Gemeente Amsterdam')
  await expect(page.getByRole('heading', { level: 1, name: 'Er is iets mis gegaan' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Start opnieuw met invullen' })).toHaveAttribute('href', /^\/#/)
})

test('shows the Melding Form not-found page for an unknown URL', async ({ page }) => {
  const response = await page.goto('e2e-nonexistent-page')

  expect(response?.status()).toBe(404)
  await expect(page).toHaveTitle('Pagina niet gevonden - Gemeente Amsterdam')
  await expect(page.getByRole('heading', { level: 1, name: 'Pagina niet gevonden' })).toBeVisible()
  await expect(page.getByRole('link', { exact: true, name: 'Doe een melding' })).toHaveAttribute('href', /^\/#/)
})
