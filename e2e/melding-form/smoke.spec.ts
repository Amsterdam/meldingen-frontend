import { expect, test } from '@playwright/test'
import translations from 'melding-form/translations/nl.json' with { type: 'json' }

test('shows the cookie error page with a restart link', async ({ page }) => {
  const t = translations['cookie-storing']
  const response = await page.goto('cookie-storing')
  const main = page.getByRole('main')
  const restartLink = main.getByRole('link', { exact: true, name: t.link })

  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle(t.metadata.title)
  await expect(main.getByRole('heading', { exact: true, level: 1, name: t.title })).toBeVisible()
  await expect(restartLink).toBeVisible()
  await expect(restartLink).toHaveAttribute('href', /^\/#/)
})

test('shows the Melding Form not-found page for an unknown URL', async ({ page }) => {
  const t = translations['not-found']
  const response = await page.goto('e2e-nonexistent-page')
  const main = page.getByRole('main')
  const reportLink = main.getByRole('link', { exact: true, name: t.link })

  expect(response?.status()).toBe(404)
  await expect(page).toHaveTitle(t.metadata.title)
  await expect(main.getByRole('heading', { exact: true, level: 1, name: t.title })).toBeVisible()
  await expect(reportLink).toBeVisible()
  await expect(reportLink).toHaveAttribute('href', /^\/#/)
})
