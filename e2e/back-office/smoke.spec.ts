import { expect, test } from '@playwright/test'

test('shows the Back Office not-found page for an unknown URL', async ({ page }) => {
  const response = await page.goto('e2e-nonexistent-page')

  expect(response?.status()).toBe(404)
  await expect(page).toHaveURL('e2e-nonexistent-page')
  await expect(page).toHaveTitle('Pagina niet gevonden - Gemeente Amsterdam')
  await expect(page.getByRole('heading', { level: 1, name: 'Pagina niet gevonden' })).toBeVisible()
  await expect(
    page.getByText(
      'Controleer of de link correct is. Als u de link heeft gekopieerd, controleer dan of u de gehele link heeft gekopieerd.',
      { exact: true },
    ),
  ).toBeVisible()
})
