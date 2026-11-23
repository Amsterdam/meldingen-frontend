import translations from 'back-office/translations/nl.json' with { type: 'json' }

import { expect, test } from './fixtures'

test('shows the Back Office not-found page for an unknown URL', async ({ page }) => {
  const t = translations['not-found']
  const response = await page.goto('e2e-nonexistent-page')

  expect(response?.status()).toBe(404)
  await expect(page).toHaveURL('e2e-nonexistent-page')
  await expect(page).toHaveTitle(t.metadata.title)
  await expect(page.getByRole('heading', { exact: true, level: 1, name: t.title })).toBeVisible()
  await expect(page.getByText(t.description, { exact: true })).toBeVisible()
})
